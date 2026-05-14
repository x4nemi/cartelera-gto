import { Chip } from "@heroui/react";
import { CalendarIcon } from "@/components/icons";
import { AIFieldsValue } from "./AISuggestionsPanel";

interface ReviewSummaryProps {
	fields: AIFieldsValue;
	dates: Date[];
	imageCount?: number;
	ownerName?: string;
}

/** Compact summary card shown in Step 2 so users can sanity-check what they're publishing. */
export const ReviewSummary = ({ fields, dates, imageCount, ownerName }: ReviewSummaryProps) => {
	const title = fields.title?.trim() || "Sin título aún";
	const summary = fields.summary?.trim();
	const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());
	const firstDate = sortedDates[0];
	const dateLabel =
		dates.length === 0
			? null
			: dates.length === 1
				? firstDate.toLocaleDateString("es-MX", {
					weekday: "long",
					day: "numeric",
					month: "long",
				})
				: `${dates.length} fechas · primera ${firstDate.toLocaleDateString("es-MX", {
					day: "numeric",
					month: "short",
				})}`;

	return (
		<div className="rounded-2xl border border-default-200 bg-content1 p-4">
			<p className="text-xs font-medium uppercase tracking-wide text-foreground-500 mb-2">
				Resumen
			</p>

			<h4
				className={`text-base font-semibold ${
					fields.title?.trim() ? "text-foreground" : "text-foreground-400 italic"
				}`}
			>
				{title}
			</h4>

			{summary && (
				<p className="text-sm text-foreground-600 mt-1 line-clamp-2">{summary}</p>
			)}

			<div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs text-foreground-600">
				{dateLabel && (
					<span className="inline-flex items-center gap-1.5">
						<CalendarIcon size={14} className="text-foreground-500" />
						{dateLabel}
					</span>
				)}
				{fields.location?.trim() && (
					<span className="inline-flex items-center gap-1.5">
						<span aria-hidden>📍</span>
						<span className="truncate max-w-[18rem]">{fields.location}</span>
					</span>
				)}
				{fields.price?.trim() && (
					<span className="inline-flex items-center gap-1.5">
						<span aria-hidden>💵</span>
						{fields.price}
					</span>
				)}
				{ownerName?.trim() && (
					<span className="inline-flex items-center gap-1.5 text-foreground-500">
						por <span className="text-foreground-700 font-medium">@{ownerName}</span>
					</span>
				)}
				{typeof imageCount === "number" && imageCount > 0 && (
					<span className="text-foreground-500">
						{imageCount} {imageCount === 1 ? "imagen" : "imágenes"}
					</span>
				)}
			</div>

			{fields.tags && fields.tags.length > 0 && (
				<div className="flex flex-wrap gap-1.5 mt-3">
					{fields.tags.map((t) => (
						<Chip key={t} size="sm" variant="flat">
							{t}
						</Chip>
					))}
				</div>
			)}
		</div>
	);
};
