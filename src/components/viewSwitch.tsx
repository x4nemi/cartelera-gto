import { Button } from '@heroui/button';
import { CalendarIcon, EventIcon } from './icons';

export const ViewSwitch = ({isEventsView, setIsEventsView}: {isEventsView: boolean, setIsEventsView: (value: boolean) => void}) => {
    
  return (
     <div className="flex flex-col gap-2">
        <Button variant='flat' color='secondary' className={!isEventsView ? "pr-7" : ""} startContent={isEventsView ? <CalendarIcon /> : <EventIcon />} onPress={() => setIsEventsView(!isEventsView)}>{isEventsView ? "Calendario" : "Eventos"}</Button>
    </div>
  )
}
