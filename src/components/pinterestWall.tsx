import { useEffect, useState, useMemo } from 'react'
import { EventCard } from './card/eventCard';
import { PostData } from '@/config/apiClient';

export const Wall = ({ cardsData = [] }: { cardsData?: PostData[] }) => {
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
    
    // Calcular el número de columnas basado en el ancho de la ventana y cantidad de items
    const numColumns = useMemo(() => {
        if (cardsData.length === 1) return 1;
        if (windowWidth >= 768) return 3;  
        else return 2;
    }, [windowWidth, cardsData.length]);
    
    // Distribuir las tarjetas en columnas usando useMemo
    const { column1, column2, column3 } = useMemo(() => {
        return {
            column1: cardsData.filter((_, index) => index % numColumns === 0),
            column2: cardsData.filter((_, index) => index % numColumns === 1),
            column3: cardsData.filter((_, index) => index % numColumns === 2)
        };
    }, [numColumns, cardsData]);

    return (
        <div className="w-full px-3 max-sm:px-1.5">
            <div className={`grid gap-3 max-sm:gap-1.5 ${numColumns === 1 ? 'grid-cols-1 max-w-md mx-auto' : 'xl:grid-cols-3 2xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 grid-cols-2'}`}>
                <div className='flex flex-col gap-3 max-sm:gap-1.5'>
                    {column1.map((card, index) => (
                        <div key={`col1-${index}`} className="card-wrapper">
                            <EventCard {...card} />
                        </div>
                    ))}
                </div>
                {numColumns > 1 && <div className='flex flex-col gap-3 max-sm:gap-1.5'>
                    {column2.map((card, index) => (
                        <div key={`col2-${index}`} className="card-wrapper">
                            <EventCard {...card} />
                        </div>
                    ))}
                </div>}
                {numColumns > 2 && <div className='flex flex-col gap-3 max-sm:gap-1.5'>
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