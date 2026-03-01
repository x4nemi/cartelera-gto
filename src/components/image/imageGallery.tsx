import { useState } from "react"
import { ImageItem } from "../imageItem"

export const ImageGallery = ({ images }: { images: { src: string }[] }) => {
    const [imageOrder, setImageOrder] = useState(images)

    // if the image is selected, then it will be the last in the array
    // if the image is deselected, then the item will be removed from the array
    const handleSelectImage = (index: number) => {
        const isSelected = imageOrder.find(img => img.src === images[index].src)
        if (isSelected && imageOrder.length <= 1) {
            // prevent deselecting the last remaining image
            return
        }
        if (isSelected) {
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
        images.length > 1 ? <div className="grid grid-cols-2 md:grid-cols-3 gap-2 w-full">
            {
                images.map((image, index) => (
                    <div key={index} className="cols-span-1">
                    <ImageItem key={index} src={image.src} number={getIndexOfImage(image.src)} selected={getIndexOfImage(image.src) > 0} onSelect={() => handleSelectImage(index)}/>
                    </div>
                ))
            }

        </div> : (images.length === 1 ? <div className="w-full">
            <ImageItem src={images[0].src} number={1} onSelect={() => { }} />
        </div> : <p className="text-default-400 italic">No se encontraron imágenes.</p>)
    )
}
