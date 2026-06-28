import { Spinner } from "@heroui/react";
import { Calendar, Chip } from "@/compat/heroui";
import { Button } from "@/compat/heroui";
import { addToast } from "@/compat/heroui";
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

			// Build a Set of "YYYY-MM-DD" strings for O(1) lookup, locale-independent.
			const selectedSet = new Set<string>();
			internalDatesRef.current.forEach((d) => {
				const y = d.getFullYear();
				const m = String(d.getMonth() + 1).padStart(2, "0");
				const day = String(d.getDate()).padStart(2, "0");
				selectedSet.add(`${y}-${m}-${day}`);
			});

			// Walk each month grid; we infer the year+month from how many grids the
			// calendar shows (visibleMonths={2}, starting at the current focused month).
			// react-aria gives us a stable signal: each grid's first in-month day is "1",
			// and each cell's aria-label always contains the day digit.
			const grids = container.querySelectorAll<HTMLElement>("[role='grid']");
			grids.forEach((grid, gridIdx) => {
				const cells = grid.querySelectorAll<HTMLElement>(
					"td[role='gridcell']:not([data-outside-month]) span[role='button'], " +
					"td[role='gridcell']:not([data-outside-month]) button",
				);

				// Determine this grid's year+month by sampling a cell's aria-label that
				// happens to contain a 4-digit year, falling back to the first cell text.
				let gridYear: number | null = null;
				let gridMonth: number | null = null; // 0-indexed
				for (const cell of cells) {
					const label = cell.getAttribute("aria-label") || "";
					const yearMatch = label.match(/\b(20\d{2})\b/);
					if (yearMatch) gridYear = Number(yearMatch[1]);
					// month name: try matching any of the canonical Spanish/English names
					const monthName = label.toLowerCase();
					const monthMap: Record<string, number> = {
						enero: 0, january: 0,
						febrero: 1, february: 1,
						marzo: 2, march: 2,
						abril: 3, april: 3,
						mayo: 4, may: 4,
						junio: 5, june: 5,
						julio: 6, july: 6,
						agosto: 7, august: 7,
						septiembre: 8, september: 8,
						octubre: 9, october: 9,
						noviembre: 10, november: 10,
						diciembre: 11, december: 11,
					};
					for (const key of Object.keys(monthMap)) {
						if (monthName.includes(key)) {
							gridMonth = monthMap[key];
							break;
						}
					}
					if (gridYear !== null && gridMonth !== null) break;
				}

				// Fallback: assume grid 0 is current focused month from `today()`,
				// grid 1 is the next month.
				if (gridYear === null || gridMonth === null) {
					const base = new Date();
					base.setDate(1);
					base.setMonth(base.getMonth() + gridIdx);
					gridYear = base.getFullYear();
					gridMonth = base.getMonth();
				}

				cells.forEach((el) => {
					// Extract the day from aria-label or text content
					const label = el.getAttribute("aria-label") || el.textContent || "";
					const dayMatch = label.match(/\b(\d{1,2})\b/);
					if (!dayMatch) return;
					const day = Number(dayMatch[1]);

					const y = gridYear!;
					const m = String(gridMonth! + 1).padStart(2, "0");
					const dStr = String(day).padStart(2, "0");
					const key = `${y}-${m}-${dStr}`;
					const matched = selectedSet.has(key);

					if (matched) {
						el.style.setProperty("background-color", "hsl(var(--heroui-primary))", "important");
						el.style.setProperty("color", "hsl(var(--heroui-primary-foreground))", "important");
						el.style.setProperty("box-shadow", "none", "important");
					} else if (el.hasAttribute("data-selected") || el.closest("td")?.hasAttribute("data-selected")) {
						el.style.setProperty("background-color", "transparent", "important");
						el.style.setProperty("color", "inherit", "important");
						el.style.setProperty("box-shadow", "none", "important");
					} else {
						el.style.removeProperty("background-color");
						el.style.removeProperty("color");
						el.style.removeProperty("box-shadow");
					}
				});
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
						<Spinner size="sm" color="accent" />
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
							variant="tertiary"
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
								variant="soft"
								color="accent"
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
	const days = dates.map((d) => {
		const [y, m, day] = d.split("-").map(Number);
		return new Date(y, m - 1, day).getDay();
	});
	const uniqueDays = new Set(days);
	if (uniqueDays.size <= 2 && dates.length >= 4) return "workshop";
	return "calendar";
}
