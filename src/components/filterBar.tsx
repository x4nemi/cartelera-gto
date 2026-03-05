import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { CalendarIcon, SortIconAsc, ViewIcon, XIcon } from "./icons";
import { Checkbox, cn, DateValue, User } from "@heroui/react";
import { RangeCalendar } from "@heroui/calendar";
import { getLocalTimeZone, today } from "@internationalized/date";

interface PostUser {
    username: string;
    profilePicUrl: string;
}

const items = ["Mostrar", "Fecha", "Ordenar", ""];

const SortTab = ({setIsAscendingOrder}: { setIsAscendingOrder: (isAscending: boolean) => void }) => {

    const [isAscending, setIsAscending] = useState(true);
    return (
        <div>
            <div className="flex gap-2 items-end">
                <Input readOnly value="Fecha" size="sm" label="Ordenar por:" labelPlacement="outside-top"/>
                <Button
                    isIconOnly
                    aria-label={isAscending ? "Ordenar descendente" : "Ordenar ascendente"}
                    className="transition-transform duration-300"
                    variant="flat"
                    size="lg"
                    onPress={() => { setIsAscending(!isAscending); setIsAscendingOrder(!isAscending); }}
                    style={{ transform: isAscending ? 'rotate(0deg)' : 'rotate(180deg)' }}
                    color="primary"
                >
                    <SortIconAsc size={24} />
                </Button></div>
        </div>
    );
}

const ClasificationTab = ({ users, selectedUsernames, onToggleUser, eventTypes, setEventTypes }: { users: PostUser[], selectedUsernames: Set<string>, onToggleUser: (username: string) => void, setEventTypes: (types: string[]) => void, eventTypes: string[] }) => {
    const [view, setview] = useState("users")
    const types = ["Evento", "Recurrente", "Calendario"];
    const englishTypes = ["event", "workshop", "calendar"];

    const onToggleType = (type: string) => {
        if (eventTypes.includes(type)) {
            setEventTypes(eventTypes.filter(t => t !== type));
        } else {
            setEventTypes([...eventTypes, type]);
        }
        
    }
    return (
        <div className="w-full flex flex-col">
            <p className="text-sm">Mostrar por</p>
            <div className="flex flex-row gap-2 mt-2">
                <Button size="sm" variant="flat" color={view === "users" ? "primary" : "default"} onPress={() => setview("users")}>Usuarios</Button>
                <Button size="sm" variant="flat" color={view === "eventType" ? "primary" : "default"} onPress={() => setview("eventType")}>Tipo de evento</Button>
            </div>
            <div className="flex flex-col w-full items-center mt-3 gap-4 scroll-auto max-h-100">
                {view === "users" ? users.map((user) => (
                    <Checkbox
                        key={user.username}
                        size="sm"
                        aria-label={user.username}
                        isSelected={selectedUsernames.has(user.username)}
                        onValueChange={() => onToggleUser(user.username)}
                        classNames={{
                            base: cn(
                                "inline-flex w-full max-w-md bg-content1",
                                "hover:bg-content2 items-center justify-start",
                                "cursor-pointer rounded-none last:rounded-b-xl first:rounded-t-xl gap-2 p-3",
                            ),
                            label: "w-full ",
                        }}
                    >
                        <User
                            avatarProps={{ size: "sm", src: user.profilePicUrl }}
                            name={"@" + user.username}
                            classNames={{ name:"text-xs" }}
                        />
                    </Checkbox>
                )): 
                 types.map((type) => (
                    <Checkbox                  
                        size="sm"
                        key={type}
                        aria-label={type}
                        classNames={{
                            base: cn(
                                "inline-flex w-full max-w-md bg-content1",
                                "hover:bg-content2 items-center justify-start",
                                "cursor-pointer rounded-none last:rounded-b-xl first:rounded-t-xl gap-2 p-3",
                            ),
                            label: "w-full",
                        }}
                        isSelected={eventTypes.includes(englishTypes[types.indexOf(type)])}
                        onValueChange={() => onToggleType(englishTypes[types.indexOf(type)])}
                    >
                        <span className="text-sm">{type}</span>
                    </Checkbox>
                 ))
            }
            </div>
        </div>
    );
}

const RemoveFiltersTab = ({ removeAllFilters }: { removeAllFilters?: () => void } ) => {
    return (
        <div className="flex gap-1">
            <p className="text-sm">¿Quieres eliminar los filtros aplicados?</p>
            <Button color="danger" onPress={removeAllFilters}>Limpiar filtros</Button>
        </div>
    );
}

const DateTab = ({ dateRange, setDateRange, applyDateRange }: { dateRange?: { start: DateValue | null; end: DateValue | null }, setDateRange: (v: { start: DateValue | null; end: DateValue | null }) => void, applyDateRange: () => void }) => {
    return (
        <div className="flex flex-col gap-2 items-center">
            <RangeCalendar
                aria-label="Rango de fechas"
                value={dateRange && dateRange.start && dateRange.end ? { start: dateRange.start, end: dateRange.end } : undefined}
                onChange={setDateRange}
                visibleMonths={1}
                classNames={{
                    base: "w-full shadow-none",
                    gridWrapper: "w-full",
                    content: "w-full",
                }}
            />
            <Button fullWidth onPress={applyDateRange} color="success" variant="flat" disabled={!dateRange || !dateRange.start || !dateRange.end}>Aplicar cambio</Button>
        </div>
    );
}

