import { useEffect, useState, useMemo } from 'react'
import { EventCard } from './eventCard';
import { EventCardProps } from './interfaces';

export const Wall = ({ cardsData = [] }: { cardsData?: EventCardProps[] }) => {
    // Estado para el ancho de la ventana (solo en cliente)
    const [windowWidth, setWindowWidth] = useState(0);

    // Efecto para manejar el tamaño de la ventana
    useEffect(() => {
        // Solo ejecutar en el navegador
        if (typeof window === 'undefined') return;
        
        // Establecer el ancho inicial
        setWindowWidth(window.innerWidth);
        
        // Función para actualizar el ancho de la ventana
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        
        // Añadir event listener para resize
        window.addEventListener('resize', handleResize);
        
        // Limpiar event listener
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []); // Sin dependencias - solo se ejecuta al montar
    
    // Calcular el número de columnas basado en el ancho de la ventana
    const numColumns = useMemo(() => {
        if (windowWidth >= 1536) return 3;        // 2xl
        else if (windowWidth >= 1024) return 2;   // xl
        else return 1;                            // lg, md, sm
    }, [windowWidth]);
    
    // Distribuir las tarjetas en columnas usando useMemo
    const { column1, column2, column3 } = useMemo(() => {
        return {
            column1: cardsData.filter((_, index) => index % numColumns === 0),
            column2: cardsData.filter((_, index) => index % numColumns === 1),
            column3: cardsData.filter((_, index) => index % numColumns === 2)
        };
    }, [numColumns]);

    return (
        <div className="container mx-auto">
            <div className='grid xl:grid-cols-2 2xl:grid-cols-3 lg:grid-cols-1 md:grid-cols-1 sm:grid-cols-1 gap-3'>
                <div className='flex flex-col gap-3'>
                    {column1.map((card, index) => (
                        <div key={`col1-${index}`} className="card-wrapper">
                            <EventCard {...card} />
                        </div>
                    ))}
                </div>
                {numColumns > 1 && <div className='flex flex-col gap-3'>
                    {column2.map((card, index) => (
                        <div key={`col2-${index}`} className="card-wrapper">
                            <EventCard {...card} />
                        </div>
                    ))}
                </div>}
                {numColumns > 2 && <div className='flex flex-col gap-3'>
                    {column3.map((card, index) => (
                        <div key={`col3-${index}`} className="card-wrapper">
                            <EventCard {...card} />
                        </div>
                    ))}
                </div>}
            </div>
        </div>
    )
}