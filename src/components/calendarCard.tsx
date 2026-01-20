import { Button, Card, CardFooter, CardHeader, Link, User } from "@heroui/react"
import { EventCardProps } from "./interfaces"
import { ImageCarousel } from "./imageCarousel"

export const CalendarCard = (props: EventCardProps) => {
	const month = new Date(props.date).toLocaleString('es-MX', { month: 'long' });
    const year = new Date(props.date).getFullYear();
	return (
		<>
			<Card className="group p-1 rounded-3xl" shadow="lg">
				<CardHeader className="py-2 flex text-foreground/60 font-semibold justify-between items-center">
                    <User name={props.user?.name || props.username || "Desconocido"} avatarProps={{ src: props.user?.avatarUrl, size: "sm" }} description={"@" + (props.username || "desconocido")}/>
					<Button as={Link} href={"https://www.instagram.com/" + (props?.username || "")} isExternal showAnchorIcon>Ir al sitio</Button>
                </CardHeader>
					<ImageCarousel images={[...props.image ? [props.image, props.image] : []].flat()} isCardEvent={false} className="rounded-[5px]" />
				<CardFooter className="flex justify-center items-center pt-2 pb-1 text-foreground/60 text-xs font-semibold">
					{month.charAt(0).toUpperCase() + month.slice(1)} {year}
				</CardFooter>
			</Card>
		</>
	)
}