const tabContent: Record<number, React.FC<any>> = {
    0: ClasificationTab,
    1: DateTab,
    2: SortTab,
    3: RemoveFiltersTab,
};

const tabIcons: Record<number, React.FC<{ size?: number }>> = {
    0: ViewIcon,
    1: CalendarIcon,
    2: SortIconAsc,
    3: XIcon
};

export const FilterBar = ({ allUsers = [], selectedUsernames, onToggleUser, setIsAscendingOrder, onApplyDateRange, removeAllFilters, setEventTypes, eventTypes }: { allUsers?: PostUser[], selectedUsernames: Set<string>, onToggleUser: (username: string) => void, setIsAscendingOrder: (isAscending: boolean) => void, onApplyDateRange?: (start: Date, end: Date) => void, removeAllFilters?: () => void, setEventTypes: (types: string[]) => void, eventTypes: string[] }) => {
    const [active, setActive] = useState<number | null>(null);
    const [hovered, setHovered] = useState<number | null>(null);
    const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const barRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (barRef.current && !barRef.current.contains(e.target as Node)) {
                setActive(null);
                setHovered(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const clearHoverTimeout = () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
    };

    const handleMouseLeave = () => {
        clearHoverTimeout();
        hoverTimeoutRef.current = setTimeout(() => {
            setHovered(null);
        }, 1000);
    };

    const handleMouseEnter = (i: number) => {
        clearHoverTimeout();
        setHovered(i);
    };

    const [dateRange, setDateRange] = useState<{ start: DateValue | null; end: DateValue | null }>({
        start: today(getLocalTimeZone()),
        end: today(getLocalTimeZone()),
    });

    const applyDateRange = () => {
        if (onApplyDateRange && dateRange.start && dateRange.end) {
            const startDate = dateRange.start.toDate(getLocalTimeZone());
            const endDate = dateRange.end.toDate(getLocalTimeZone());
            onApplyDateRange(startDate, endDate);
        }
    };

    // Show content for hovered tab, or fall back to active tab
    const visibleTab = active;
    const isOpen = visibleTab !== null;

    return (
        <div
            ref={barRef}
            className="group relative flex flex-col max-w-sm self-center w-full"
            onMouseLeave={handleMouseLeave}
        >
            {/* Background layer that scales on hover */}
            <div className="absolute inset-0 rounded-3xl bg-content1/50 dark:bg-content2/70 backdrop-blur-sm border-2 border-default/30 transition-transform duration-200 group-hover:scale-x-103 group-hover:scale-y-104 " />

            {/* Content stays in place */}
            <div className="relative z-10 overflow-hidden rounded-3xl">
                {/* Content panel — spring-animated height */}
                <motion.div
                    animate={{ height: isOpen ? "auto" : 0 }}
                    initial={{ height: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 28, bounce: 0.25, duration: 0.5 }}
                    className={isOpen ? "overflow-visible" : "overflow-hidden"}
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
                                        {i === 0
                                            ? <ClasificationTab users={allUsers} selectedUsernames={selectedUsernames} onToggleUser={onToggleUser} eventTypes={eventTypes} setEventTypes={setEventTypes} />
                                            : i === 1
                                                ? <DateTab dateRange={dateRange} setDateRange={setDateRange} applyDateRange={applyDateRange} />
                                                : i === 2
                                                    ? <SortTab setIsAscendingOrder={setIsAscendingOrder} />
                                                    : <TabComponent removeAllFilters={removeAllFilters} />}
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
                                className={`relative rounded-3xl px-3 py-2.5  font-light cursor-pointer transition-colors duration-150 ${isActive ? "text-white" : "text-foreground"} ${i === items.length - 1 ? "flex-1" : "flex-1/2"}`}
                                onClick={() => { setActive(active === i ? null : i); }}
                                onMouseEnter={() => handleMouseEnter(i)}
                            >
                                {/* Sliding hover highlight */}
                                {isHovered && !isActive && (
                                    <motion.div
                                        layoutId="filter-hover"
                                        className={`absolute inset-0 rounded-3xl ${i === items.length - 1 ? "bg-danger/20" : "bg-default dark:bg-primary-300/40"}`}
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                                    />
                                )}
                                {/* Active pill */}
                                {isActive && (
                                    <motion.div
                                        layoutId="filter-active"
                                        className={`absolute inset-0 rounded-3xl ${i === items.length - 1 ? "bg-danger/20" : "bg-primary dark:bg-primary-400"}`}
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                                    />
                                )}
                                <span className={`relative z-10 transition-colors duration-300 flex justify-center items-center gap-1 ${isActive ? "text-white" : ""}`}>
                                    {tabIcons[i] && React.createElement(tabIcons[i], { size: 20 })}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
