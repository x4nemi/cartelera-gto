import { EventList } from "@/components/eventList";
import { Navbar } from "@/components/navbar";

export const Agenda = () => {

    return (
        <div className="mx-auto min-h-dvh w-full max-w-xl px-4 pt-6 pb-28 md:pt-24">
            <EventList variant="full" />

            <Navbar />
        </div>
    );
};
