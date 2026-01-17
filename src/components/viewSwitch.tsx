import { Button } from '@heroui/button';
import { useEffect, useState } from 'react'
import { CalendarIcon, EventIcon } from './icons';

export const ViewSwitch = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [isSelected, setIsSelected] = useState(false)

    const handleSelect = () => {
        localStorage.setItem('viewMode', isSelected ? 'calendar' : 'events')
        setIsSelected(!isSelected)
    }

    useEffect(() => {
        // if localStorage does not have viewMode, set to events
        const storedViewMode = localStorage.getItem('viewMode');
        if (storedViewMode) {
            setIsSelected(storedViewMode === 'events' ? false : true)
        } else {
            localStorage.setItem('viewMode', 'events')
            setIsSelected(false)
        }
        setIsMounted(true);
    }, [isMounted]);
    
    if (!isMounted) return <div className="w-6 h-6" />;
    
  return (
     <div className="flex flex-col gap-2">
        <Button variant='flat' color='secondary' className={!isSelected ? "pr-7" : ""} startContent={isSelected ? <CalendarIcon /> : <EventIcon />} onPress={handleSelect}>{isSelected ? "Calendario" : "Eventos"}</Button>
    </div>
  )
}
