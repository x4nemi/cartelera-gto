import { RadioGroup, Radio, cn } from "@heroui/react";
import { CalendarFilledIcon, CalendarIcon, EventFilledIcon, EventIcon, LoopFilledIcon, LoopIcon } from "./icons";
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
                description: "text-default-400 mt-0.5 italic",
            }}
        >
            {children}
        </Radio>
    );
};

const postsTypes = [{
    value: "Evento", label: "Evento", description: "Es un evento o un taller", icon: <EventIcon size={26} color="bg-secondary" />, selectedIcon: <EventFilledIcon size={26} />
}, {
    value: "Taller", label: "Taller / Curso", description: "Es un evento recurrente", icon: <LoopIcon size={26} color="bg-secondary" />, selectedIcon: <LoopFilledIcon size={26} />
}, {
    value: "Calendario", label: "Calendario", description: "Contiene varios eventos", icon: <CalendarIcon size={26} color="bg-secondary" />, selectedIcon: <CalendarFilledIcon size={26} />
}];

const CustomRadioGroup = () => {
    const [value, setValue] = useState("");
    return (
        <RadioGroup className="flex" orientation="horizontal" description="" value={value} onValueChange={setValue}>
            {/* <h1 className="text-foreground font-medium mb-2 text-lg">¿Qué tipo de publicación deseas hacer?</h1> */}
            <div className="flex md:flex-row flex-col md:gap-2 gap-1 w-full">
                {
                    postsTypes.map((postType) => (
                        <CustomRadio key={postType.value} value={postType.value} className="md:flex-1 w-full justify-start" >
                            <div className="flex flex-col text-start">
                                <p className="font-bold flex gap-1 items-center">
                                    {value !== postType.value ? postType.icon : postType.selectedIcon}
                                    {postType.label}
                                </p>
                                <p className="text-default-400 mt-0.5 italic text-sm">{postType.description}</p>
                            </div>
                        </CustomRadio>
                    ))
                }
            </div>
        </RadioGroup>
    );
}

export default CustomRadioGroup;