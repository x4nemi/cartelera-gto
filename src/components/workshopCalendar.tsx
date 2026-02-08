import { DatePicker, DateValue, Input, Select, SelectItem } from '@heroui/react'
import { getLocalTimeZone, today } from '@internationalized/date';

export const WorkshopCalendar = ({ days, onChange, until, setUntil }: { days: string[]; until: DateValue | null; onChange: (days: string[]) => void, setUntil: (date: DateValue | null) => void }) => {
    const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    const validate = (value: string) => {
        const num = parseInt(value);
        if (isNaN(num) || num < 1 || num > 10) {
            return "Por favor ingresa un número entre 1 y 10";
        }
        return true;
    };
     
    return (
        <div className='flex flex-col w-full justify-start gap-2 mt-2'>
            <div className='w-full flex flex-col md:flex-row md:gap-2'>
                <p className="text-sm font-medium text-foreground mt-3 ml-1 mb-2">Selecciona los días de la semana para el taller:</p>
                <Select
                    selectedKeys={days}
                    selectionMode="multiple"
                    onSelectionChange={(keys) => onChange(Array.from(keys) as string[])}
                    fullWidth
                >
                    {daysOfWeek.map((day, index) => (
                        <SelectItem key={index}>{day}</SelectItem>
                    ))}
                </Select>
            </div>
            <div className='flex flex-row items-baseline w-full gap-2'>
                <p className="text-sm font-medium text-foreground mt-3 ml-1">Se repite cada</p>
                <Input
                    type="number"
                    min={1}
                    max={10}
                    className='w-20'
                    validate={validate}
                />
                <p>semana(s)</p>
            </div>
            <div className='flex flex-row gap-2'>
                <p className="text-sm font-medium text-foreground mt-3 ml-1 mb-2">Hasta:</p>
                <DatePicker
                    hideTimeZone
                    showMonthAndYearPickers
                    variant="flat"
                    calendarProps={{ minValue: today(getLocalTimeZone()) }}
                    value={until}
                    onChange={setUntil}
                />
            </div>
            <p className='text-danger italic mt-4 text-sm text-center'>Nota: Si hay una fecha límite de inscripción, entonces selecciónala en &quot;Hasta&quot;. Ya que si seleccionas una fecha posterior, el evento se seguirá viendo en la plataforma.</p>
        </div>
    )
}