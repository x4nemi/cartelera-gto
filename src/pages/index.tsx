import { EventList } from "@/components/eventList"
import { Chip } from "@heroui/react"
import { Navbar } from "@/components/navbar"
import { RecurringSection } from "@/components/recurringSection"

export const Home = () => {
    return (
        <div className="mx-auto flex w-full max-w-xl lg:max-w-5xl flex-col items-center gap-6 mt-4 px-4">
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

            <div className="flex w-full min-w-0 flex-col gap-8">
                <RecurringSection />
                <div className="mx-auto w-full max-w-xl">
                    <EventList />
                </div>
            </div>

            <Navbar />
        </div>
    )
}