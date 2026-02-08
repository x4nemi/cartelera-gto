import { Alert, Card, CardBody, DateValue, Tab, Tabs } from "@heroui/react"
import { CalendarIcon, EventIcon, LoopIcon } from "../icons";
import { WorkshopCalendar } from "../workshopCalendar";
import { DatesWidget } from "./datesWidget";
import { MonthSelect } from "./monthSelect";

const tabs = [
    {
        label: "Evento",
        icon: <EventIcon size={26} color="bg-secondary" />,
        content: "Ocurre una o pocas veces",
        calendar: (selectedDays: DateValue[], onChange: (days: DateValue[]) => void) => (
            <DatesWidget selectedDays={selectedDays} onChange={onChange} />
        )
    },
    {
        label: "Taller / Curso",
        icon: <LoopIcon size={26} color="bg-secondary" />,
        content: "Es un evento recurrente",
        coso: (selectedDays: string[], onChange: (days: string[]) => void, until: DateValue | null, setUntil: (date: DateValue | null) => void, every: number, setEvery: (num: number) => void) => (
            <WorkshopCalendar days={selectedDays} onChange={onChange} until={until} setUntil={setUntil} every={every} setEvery={setEvery} />
        )
    },
    {
        label: "Calendario",
        icon: <CalendarIcon size={26} color="bg-secondary" />,
        content: "Contiene varios eventos",
        months: (dateRange: { start?: DateValue | undefined, end?: DateValue }, setDateRange: (range: { start: DateValue | null, end: DateValue | null }) => void) => <MonthSelect dateRange={dateRange} setDateRange={setDateRange} />
    },
];

export const EventDates = ({ selectedDays, setSelectedDays, workshopDays, setWorkshopDays, until, setUntil, every, setEvery, dateRange, setDateRange, setType }: { selectedDays: DateValue[], setSelectedDays: (days: DateValue[]) => void, workshopDays: string[], setWorkshopDays: (days: string[]) => void, until: DateValue | null, setUntil: (date: DateValue | null) => void, every: number, setEvery: (num: number) => void, dateRange: { start?: DateValue | undefined, end?: DateValue }, setDateRange: (range: { start: DateValue | null, end: DateValue | null }) => void, setType: (type: "event" | "workshop" | "calendar" | "draft") => void }) => {
    return (
        <>
            <p className="text-sm font-medium text-foreground my-2 mt-3">Tipo de publicación:</p>
            <Tabs title="Elige los días del evento" variant="solid" color="primary" size="lg">
                {tabs.map((tab, index) => (
                    <Tab
                        key={index}
                        title={tab.label}
                        className="w-full"
                        titleValue="hola"
                        onChange={() => {
                            if (index === 0) setType("event");
                            else if (index === 1) setType("workshop");
                            else if (index === 2) setType("calendar");
                            else setType("draft");
                        }}
                    >
                        <Card shadow="none">
                            <CardBody className="w-full flex bg-content1">
                                <Alert variant="flat" description={tab.content} hideIconWrapper color="primary" className="p-0 text-center" classNames={{ iconWrapper: "-mr-2" }} icon={tab.icon} />
                                {tab.calendar && (tab.calendar(selectedDays, setSelectedDays)
                                )}
                                {tab.coso && (tab.coso(workshopDays, setWorkshopDays, until, setUntil, every, setEvery))}
                                {tab.months && tab.months(dateRange, setDateRange)}
                            </CardBody>
                        </Card>
                    </Tab>
                ))}
            </Tabs>
        </>
    )
}
