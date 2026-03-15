import { useMemo } from 'react';
import { EventCard } from '../components/card/eventCard';
import { PostData } from '@/config/apiClient';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export const Wall = ({ cardsData = [] }: { cardsData?: PostData[] }) => {
    const isLg = useMediaQuery('(min-width: 1024px)');
    const numCols = cardsData.length === 1 ? 1 : isLg ? 3 : 2;

    const columns = useMemo(() => {
        const cols: PostData[][] = Array.from({ length: numCols }, () => []);
        // Round-robin distribution keeps order balanced across columns
        cardsData.forEach((card, i) => {
            cols[i % numCols].push(card);
        });
        return cols;
    }, [cardsData, numCols]);

    return (
        <div className={`grid gap-3 max-sm:gap-1.5 w-full ${numCols === 1 ? 'grid-cols-1 max-w-md mx-auto' : numCols === 2 ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-3'}`}>
            {columns.map((col, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-3 max-sm:gap-1.5">
                    {col.map((card, idx) => (
                        <EventCard key={card._id ?? `${colIdx}-${idx}`} {...card} />
                    ))}
                </div>
            ))}
        </div>
    )
}