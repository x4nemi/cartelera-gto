import { ArrowLeft } from "@gravity-ui/icons";
import { useNavigate } from "react-router-dom";

import { EventList } from "@/components/eventList";
import { Navbar } from "@/components/navbar";

export const Agenda = () => {
    const navigate = useNavigate();

    return (
        <div className="mx-auto min-h-dvh w-full max-w-xl px-4 pt-6 pb-28">
            <div className="mb-4 flex flex-col gap-1">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex w-fit items-center gap-1 text-sm font-medium text-muted transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="size-4" />
                    Regresar
                </button>
                <header className="flex flex-col gap-1">
                    <h1 className="text-h2">Agenda</h1>
                    <p className="text-sm text-muted">Todos los eventos próximos por día</p>
                </header>
            </div>

            <EventList variant="full" />

            <Navbar />
        </div>
    );
};
