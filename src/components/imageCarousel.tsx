import { Image, Button } from '@heroui/react'
import { useState, useRef } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from './icons'

interface ImageCarouselProps {
    images: string[]
}

export const ImageCarousel = ({ images, className }: ImageCarouselProps & { className?: string }) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const touchStartX = useRef(0)
    const touchEndX = useRef(0)

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }

    const goToNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX
    }

    const handleTouchEnd = () => {
        const diff = touchStartX.current - touchEndX.current
        const threshold = 50 // minimum swipe distance

        if (diff > threshold) {
            goToNext()
        } else if (diff < -threshold) {
            goToPrevious()
        }
    }

    if (!images || images.length === 0) return null

    return (
        <div className={`relative overflow-hidden rounded-2xl mx-auto ${className || ''}`}>
            {/* Images container */}
            <div
                className="flex transition-transform duration-300 ease-out items-center"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {images.map((image, index) => (
                    <div key={index} className="w-full flex-shrink-0 flex justify-center">
                        <Image
                            removeWrapper
                            alt={`Imagen ${index + 1}`}
                            className={className || "w-full h-auto object-cover"}
                            src={image}
                        />
                    </div>
                ))}
            </div>

            {/* Navigation arrows */}
            {images.length > 1 && (
                <>
                    <Button
                        isIconOnly
                        variant="flat"
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 z-10"
                        size="sm"
                        onPress={goToPrevious}
                        aria-label="Imagen anterior"
                    >
                        <ChevronLeftIcon size={20} />
                    </Button>
                    <Button
                        isIconOnly
                        variant="flat"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 z-10"
                        size="sm"
                        onPress={goToNext}
                        aria-label="Imagen siguiente"
                    >
                        <ChevronRightIcon size={20} />
                    </Button>
                </>
            )}

            {/* Dots indicator */}
            {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all ${
                                index === currentIndex
                                    ? 'bg-white w-4'
                                    : 'bg-white/50 hover:bg-white/75'
                            }`}
                            onClick={() => setCurrentIndex(index)}
                            aria-label={`Ir a imagen ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
