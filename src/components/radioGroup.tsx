import { RadioGroup, Radio, cn } from "@heroui/react";
import { CalendarFilledIcon, CalendarIcon, EventFilledIcon, EventIcon } from "./icons";
import { useState } from "react";
export const CustomRadio = ({ children, ...props }: & React.ComponentProps<typeof Radio>) => {

    return (
        <Radio
            {...props}
            classNames={{
                base: cn(
                    "max-w-full inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
                    "cursor-pointer rounded-2xl gap-2 p-4 border-2 border-transparent",
                    "data-[selected=true]:border-secondary border-default justify-center text-center data-[selected=true]:bg-violet-100 data-[selected=true]:dark:bg-violet-800/20 transition-all duration-200",
                ),
                wrapper: "hidden",
                description: "text-sm text-default-400 mt-1",
            }}
        >
            {children}
        </Radio>
    );
};

const CustomRadioGroup = () => {
    const [value, setValue] = useState("Evento");
    return (
        <RadioGroup className="w-full flex-row" orientation="horizontal" description="" value={value} onValueChange={setValue}>
            <h1 className="text-foreground font-medium mb-2">¿Qué tipo de publicación deseas hacer?</h1>
            <div className="flex flex-row gap-4 w-full">
                <CustomRadio description="Es un evento o un taller" value="Evento" className="flex-1" >
                    <div className="flex flex-col justify-center items-center gap-1">
                        {value !== "Evento" ? <EventIcon size={26} color="bg-secondary" /> : <EventFilledIcon size={26} />}
                        <p>
                            Evento
                        </p>
                    </div>
                </CustomRadio>
                <CustomRadio description="Contiene varios eventos" value="Calendario" className="flex-1" >
                    <div className="flex flex-col justify-center items-center gap-1">
                        {value !== "Calendario" ? <CalendarIcon size={26} color="bg-secondary" /> : <CalendarFilledIcon size={26} />}
                        <p>
                            Calendario
                        </p>
                    </div>
                </CustomRadio>
            </div>
        </RadioGroup>
    );
}

export default CustomRadioGroup;