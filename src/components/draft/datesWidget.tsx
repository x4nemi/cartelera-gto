import { Button, ButtonGroup, DatePicker } from "@heroui/react";
import { DateValue, getLocalTimeZone, today } from "@internationalized/date";
import { useState } from "react";
import { MinusIcon, PlusIcon } from "../icons";

export const DatesWidget = ({ selectedDays, onChange }: {
    selectedDays?: DateValue[],
    onChange?: (days: DateValue[]) => void
}) => {
    const [widgetIds, setWidgetIds] = useState<number[]>([0]);
    const [nextId, setNextId] = useState<number>(1);

    const addOrRemoveDate = (date: DateValue | null, widgetId: number) => {
        const index = widgetIds.indexOf(widgetId);
        let newDates: DateValue[] = selectedDays ? [...selectedDays] : [];

        if (date) {
            // add or update date at index
            newDates[index] = date;
        } else {
            // Remove the date at this index
            newDates = newDates.filter((_, i) => i !== index);
            // Remove this widget ID
            setWidgetIds(widgetIds.filter(id => id !== widgetId));
        }
        onChange && onChange(newDates);
    }

    const addNewWidget = () => {
        setWidgetIds([...widgetIds, nextId]);
        setNextId(nextId + 1);
    }

    return (
        <div className="w-full flex flex-col gap-4">
            <p className="text-sm font-medium text-foreground mt-3 ml-1 -mb-2">Día(s) del evento:</p>
            <div className="flex flex-col gap-1">
                {
                    widgetIds.map((widgetId, index) => (
                        <div className="flex gap-1 transition-all duration-200" key={widgetId}>
                            <ButtonGroup className="rounded-none">
                                {//only show add button on the last widget and when there is a selected date
                                    (index === widgetIds.length - 1) && selectedDays && selectedDays[index] && <Button isIconOnly onPress={addNewWidget} color="primary" variant="flat"><PlusIcon size={18} /></Button>
                                }
                                {//show remove button if there is more than one widget and not on the last empty widget
                                    widgetIds.length > 1 && selectedDays && selectedDays[index] &&
                                    <Button isIconOnly variant="flat" onPress={() => {
                                        addOrRemoveDate(null, widgetId);
                                    }} className="rounded-l-none" color={"danger"}><MinusIcon size={18} /></Button>
                                }
                            </ButtonGroup>
                            <DatePicker
                                hideTimeZone
                                showMonthAndYearPickers
                                variant="flat"
                                onChange={(date) => addOrRemoveDate(date, widgetId)}
                                calendarProps={{ minValue: today(getLocalTimeZone()) }}
                                isDateUnavailable={(date) => {
                                    // disable dates that are already selected in other widgets
                                    if (selectedDays) {
                                        return selectedDays.some((d, i) => i !== index && d.year === date.year && d.month === date.month && d.day === date.day);
                                    }
                                    return false;
                                }}
                            />

                        </div>
                    ))
                }
            </div>
        </div>
    );
}
