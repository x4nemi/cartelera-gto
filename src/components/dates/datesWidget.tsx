import { DatePicker } from "@/compat/heroui";
import { Button } from "@/compat/heroui";
import { DateValue, getLocalTimeZone, today } from "@internationalized/date";
import { useState } from "react";
import { MinusIcon, PlusIcon } from "../icons";

export const DatesWidget = ({ selectedDays, onChange }: {
    selectedDays?: DateValue[],
    onChange?: (days: DateValue[]) => void
}) => {
    const initialCount = selectedDays && selectedDays.length > 0 ? selectedDays.length : 1;
    const [widgetIds, setWidgetIds] = useState<number[]>(() => Array.from({ length: initialCount }, (_, i) => i));
    const [nextId, setNextId] = useState<number>(initialCount);

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
                            <DatePicker
                                hideTimeZone
                                showMonthAndYearPickers
                                variant="soft"
                                defaultValue={selectedDays?.[index] ?? undefined}
                                onChange={(date: DateValue | null) => addOrRemoveDate(date as DateValue, widgetId)}
                                calendarProps={{ minValue: today(getLocalTimeZone()) }}
                                minValue={today(getLocalTimeZone())}
                                errorMessage="La fecha seleccionada no es válida."
                                isDateUnavailable={(date: DateValue) => {
                                    // disable dates that are already selected in other widgets
                                    if (selectedDays) {
                                        return selectedDays.some((d, i) => i !== index && d.year === date.year && d.month === date.month && d.day === date.day);
                                    }
                                    return false;
                                }}
                            />
                            <div className="flex gap-1 shrink-0">
                                {(index === widgetIds.length - 1) && selectedDays && selectedDays[index] && (
                                    <Button
                                        isIconOnly
                                        size="md"
                                        radius="md"
                                        variant="tertiary"
                                        color="default"
                                        aria-label="Agregar fecha"
                                        className="text-foreground-500 hover:text-primary hover:bg-primary/10"
                                        onPress={addNewWidget}
                                    >
                                        <PlusIcon size={18} />
                                    </Button>
                                )}
                                {widgetIds.length > 1 && selectedDays && selectedDays[index] && (
                                    <Button
                                        isIconOnly
                                        size="md"
                                        radius="md"
                                        variant="tertiary"
                                        color="default"
                                        aria-label="Eliminar fecha"
                                        className="text-foreground-500 hover:text-danger hover:bg-danger/10"
                                        onPress={() => addOrRemoveDate(null, widgetId)}
                                    >
                                        <MinusIcon size={18} />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}
