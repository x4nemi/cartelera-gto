import { Calendar, Chip } from '@heroui/react'
import { getLocalTimeZone, today, type DateValue } from '@internationalized/date'
import { useState, useEffect, useRef } from 'react'

export const CalendarWidget = ({
    isMobile,
    selectedDays,
    onChange,
}: {
    isMobile: boolean,
    selectedDays?: Date[],
    onChange?: (days: Date[]) => void
}) => {
    const [internalSelectedDays, setInternalSelectedDays] = useState<Date[]>(selectedDays || []);
    const calendarRef = useRef<HTMLDivElement>(null);

    // Sync internal state with props
    useEffect(() => {
        if (selectedDays) {
            setInternalSelectedDays(selectedDays);
        }
    }, [selectedDays]);

    // Helper to check if a date is selected
    const isSelected = (date: Date) =>
        internalSelectedDays.some(d => d.toDateString() === date.toDateString());

    // Apply styling to selected dates in the DOM
    useEffect(() => {
        if (!calendarRef.current) return;

        const applyStyles = () => {
            console.log('Applying styles, calendarRef:', calendarRef.current);
            
            // Query for the actual date cell buttons - they have role="gridcell"
            let allButtons = document.querySelectorAll('[role="gridcell"] button');
            
            if (!allButtons || allButtons.length === 0) {
                // Try alternative selector
                allButtons = document.querySelectorAll('td[role="gridcell"]>span');
            }
            
            console.log('Found buttons:', allButtons?.length, allButtons);
            
            // allButtons?.forEach(button => {
            //     button.removeAttribute('data-selected');
            //     button.setAttribute('aria-selected', 'false');
            // });

            // Apply styling to selected dates
            internalSelectedDays.forEach(date => {
                // Format the date to match aria-label format
                const formattedDate = date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                
                console.log('Looking for date:', formattedDate);
                
                allButtons?.forEach(button => {
                    const ariaLabel = button.getAttribute('aria-label');
                    
                    
                    // Check if aria-label starts with our formatted date
                    if (ariaLabel && ariaLabel.startsWith(formattedDate)) {
                        console.log('MATCH! Setting selected on button:', button);
                        button.className += ' border-2 border-primary'; // Add custom class for selected
                    }
                });
            });
        };

        // Apply styles with a delay to ensure DOM is ready
        setTimeout(applyStyles, 100);

        // Watch for DOM changes (when user navigates months)
        const observer = new MutationObserver(() => {
            setTimeout(applyStyles, 100);
        });

        observer.observe(calendarRef.current, {
            childList: true,
            subtree: true,
        });

        return () => observer.disconnect();
    }, [internalSelectedDays]);

    // Handle day click from Calendar component
    const handleCalendarChange = (value: DateValue) => {
        // Convert DateValue to JavaScript Date
        const jsDate = new Date(value.year, value.month - 1, value.day);
        
        let updatedDays;
        if (isSelected(jsDate)) {
            // Remove if already selected
            updatedDays = internalSelectedDays.filter(d => d.toDateString() !== jsDate.toDateString());
        } else {
            // Add to selected days
            updatedDays = [...internalSelectedDays, jsDate];
        }
        setInternalSelectedDays(updatedDays);
        onChange?.(updatedDays);
    };

    // Handle removing a selected day
    const handleRemoveDay = (date: Date) => {
        const updatedDays = internalSelectedDays.filter(d => d.toDateString() !== date.toDateString());
        // remove data-selected attribute from calendar
        let allButtons = document.querySelectorAll('td[role="gridcell"]>span');
        allButtons.forEach(button => {
            const ariaLabel = button.getAttribute('aria-label');
            if (ariaLabel && ariaLabel.startsWith(date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }))) {
                button.className = button.className.replace(' border-2 border-primary', '');
            }
        });
        setInternalSelectedDays(updatedDays);
        onChange?.(updatedDays);
    };

    return (
        <div className="mt-2 px-2 items-center flex flex-col">
            <p className="text-sm font-medium text-foreground mt-1">Elige los días del evento</p>
            <div className="calendar-multi-select" ref={calendarRef} >
                <Calendar
                    aria-label="Date (Visible Month)"
                    visibleMonths={isMobile ? 1 : 2}
                    showShadow
                    minValue={today(getLocalTimeZone())}
                    onChange={handleCalendarChange}
                />
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
                {internalSelectedDays.map((date, idx) => (
                    <Chip
                        key={idx}
                        variant="flat"
                        onClose={() => handleRemoveDay(date)}
                    >
                        {date.toLocaleDateString()}
                    </Chip>
                ))}
            </div>
        </div>
    );
}
