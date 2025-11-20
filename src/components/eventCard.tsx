import { Button, Card, CardFooter, CardHeader, Image } from "@heroui/react"
import { EventCardProps } from "./interfaces"

export const EventCard = (props: EventCardProps) => {
	return (
		<Card isFooterBlurred className=" col-span-6 sm:col-span-6">
			<CardHeader className="absolute z-10 top-1 flex-col items-start">
				<p className="text-tiny text-white/60 uppercase font-bold">{props.location}</p>
				<h4 className="text-black font-medium text-xl">{props.title}</h4>
			</CardHeader>
			<Image
				removeWrapper
				alt="Card example background"
				className="z-0 w-full h-full scale-125"
				src={props.image}
			/>
			<CardFooter className="absolute bg-white/30 bottom-0 rounded-t-lg border-zinc-100/50 z-10 justify-between">
				<div>
					<p className="text-black text-tiny">{props.date}</p>
					<p className="text-black text-tiny">{props.hour}</p>
				</div>
				<Button className="text-tiny" color="primary" radius="full" size="sm">
					Notify Me
				</Button>
			</CardFooter>
		</Card>
	)
}
