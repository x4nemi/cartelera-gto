import { ButtonGroup, Button } from "@heroui/react";
import { CalendarIcon } from "./icons";

export type HomeViewMode = "wall" | "calendar";

const WallIcon = ({ size = 20 }: { size?: number }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 256 256"
        fill="currentColor"
        aria-hidden="true"
    >
        <path d="M104,40H56A16,16,0,0,0,40,56v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,104,40Zm0,64H56V56h48ZM200,40H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,64H152V56h48ZM104,136H56a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,104,136Zm0,64H56V152h48ZM200,136H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,200,136Zm0,64H152V152h48Z" />
    </svg>
);

export const ViewToggle = ({
    value,
    onChange,
}: {
    value: HomeViewMode;
    onChange: (mode: HomeViewMode) => void;
}) => {
    return (
        <ButtonGroup variant="flat" radius="full" size="sm">
            <Button
                isIconOnly
                aria-label="Vista de muro"
                aria-pressed={value === "wall"}
                color={value === "wall" ? "primary" : "default"}
                onPress={() => onChange("wall")}
            >
                <WallIcon size={18} />
            </Button>
            <Button
                isIconOnly
                aria-label="Vista de calendario"
                aria-pressed={value === "calendar"}
                color={value === "calendar" ? "primary" : "default"}
                onPress={() => onChange("calendar")}
            >
                <CalendarIcon size={18} />
            </Button>
        </ButtonGroup>
    );
};
