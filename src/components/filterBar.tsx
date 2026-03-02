import React, { useRef, useState } from "react";
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

const ClasificationTab = ({ users, selectedUsernames, onToggleUser }: { users: PostUser[], selectedUsernames: Set<string>, onToggleUser: (username: string) => void }) => {
    return (
        <div className="w-full flex flex-col">
            <p className="text-sm">Mostrar por</p>
            <div className="flex flex-row gap-2 mt-2">
                <Button size="sm">Usuarios</Button>
                <Button size="sm">Tipo de evento</Button>
            </div>
            <div className="flex flex-col w-full items-center mt-3 gap-1 scroll-auto max-h-100">
                {users.map((user) => (
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
                                "cursor-pointer rounded-lg gap-2 p-2 border-2 border-transparent",
                                "data-[selected=true]:bg-content2",
                            ),
                            label: "w-full",
                        }}
                    >
                        <User
                            avatarProps={{ size: "sm", src: user.profilePicUrl }}
                            name={"@" + user.username}
                            classNames={{ name:"text-xs" }}
                        />
                    </Checkbox>
                ))}
            </div>
        </div>
    );
}

const RemoveFiltersTab = ({ removeAllFilters }: { removeAllFilters?: () => void } ) => {
    return (
        <div className="flex gap-1">
            <p>¿Quieres eliminar los filtros aplicados?</p>
            <Button color="danger" onPress={removeAllFilters}>Limpiar filtros</Button>
        </div>
    );
}

const DateTab = ({ dateRange, setDateRange, minValue, applyDateRange }: { dateRange: { start: DateValue; end: DateValue }, setDateRange: (v: { start: DateValue; end: DateValue }) => void, minValue: DateValue, applyDateRange: () => void }) => {
    const localMinDate = // max value between today and the received minValue
        today(getLocalTimeZone()) > minValue
            ? today(getLocalTimeZone())
            : minValue;
    return (
        <div className="flex flex-col gap-2 items-center">
            <RangeCalendar
                aria-label="Rango de fechas"
                value={dateRange}
                onChange={setDateRange}
                minValue={localMinDate}
                visibleMonths={1}
                classNames={{
                    base: "w-full shadow-none bg-transparent",
                    gridWrapper: "w-full",
                    content: "w-full",
                }}
            />
            <Button fullWidth onPress={applyDateRange}>Aplicar cambio</Button>
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

export const FilterBar = ({ allUsers = [], selectedUsernames, onToggleUser, setIsAscendingOrder, onApplyDateRange, removeAllFilters }: { allUsers?: PostUser[], selectedUsernames: Set<string>, onToggleUser: (username: string) => void, setIsAscendingOrder: (isAscending: boolean) => void, onApplyDateRange?: (start: Date, end: Date) => void, removeAllFilters?: () => void }) => {
    const [active, setActive] = useState<number | null>(null);
    const [hovered, setHovered] = useState<number | null>(null);
    const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);


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

    const [dateRange, setDateRange] = useState<{ start: DateValue; end: DateValue }>({
        start: today(getLocalTimeZone()),
        end: today(getLocalTimeZone()).add({ weeks: 1 }),
    });
    const minValue = today(getLocalTimeZone()).subtract({ days: today(getLocalTimeZone()).day });

    const applyDateRange = () => {
        if (onApplyDateRange) {
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
            className="group relative flex flex-col max-w-sm self-center w-full"
            onMouseLeave={handleMouseLeave}
        >
            {/* Background layer that scales on hover */}
            <div className="absolute inset-0 rounded-[20px] bg-content1/50 dark:bg-content2/70 backdrop-blur-sm border-2 border-default/30 transition-transform duration-200 group-hover:scale-x-103 group-hover:py-4" />

            {/* Content stays in place */}
            <div className="relative z-10 overflow-hidden rounded-[20px]">
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
                                            ? <ClasificationTab users={allUsers} selectedUsernames={selectedUsernames} onToggleUser={onToggleUser} />
                                            : i === 1
                                                ? <DateTab dateRange={dateRange} setDateRange={setDateRange} minValue={minValue} applyDateRange={applyDateRange} />
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
                                className={`relative rounded-2xl px-3 py-2.5  font-light cursor-pointer transition-colors duration-150 ${isActive ? "text-white" : "text-foreground"} ${i === items.length - 1 ? "flex-1" : "flex-1/2"}`}
                                onClick={() => { setActive(active === i ? null : i); }}
                                onMouseEnter={() => handleMouseEnter(i)}
                            >
                                {/* Sliding hover highlight */}
                                {isHovered && !isActive && (
                                    <motion.div
                                        layoutId="filter-hover"
                                        className={`absolute inset-0 rounded-2xl ${i === items.length - 1 ? "bg-danger/20" : "bg-default dark:bg-primary-300/40"}`}
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                                    />
                                )}
                                {/* Active pill */}
                                {isActive && (
                                    <motion.div
                                        layoutId="filter-active"
                                        className={`absolute inset-0 rounded-2xl ${i === items.length - 1 ? "bg-danger/20" : "bg-primary dark:bg-primary-400"}`}
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
