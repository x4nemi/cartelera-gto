import { Button, Image } from "@heroui/react"
import { useEffect, useRef, useState } from "react"

export const ImageItem = ({ src = "/bordado.jpg", number = 1, onSelect = () => { } }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [selected, setSelected] = useState(true)

    const imageRef = useRef<HTMLImageElement>(null)


    useEffect(() => {
        if (imageRef.current?.complete) {
            setIsLoading(false)
        }
    }, [])

    const handleSelect = (e: React.MouseEvent) => {
        e.stopPropagation()
        setSelected(!selected)
        onSelect()
    }
    return (
        <div className={`${selected ? "ring-3 ring-primary" : ""} rounded-xl`} onClick={handleSelect} role="button">
            <div className="relative">
                {selected && <Button className="absolute top-1 right-1 z-50" isIconOnly color={selected ? "primary" : "default"} onClick={handleSelect} aria-label={`Imagen ${number} seleccionada`}>{Math.max(number, 1)}</Button>}
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
