import { Button, Chip, Input, Spinner, Textarea, Tooltip } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AIApi, AISuggestions } from "@/config/apiClient";

/** What the parent collects: the user-edited (or accepted) values, ready to write to PostData. */
export interface AIFieldsValue {
	title?: string;
	summary?: string;
	tags?: string[];
	location?: string;
	price?: string;
}

interface AISuggestionsPanelProps {
	/** Caption text used as the AI input. */
	caption?: string;
	/** Optional images to give the AI more context. */
	imageUrls?: string[];
	/** Current user-edited values (controlled). */
	value: AIFieldsValue;
	onChange: (next: AIFieldsValue) => void;
	/** Called whenever a fresh AI suggestion arrives, so parent can persist `aiSuggestions` if it wants. */
	onSuggestions?: (suggestions: AISuggestions | null) => void;
}

function makeKey(caption?: string, imageUrls?: string[]) {
	return `${caption || ""}::${(imageUrls || []).join(",")}`;
}

function ConfidenceDot({ score }: { score: number | undefined }) {
	if (score === undefined) return null;
	const color =
		score >= 0.75 ? "bg-success" : score >= 0.45 ? "bg-warning" : "bg-default-400";
	const label =
		score >= 0.75 ? "Confianza alta" : score >= 0.45 ? "Confianza media" : "Confianza baja";
	return (
		<Tooltip content={`${label} (${Math.round(score * 100)}%)`}>
			<span className={`inline-block w-2 h-2 rounded-full ${color}`} />
		</Tooltip>
	);
}

