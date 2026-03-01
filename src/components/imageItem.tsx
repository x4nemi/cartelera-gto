import { Button, Image } from "@heroui/react"
import { useEffect, useRef, useState } from "react"

export const ImageItem = ({ src = "/bordado.jpg", number = 1, selected = true, onSelect = () => { } }) => {
    const [isLoading, setIsLoading] = useState<boolean | null>(false)

    const imageRef = useRef<HTMLImageElement>(null)

    useEffect(() => {
        if (imageRef.current?.complete) {
            setIsLoading(false)
        } else {
            setIsLoading(true)
            const handleLoad = () => setIsLoading(false)
            imageRef.current?.addEventListener('load', handleLoad)
            return () => {
                imageRef.current?.removeEventListener('load', handleLoad)
            }
        }

    }, [imageRef.current])

    const handleSelect = (e: React.MouseEvent) => {
        e.stopPropagation()
        onSelect()
    }
    return (
        isLoading ? <div className="w-full aspect-square bg-default-200 rounded-xl animate-pulse" /> :
        <div className={`${selected ? "ring-2 ring-primary" : ""} rounded-xl`} onClick={handleSelect} role="button">
            <div className="relative">
                {selected && <Button className="absolute top-1 right-1 z-50" isIconOnly color={selected ? "primary" : "default"} onClick={handleSelect} variant="solid" size="sm" aria-label={`Imagen ${number} seleccionada`}>{Math.max(number, 1)}</Button>}
            </div>
            <Image
                ref={imageRef}
                alt="Evento imagen"
                src={src}
                className="w-full aspect-square object-cover rounded-xl"
            />

        </div>
    )
}
