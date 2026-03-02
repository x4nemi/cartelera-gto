import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { SortIconAsc } from "./icons";

const items = ["Clasificar", "Fecha", "Ordenar"];



const SortTab = () => {

    const [isAscending, setIsAscending] = useState(true);
    return (
        <div>
            <div className="flex gap-2">
                <Input readOnly value="Fecha" size="lg" />
                <Button
                    isIconOnly
                    aria-label={isAscending ? "Ordenar descendente" : "Ordenar ascendente"}
                    className="transition-transform duration-300"
                    variant="flat"
                    size="lg"
                    onPress={() => setIsAscending(!isAscending)}
                    style={{ transform: isAscending ? 'rotate(0deg)' : 'rotate(180deg)' }}
                    color="primary"
                >
                    <SortIconAsc size={24} />
                </Button></div>
        </div>
    );
}

const ClasificationTab = () => {
    return (
        <div>
            <p>Clasificar por</p>
        </div>
    );
}

const DateTab = () => {
    return (
        <div>
            <p>Filtrar por fecha</p>
            <Input readOnly value="Fecha" />
        </div>
    );
}

const tabContent: Record<number, React.FC> = {
    0: ClasificationTab,
    1: DateTab,
    2: SortTab,
};

export const FilterBar = () => {
    const [active, setActive] = useState<number | null>(null);
    const [hovered, setHovered] = useState<number | null>(null);

    // Show content for hovered tab, or fall back to active tab
    const visibleTab = active;
    const isOpen = visibleTab !== null;

    return (
        <div
            className="group relative flex flex-col max-w-sm self-center w-full"
            onMouseLeave={() => setHovered(null)}
        >
            {/* Background layer that scales on hover */}
            <div className="absolute inset-0 rounded-[20px] bg-content1/50 dark:bg-content2/70 backdrop-blur-sm border-2 border-default/30 transition-transform duration-300 group-hover:scale-x-105 group-hover:scale-y-120" />

            {/* Content stays in place */}
            <div className="relative z-10 overflow-hidden rounded-[20px]">
            {/* Content panel — spring-animated height */}
            <motion.div
                animate={{ height: isOpen ? "auto" : 0 }}
                initial={{ height: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 28, bounce: 0.25 }}
                className="overflow-hidden"
            >
                <div className="px-4 py-3 relative">
                    <AnimatePresence mode="wait">
                        {items.map((_, i) => {
                            if (visibleTab !== i) return null;
                            const TabComponent = tabContent[i];
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, filter: "blur(1px)" }}
                                    animate={{ opacity: 1, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, filter: "blur(1px)" }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <TabComponent />
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
                <div className="mx-3 border-t border-default-200/60" />
            </motion.div>

            {/* Tab buttons at the bottom */}
            <div className="flex gap-1 p-1.5">
                {items.map((item, i) => {
                    const isActive = active === i;
                    const isHovered = hovered === i;
                    return (
                        <button
                            key={item}
                            className={`relative flex-1 rounded-2xl px-4 py-2.5 text-sm font-medium cursor-pointer transition-colors duration-150 ${isActive ? "text-white" : "text-foreground"}`}
                            onClick={() => setActive(active === i ? null : i)}
                            onMouseEnter={() => setHovered(i)}
                        >
                            {/* Sliding hover highlight */}
                            {isHovered && !isActive && (
                                <motion.div
                                    layoutId="filter-hover"
                                    className="absolute inset-0 rounded-xl bg-default-200/60 dark:bg-default-300/40"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                                />
                            )}
                            {/* Active pill */}
                            {isActive && (
                                <motion.div
                                    layoutId="filter-active"
                                    className="absolute inset-0 rounded-xl bg-primary"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                                />
                            )}
                            <span className={`relative z-10 transition-colors duration-300 `}>
                                {item}
                            </span>
                        </button>
                    );
                })}
            </div>
            </div>
        </div>
    );
}