export const AISuggestionsPanel = ({
	caption,
	imageUrls,
	value,
	onChange,
	onSuggestions,
}: AISuggestionsPanelProps) => {
	const [loading, setLoading] = useState(false);
	const [suggestions, setSuggestions] = useState<AISuggestions | null>(null);
	const [tagInput, setTagInput] = useState("");
	const inflightKeyRef = useRef<string>("");
	const appliedKeyRef = useRef<string>("");

	// Auto-extract on caption/images change. Dedupe via inflightKeyRef so React 18
	// StrictMode's double-invoke can't strand the spinner.
	useEffect(() => {
		const key = makeKey(caption, imageUrls);
		if (!caption && (!imageUrls || imageUrls.length === 0)) return;
		if (key === inflightKeyRef.current) return;
		inflightKeyRef.current = key;

		let cancelled = false;
		setLoading(true);
		AIApi.extractEventDetails({ text: caption, imageUrls })
			.then((res) => {
				if (!res) {
					setSuggestions(null);
					if (!cancelled) onSuggestions?.(null);
					return;
				}
				const next: AISuggestions = {
					title: res.title,
					summary: res.summary,
					tags: res.tags,
					location: res.location,
					price: res.price,
					eventType: res.eventType,
					confidence: res.confidence,
					extractedAt: new Date().toISOString(),
				};
				setSuggestions(next);
				if (!cancelled) onSuggestions?.(next);
			})
			.finally(() => {
				setLoading(false);
				if (inflightKeyRef.current === key) inflightKeyRef.current = "";
			});

		return () => {
			cancelled = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [caption, (imageUrls || []).join(",")]);

	// Auto-apply suggestions to empty fields, exactly once per suggestion payload.
	// Never overwrites user edits — only fills blanks.
	useEffect(() => {
		if (!suggestions) return;
		const key = suggestions.extractedAt || "";
		if (appliedKeyRef.current === key) return;
		appliedKeyRef.current = key;

		const next: AIFieldsValue = { ...value };
		let changed = false;
		if (!next.title?.trim() && suggestions.title) {
			next.title = suggestions.title;
			changed = true;
		}
		if (!next.summary?.trim() && suggestions.summary) {
			next.summary = suggestions.summary;
			changed = true;
		}
		if (!next.location?.trim() && suggestions.location) {
			next.location = suggestions.location;
			changed = true;
		}
		if (!next.price?.trim() && suggestions.price) {
			next.price = suggestions.price;
			changed = true;
		}
		if (
			(!next.tags || next.tags.length === 0) &&
			suggestions.tags &&
			suggestions.tags.length > 0
		) {
			next.tags = suggestions.tags.slice(0, 5);
			changed = true;
		}
		if (changed) onChange(next);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [suggestions]);

	const editField = <K extends keyof AIFieldsValue>(field: K, next: AIFieldsValue[K]) => {
		onChange({ ...value, [field]: next });
	};

	const addTag = (raw: string) => {
		const tag = raw.trim().toLowerCase();
		if (!tag) return;
		const current = value.tags ?? [];
		if (current.includes(tag)) return;
		if (current.length >= 5) return;
		onChange({ ...value, tags: [...current, tag] });
	};

	const removeTag = (tag: string) => {
		onChange({ ...value, tags: (value.tags ?? []).filter((t) => t !== tag) });
	};

	return (
		<div className="flex flex-col gap-3">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h4 className="text-sm font-semibold">Datos del evento</h4>
					<p className="text-xs text-foreground-500 mt-0.5">
						Pre-llenado con IA. Edita lo que necesites.
					</p>
				</div>
				{loading && (
					<div className="flex items-center gap-2 text-xs text-foreground-500">
						<Spinner size="sm" />
						<span>Analizando…</span>
					</div>
				)}
			</div>

			<FieldBlock label="Título" confidence={suggestions?.confidence?.title}>
				<Input
					size="sm"
					variant="bordered"
					placeholder="Nombre del evento"
					value={value.title ?? ""}
					onValueChange={(v) => editField("title", v)}
				/>
			</FieldBlock>

			<FieldBlock label="Resumen" confidence={suggestions?.confidence?.summary}>
				<Textarea
					size="sm"
					variant="bordered"
					placeholder="Breve descripción"
					value={value.summary ?? ""}
					onValueChange={(v) => editField("summary", v)}
					minRows={2}
					maxRows={4}
				/>
			</FieldBlock>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
				<FieldBlock label="Lugar" confidence={suggestions?.confidence?.location}>
					<Input
						size="sm"
						variant="bordered"
						placeholder="Lugar del evento"
						value={value.location ?? ""}
						onValueChange={(v) => editField("location", v)}
					/>
				</FieldBlock>

				<FieldBlock label="Costo" confidence={suggestions?.confidence?.price}>
					<Input
						size="sm"
						variant="bordered"
						placeholder="Costo o entrada"
						value={value.price ?? ""}
						onValueChange={(v) => editField("price", v)}
					/>
				</FieldBlock>
			</div>

			<div>
				<div className="flex items-center justify-between mb-1.5">
					<div className="flex items-center gap-2">
						<label className="text-xs font-medium text-foreground-700">
							Categorías
						</label>
						<ConfidenceDot score={suggestions?.confidence?.tags} />
					</div>
					<span className="text-[10px] text-foreground-400">
						{(value.tags ?? []).length}/5
					</span>
				</div>

				<div className="flex flex-wrap gap-1.5 mb-2">
					{(value.tags ?? []).length > 0 ? (
						(value.tags ?? []).map((tag) => (
							<Chip
								key={tag}
								size="sm"
								variant="flat"
								onClose={() => removeTag(tag)}
							>
								{tag}
							</Chip>
						))
					) : (
						<span className="text-xs text-foreground-400 italic">
							Sin categorías.
						</span>
					)}
				</div>

				<div className="flex gap-2">
					<Input
						size="sm"
						variant="bordered"
						placeholder="Agregar categoría"
						value={tagInput}
						onValueChange={setTagInput}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								addTag(tagInput);
								setTagInput("");
							}
						}}
						className="flex-1"
					/>
					<Button
						size="sm"
						variant="flat"
						onPress={() => {
							addTag(tagInput);
							setTagInput("");
						}}
						isDisabled={!tagInput.trim() || (value.tags ?? []).length >= 5}
					>
						Agregar
					</Button>
				</div>
			</div>
		</div>
	);
};

interface FieldBlockProps {
	label: string;
	confidence?: number;
	children: ReactNode;
}

const FieldBlock = ({ label, confidence, children }: FieldBlockProps) => (
	<div>
		<div className="flex items-center gap-2 mb-1.5">
			<label className="text-xs font-medium text-foreground-700">{label}</label>
			<ConfidenceDot score={confidence} />
		</div>
		{children}
	</div>
);
