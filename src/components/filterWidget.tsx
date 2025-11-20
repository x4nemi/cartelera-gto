import { Card, CardBody, CardHeader, DateRangePicker, Divider } from "@heroui/react";
import { getLocalTimeZone, today } from "@internationalized/date";

export const FilterWidget = () => {

    return (
        <Card>
            <CardHeader className="flex">
                <h4 className="font-bold text-lg">Filtra los eventos</h4>
            </CardHeader>
            <Divider />
            <CardBody>
                <h3 className="text-sm text-default-500 mb-3">Elige rango de fechas:</h3>
                <DateRangePicker className="max-w-xs" variant="flat" defaultValue={{ start: today(getLocalTimeZone()), end: today(getLocalTimeZone()).add({days: 7}) }} />
            </CardBody>
        </Card>
    );
}
