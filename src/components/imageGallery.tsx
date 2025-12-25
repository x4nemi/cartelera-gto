import { useState } from "react"
import { ImageItem } from "./imageItem"


const images = [
    { src: "/bordado.jpg" },
    { src: "/patronaje.jpg" },
    { src: "/nocherock.jpg" },
]
export const ImageGallery = () => {
    const [imageOrder, setImageOrder] = useState(images)

    // if the image is selected, then it will be the last in the array
    // if the image is deselected, then the item will be removed from the array
    const handleSelectImage = (index: number) => {
        
        if (imageOrder.find(img => img.src === images[index].src)) {
            // deselect
            const newOrder = imageOrder.filter(img => img.src !== images[index].src)
            setImageOrder(newOrder)
        } else {
            // select
            const newOrder = [...imageOrder, images[index]]
            setImageOrder(newOrder)
        }
    }
    
    const getIndexOfImage = (src: string) => {
        return imageOrder.findIndex(img => img.src === src) + 1
    }
    
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 w-full">
            {
                images.map((image, index) => (
                    <div key={index} className="cols-span-1">
                    <ImageItem key={index} src={image.src} number={getIndexOfImage(image.src)} onSelect={() => handleSelectImage(index)}/>
                    </div>
                ))
            }

        </div>
    )
}
