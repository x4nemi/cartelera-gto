import { Button, Card, CardBody, CardHeader, DateRangePicker, Divider } from "@heroui/react";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { useState } from "react";
import { FilterIcon, XIcon } from "./icons";

export const FilterWidget = () => {
    //#region Fechas
    const minDate = new CalendarDate(2025, 11, 17);

    const [startDate, setStartDate] = useState(today(getLocalTimeZone()));
    const [endDate, setEndDate] = useState(
        today(getLocalTimeZone()).add({ days: 7 })
    );

    const onRangeChange = (range: { start: CalendarDate; end: CalendarDate } | null) => {
        if (range) {
            setStartDate(range.start);
            setEndDate(range.end);

            setIsFiltered(true);
        }
    }
    //#endregion

    //#region Filtros
    const [isFiltered, setIsFiltered] = useState(false)

    const cleanFilters = () => {
        // Reset fechas
        setStartDate(today(getLocalTimeZone()));
        setEndDate(today(getLocalTimeZone()).add({ days: 7 }));

        setIsFiltered(false);
    }
    //#endregion

    return (
        <Card className="w-full">
            <CardHeader className="flex justify-between">
                <div className="flex items-center gap-2">
                    <FilterIcon size={24} />
                    <h4 className="font-bold text-lg">Filtra los eventos</h4>
                </div>
                <Button color="danger" startContent={<XIcon size={17} />} variant="flat" size="sm" isDisabled={!isFiltered} onPress={cleanFilters}>
                    Limpiar filtros
                </Button>
            </CardHeader>
            <Divider />

            {/* Calendario */}
            <CardBody>
                <h3 className="text-sm text-default-500 mb-3">Elige rango de fechas:</h3>
                <DateRangePicker className="max-w-xs" variant="flat" defaultValue={{ start: startDate, end: endDate }} minValue={minDate} visibleMonths={endDate?.month !== startDate?.month ? 2 : 1} onChange={onRangeChange} value={{ start: startDate, end: endDate }} />
            </CardBody>
            <Divider />

            {/*  */}
        </Card>
    );
}
