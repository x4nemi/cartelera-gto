import { Avatar, Button, Card, CardFooter, CardHeader, Chip, Image, useDisclosure } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { EventDrawer } from "./eventDrawer";
import { PostData } from "@/config/apiClient";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { XIcon } from "../icons";

// const months = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
// const weekdays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const parseLocalDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
};

/**
 * Poster-first event card for the calendar feed. The image is the protagonist:
 * it fills the entire card and metadata sits on a translucent overlay panel
 * along the bottom, with the date badge and owner chip floating on top.
 */
export const XimenasVersionCard = (props: PostData) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // const eventDate = (() => {
    //     if (!props.dates?.length) return new Date();
    //     const future = props.dates
    //         .map(parseLocalDate)
    //         .filter((d) => d >= today)
    //         .sort((a, b) => a.getTime() - b.getTime());
    //     if (future.length) return future[0];
    //     const past = props.dates
    //         .map(parseLocalDate)
    //         .filter((d) => d < today)
    //         .sort((a, b) => b.getTime() - a.getTime());
    //     return past[0] ?? new Date();
    // })();
    // const month = months[eventDate.getMonth()];
    // const day = eventDate.getDate();
    // const weekday = weekdays[eventDate.getDay()];

    const isPast = props.dates ? props.dates.every((d) => parseLocalDate(d) < today) : false;

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const isMobile = useMediaQuery("(max-width: 640px)");
    const navigate = useNavigate();

    const handlePress = () => {
        if (isMobile) {
            navigate(`/evento/${props.shortCode}`);
        } else {
            onOpen();
        }
    };

    const { title, summary, location, price, tags, caption, owner, ownerUsername, images } = props;

    // Headline fallback: AI title → first non-empty caption line → "Evento"
    const headline =
        title?.trim() ||
        caption?.split("\n").map((s) => s.trim()).find(Boolean) ||
        "Evento";

    return (
        <>
            <Card className="w-full items-stretch md:flex-row">
                <div className="relative h-[140px] w-full shrink-0 overflow-hidden rounded-2xl sm:h-[120px] sm:w-[120px]">
                    <img
                        alt="Cherries"
                        className="pointer-events-none absolute inset-0 h-full w-full scale-125 object-cover select-none"
                        loading="lazy"
                        src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/cherries.jpeg"
                    />
                </div>
                <div className="flex flex-1 flex-col gap-3">
                    <CardHeader className="gap-1">
                        <p className="pr-8">Become an ACME Creator!</p>
                        <p>
                            Lorem ipsum dolor sit amet consectetur. Sed arcu donec id aliquam dolor sed amet
                            faucibus etiam.
                        </p>
                        <XIcon aria-label="Close banner" className="absolute top-3 right-3" />
                    </CardHeader>
                    <CardFooter className="mt-auto flex w-full flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-foreground">Only 10 spots</span>
                            <span className="text-xs text-muted">Submission ends Oct 10.</span>
                        </div>
                        <Button className="w-full sm:w-auto">Apply Now</Button>
                    </CardFooter>
                </div>
            </Card>
            <EventDrawer isOpen={isOpen} onOpenChange={onOpenChange} cardProps={props} />
        </>
    );
};
