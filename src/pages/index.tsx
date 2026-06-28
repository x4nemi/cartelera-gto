import { EventList } from "@/components/eventList"
import { Chip } from "@heroui/react"
import { Navbar } from "@/components/navbar"

export const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-4 mt-4 mx-12">
            <Chip>
                <span
                    aria-hidden
                    className="inline-block size-4 rounded-sm bg-current"
                    style={{
                        WebkitMaskImage: "url(/favicon.ico)",
                        maskImage: "url(/favicon.ico)",
                        WebkitMaskSize: "contain",
                        maskSize: "contain",
                        WebkitMaskRepeat: "no-repeat",
                        maskRepeat: "no-repeat",
                        WebkitMaskPosition: "center",
                        maskPosition: "center",
                    }}
                />
                <Chip.Label>Carletera Guanajuato</Chip.Label>
            </Chip>
            
            <div>
                <EventList />
            </div>

            <Navbar />
        </div>
    )
}