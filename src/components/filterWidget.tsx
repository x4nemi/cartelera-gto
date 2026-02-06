import { Button, Card, CardBody, CardHeader, DateRangePicker, Divider, Input } from "@heroui/react";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { useState } from "react";
import { FilterIcon, SortIconAsc, XIcon } from "./icons";
import { ViewSwitch } from "./viewSwitch";

// const sortProperties = ['Fecha']

export const FilterWidget = ({ isAscending, setIsAscending, isEventsView, setIsEventsView }: { isAscending: boolean, setIsAscending: (value: boolean) => void, isEventsView: boolean, setIsEventsView: (value: boolean) => void }) => {
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

    //#region Ordenar
    //#endregion

    return (
        <Card className="w-full backdrop-blur-sm bg-background/60" >
            <CardHeader className="flex justify-between ">
                <div className="flex items-center gap-2">
                    <FilterIcon size={24} />
                    <h4 className="font-bold text-lg">Filtra los eventos</h4>
                </div>
                <ViewSwitch isEventsView={isEventsView} setIsEventsView={setIsEventsView} />
                <Button color="danger" startContent={<XIcon size={17} />} variant="flat" size="sm" isDisabled={!isFiltered} hidden={!isFiltered} onPress={cleanFilters}>
                    Limpiar filtros
                </Button>
            </CardHeader>
            <Divider />
            <CardBody className="w-full flex flex-col md:flex-row md:gap-4 p-0">

                {/* Calendario */}
                <CardBody>
                    <h3 className="text-sm text-default-500 mb-3">Elige rango de fechas:</h3>
                    <DateRangePicker label="" className="max-w-xs" variant="bordered" size="lg" defaultValue={{ start: startDate, end: endDate }} minValue={minDate} visibleMonths={endDate?.month !== startDate?.month ? 2 : 1} onChange={onRangeChange} value={{ start: startDate, end: endDate }} color="default"  />
                </CardBody>
                <Divider orientation="horizontal" className=" md:hidden" />
                <Divider orientation="vertical" className="hidden h-auto md:block" />

                {/* Ordenar */}
                <CardBody>
                    <h3 className="text-sm text-default-500 mb-3">Ordenar:</h3>
                    <div className="flex items-center gap-2">
                        <Input
                            isReadOnly
                            size="lg"
                            defaultValue="Fecha"
                            variant="bordered"
                            label=""
                        />
                        <Button
                            isIconOnly
                            aria-label={isAscending ? "Ordenar descendente" : "Ordenar ascendente"}
                            className="transition-transform duration-300"
                            variant="flat"
                            size="lg"
                            onPress={() => setIsAscending(!isAscending)}
                            style={{ transform: isAscending ? 'rotate(0deg)' : 'rotate(180deg)' }}
                            color="secondary"
                        >
                            <SortIconAsc size={24} />
                        </Button>
                    </div>
                </CardBody>
            </CardBody>
        </Card>
    );
}
