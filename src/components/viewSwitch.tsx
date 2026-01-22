import { Button } from '@heroui/button';
import { CalendarIcon, EventIcon } from './icons';

export const ViewSwitch = ({isEventsView, setIsEventsView, className}: {isEventsView: boolean, setIsEventsView: (value: boolean) => void, className?: string}) => {
    
  return (
     <div className="flex flex-col gap-2">
        <Button variant='flat' color='secondary' className={`${!isEventsView ? "pr-7" : ""} ${className ?? ""}`} startContent={isEventsView ? <CalendarIcon /> : <EventIcon />} onPress={() => setIsEventsView(!isEventsView)}>{isEventsView ? "Calendario" : "Eventos"}</Button>
    </div>
  )
}
