import { Button, Image } from "@heroui/react"
import { useEffect, useRef, useState } from "react"

export const ImageItem = ({ src = "/bordado.jpg", number = 1}) => {
    const [isLoading, setIsLoading] = useState(true)

    const imageRef = useRef<HTMLImageElement>(null)

    const onLoadImage = () => setIsLoading(false)

    useEffect(() => {
        if (imageRef.current?.complete) {
            setIsLoading(false)
        }
    }, [])
    return (
        <div className="relative flex">
            <Button className="absolute top-0 right-0 z-50 mr-1 mt-1" variant="faded" isIconOnly>{number}</Button>
            <Image
                ref={imageRef}
                onLoad={onLoadImage}
                isLoading={isLoading}
                alt="Evento imagen"
                src={src}
                className="w-full"
            />
        </div>
    )
}
