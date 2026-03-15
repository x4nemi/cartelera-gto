import { Button, Calendar, Chip, Spinner, addToast } from "@heroui/react";
import { getLocalTimeZone, today, type DateValue } from "@internationalized/date";
import { useState, useEffect, useRef, useCallback } from "react";
import { SparklesIcon } from "../icons";
import { AIApi } from "../../config/apiClient";

const MAX_RECURRING_MONTHS = 2;

/** Generate every occurrence of the given weekdays from today up to maxMonths ahead. */
function generateRecurringDates(daysOfWeek: number[], endDate: Date): Date[] {
	const results: Date[] = [];
	const start = new Date();
	start.setHours(0, 0, 0, 0);
	const cursor = new Date(start);
	while (cursor <= endDate) {
		if (daysOfWeek.includes(cursor.getDay())) {
			results.push(new Date(cursor));
		}
		cursor.setDate(cursor.getDate() + 1);
	}
	return results;
}

interface SmartDatePickerProps {
	selectedDates: Date[];
	onChange: (dates: Date[]) => void;
	/** Caption text or image URLs to send for AI extraction */
	caption?: string;
	imageUrls?: string[];
}

export const SmartDatePicker = ({
	selectedDates,
	onChange,
	caption,
	imageUrls,
}: SmartDatePickerProps) => {
	const [internalDates, setInternalDates] = useState<Date[]>(selectedDates);
	const [isExtracting, setIsExtracting] = useState(false);
	const [hasAutoExtracted, setHasAutoExtracted] = useState(false);
	const [showAiBanner, setShowAiBanner] = useState(false);
	const calendarRef = useRef<HTMLDivElement>(null);
	const internalDatesRef = useRef(internalDates);
	internalDatesRef.current = internalDates;

	useEffect(() => {
		setInternalDates(selectedDates);
	}, [selectedDates]);

	const isSelected = (date: Date) =>
		internalDates.some((d) => d.toDateString() === date.toDateString());

	const extractDates = useCallback(async (text?: string) => {
		setIsExtracting(true);
		try {
			const result = await AIApi.extractDates({
				text: text || caption,
				imageUrls,
			});

			if (result.type === "specific") {
				const parsed = result.dates
					.map((d: string) => {
						const [y, m, day] = d.split("-").map(Number);
						return new Date(y, m - 1, day);
					})
					.filter((d: Date) => !isNaN(d.getTime()));
				if (parsed.length > 0) {
					setInternalDates(parsed);
					onChange(parsed);
					setShowAiBanner(true);
				}
			} else if (result.type === "recurring") {
				const endDate = new Date();
				endDate.setMonth(endDate.getMonth() + MAX_RECURRING_MONTHS);
				const generated = generateRecurringDates(result.daysOfWeek, endDate);
				if (generated.length > 0) {
					setInternalDates(generated);
					onChange(generated);
					setShowAiBanner(true);
				}
			}
			// type === "none" → do nothing
		} catch {
			addToast({
				title: "No se pudieron extraer las fechas",
				description: "Intenta seleccionarlas manualmente en el calendario.",
				color: "danger",
			});
		} finally {
			setIsExtracting(false);
		}
	}, [caption, imageUrls]);

	// Auto-extract when caption or images become available
	useEffect(() => {
		if (hasAutoExtracted) return;
		if (!caption && (!imageUrls || imageUrls.length === 0)) return;
		setHasAutoExtracted(true);
		extractDates();
	}, [caption, imageUrls, hasAutoExtracted, extractDates]);

	// Auto-dismiss AI banner after 10s or on date change
	useEffect(() => {
		if (!showAiBanner) return;
		const timer = setTimeout(() => setShowAiBanner(false), 10000);
		return () => clearTimeout(timer);
	}, [showAiBanner]);

	const handleCalendarChange = (value: DateValue) => {
		setShowAiBanner(false);
		const jsDate = new Date(value.year, value.month - 1, value.day);

		let updated: Date[];
		if (isSelected(jsDate)) {
			updated = internalDates.filter((d) => d.toDateString() !== jsDate.toDateString());
		} else {
			updated = [...internalDates, jsDate];
		}

		updated.sort((a, b) => a.getTime() - b.getTime());
		internalDatesRef.current = updated;
		setInternalDates(updated);
		onChange(updated);
	};

	const handleRemoveDate = (date: Date) => {
		setShowAiBanner(false);
		const updated = internalDates.filter((d) => d.toDateString() !== date.toDateString());
		internalDatesRef.current = updated;
		setInternalDates(updated);
		onChange(updated);
	};

	const handleClearAll = () => {
		setShowAiBanner(false);
		internalDatesRef.current = [];
		setInternalDates([]);
		onChange([]);
	};

	// Highlight selected dates and hide out-of-month dates
	useEffect(() => {
		const container = calendarRef.current;
		if (!container) return;
		let applying = false;

		const applyStyles = () => {
			if (applying) return;
			applying = true;
			const container = calendarRef.current;
			if (!container) { applying = false; return; }

			// Hide dates that belong to other months
			container.querySelectorAll<HTMLElement>("td[data-outside-month]").forEach((td) => {
				td.style.visibility = "hidden";
				td.style.pointerEvents = "none";
				const el = td.querySelector<HTMLElement>("span, button");
				if (el) {
					el.style.visibility = "hidden";
				}
			});

			// Build lookup set from latest ref
			const highlightSet = new Set<string>();
			internalDatesRef.current.forEach((d) => {
				const label = d.toLocaleDateString("es-MX", {
					weekday: "long",
					year: "numeric",
					month: "long",
					day: "numeric",
				});
				highlightSet.add(label);
			});

			container.querySelectorAll<HTMLElement>("td[role='gridcell'] span[role='button'], td[role='gridcell'] button").forEach((el) => {
				const ariaLabel = el.getAttribute("aria-label") ?? "";
				const matched = [...highlightSet].some((k) => ariaLabel.startsWith(k));

				if (matched) {
					// Our selected date → blue
					el.style.setProperty("background-color", "hsl(var(--heroui-primary))", "important");
					el.style.setProperty("color", "hsl(var(--heroui-primary-foreground))", "important");
					el.style.setProperty("box-shadow", "none", "important");
				} else if (el.hasAttribute("data-selected") || el.closest("td")?.hasAttribute("data-selected")) {
					// HeroUI marked this as selected but it's NOT in our list → neutralize
					el.style.setProperty("background-color", "transparent", "important");
					el.style.setProperty("color", "inherit", "important");
					el.style.setProperty("box-shadow", "none", "important");
				} else {
					// Regular cell → clear any leftover inline styles
					el.style.removeProperty("background-color");
					el.style.removeProperty("color");
					el.style.removeProperty("box-shadow");
				}
			});
			applying = false;
		};

		// Apply immediately + delayed to catch HeroUI async renders
		setTimeout(applyStyles, 0);
		setTimeout(applyStyles, 100);

		// Watch for DOM changes AND attribute changes on the spans
		const observer = new MutationObserver(() => {
			setTimeout(applyStyles, 50);
		});

		observer.observe(container, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ["data-selected", "data-hover"],
		});

		return () => observer.disconnect();
	}, [internalDates]);

	return (
		<div className="flex flex-col gap-3 mt-2">
			{/* AI extraction input */}
			<div className="flex flex-col gap-2">
				<p className="text-sm font-medium text-foreground ml-1">
					Fechas del evento
				</p>

				{/* Extracting indicator */}
				{isExtracting && (
					<div className="flex items-center gap-2 p-3 rounded-xl bg-secondary-50 border border-secondary-200">
						<Spinner size="sm" color="secondary" />
						<p className="text-sm text-secondary-600">Analizando publicación para extraer fechas...</p>
					</div>
				)}

				{/* AI extracted info banner */}
				{showAiBanner && !isExtracting && internalDates.length > 0 && (
					<div className="flex items-center gap-2 p-3 rounded-xl bg-secondary-50 border border-secondary-200">
						<SparklesIcon size={14} className="text-secondary-600" />
						<p className="text-sm text-secondary-600">
							Estas son las fechas que detectamos. Puedes eliminarlas o agregar más en el calendario.
						</p>
					</div>
				)}
			</div>

			{/* Calendar multi-select */}
			<div className="flex justify-center" ref={calendarRef}>
				<Calendar
					aria-label="Selecciona las fechas del evento"
					visibleMonths={2}
					showShadow
					showMonthAndYearPickers
					minValue={today(getLocalTimeZone())}
					onChange={handleCalendarChange}
				/>
			</div>

			{/* Selected dates chips */}
			{internalDates.length > 0 && (
				<div className="flex flex-col gap-2">
					<div className="flex items-center justify-between">
						<p className="text-sm text-default-500 ml-1">
							{internalDates.length} fecha{internalDates.length !== 1 ? "s" : ""} seleccionada{internalDates.length !== 1 ? "s" : ""}
						</p>
						<Button
							size="sm"
							variant="light"
							color="danger"
							onPress={handleClearAll}
						>
							Limpiar todo
						</Button>
					</div>
					<div className="flex flex-wrap gap-2">
						{internalDates.map((date, idx) => (
							<Chip
								key={idx}
								variant="flat"
								color="primary"
								onClose={() => handleRemoveDate(date)}
							>
								{date.toLocaleDateString("es-MX", {
									weekday: "short",
									day: "numeric",
									month: "short",
								})}
							</Chip>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

/**
 * Infer the event type from a flat list of dates.
 * - 1-3 dates → "event"
 * - 4+ dates on ≤2 unique weekdays → "workshop" (recurring pattern)
 * - otherwise → "calendar"
 */
export function inferEventType(dates: string[]): "event" | "workshop" | "calendar" {
	if (dates.length <= 3) return "event";
	const days = dates.map((d) => new Date(d).getDay());
	const uniqueDays = new Set(days);
	if (uniqueDays.size <= 2 && dates.length >= 4) return "workshop";
	return "calendar";
}
