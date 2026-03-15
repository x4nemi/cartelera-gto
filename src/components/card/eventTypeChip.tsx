import { Chip } from "@heroui/react"
import { CalendarFilledIcon, CalendarIcon, LoopIcon, StarIcon } from "../icons"

type EventType = "event" | "workshop" | "calendar" | "draft" | undefined;

const eventTypeConfig = (type: EventType) => {
	switch (type) {
		case "event":
			return { label: "Evento", bgClass: "bg-primary-200", borderClass: "border-primary-400", contentClass: "text-primary-600", icon: <StarIcon size={12} className="ml-0.5 mb-0.5 text-primary-600" /> };
		case "workshop":
			return { label: "Recurrente", bgClass: "bg-violet-200", borderClass: "border-violet-400", contentClass: "text-violet-700", icon: <LoopIcon size={13} className="ml-0.5 mb-0.5 text-violet-600" /> };
		case "calendar":
			return { label: "Calendario", bgClass: "bg-pink-200", borderClass: "border-pink-600", contentClass: "text-pink-400", icon: <CalendarFilledIcon size={15} className="ml-0.5 text-pink-600" /> };
		default:
			return { label: "Evento", bgClass: "bg-default-300", borderClass: "border-default-300", contentClass: "bg-default-100", icon: <CalendarIcon size={12} className="ml-0.5 text-default-700" /> };
	}
}

export const EventTypeChip = ({ type, variant = "card" }: { type?: EventType, variant?: "card" | "drawer" }) => {
	const config = eventTypeConfig(type);
	const isDrawer = variant === "drawer";
	return (
		<Chip
			variant="flat"
			className={`${isDrawer ? "rounded-lg h-8 px-1" : "rounded-2xl h-6 py-3 px-2"} ${config.bgClass} ${config.borderClass}`}
			classNames={{ content: `${config.contentClass} ${isDrawer ? "text-sm" : "pr-0"}` }}
			startContent={config.icon}
		>
			{isDrawer ?config.label : ""}
		</Chip>
	);
}
