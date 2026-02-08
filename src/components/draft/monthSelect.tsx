import { DateRangePicker, DateValue, RangeCalendar } from "@heroui/react"
import { getLocalTimeZone, today } from "@internationalized/date"


export const MonthSelect = ({ dateRange, setDateRange }: { dateRange: { start?: DateValue | undefined, end?: DateValue }, setDateRange: (range: { start: DateValue | null, end: DateValue | null }) => void }) => {
    // min value is the last day of past month
    const minValue = today(getLocalTimeZone()).subtract({ days: today(getLocalTimeZone()).day });

    return (
        <div className='w-full flex flex-col md:gap-2 justify-center items-center'>
            <p className="text-sm font-medium text-foreground mt-3 ml-1 mb-2">Selecciona el rango de fechas:</p>
            <RangeCalendar
                aria-label="Date (Uncontrolled)"
                defaultValue={{
                    start: today(getLocalTimeZone()),
                    end: today(getLocalTimeZone()).add({ months: 1 }),
                }}
                value={dateRange.start && dateRange.end ? { start: dateRange.start, end: dateRange.end } : undefined}
                visibleMonths={2}
                minValue={minValue}
                onChange={setDateRange}
            />
            <DateRangePicker
                isReadOnly
                className="max-w-xs"
                defaultValue={{
                    start: today(getLocalTimeZone()),
                    end: today(getLocalTimeZone()).add({ months: 1 }),
                }}
                value={dateRange.start && dateRange.end ? { start: dateRange.start, end: dateRange.end } : undefined}
            />
        </div>
    )
}
