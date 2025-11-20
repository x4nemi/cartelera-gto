import { Button, Card, CardFooter, CardHeader, Image } from "@heroui/react"
import { EventCardProps } from "./interfaces"

export const EventCard = (props: EventCardProps) => {
	return (
		<Card isFooterBlurred>
			<Image
				removeWrapper
				alt="Card example background"
				className="z-0 w-full h-full scale-125"
				src={props.image}
			/>
			<CardFooter className="absolute bg-slate-200/50 bottom-0 rounded-2xl z-10 justify-between border-2 border-violet-100">
				<div className="flex justify-between w-full items-center">
					<div>
						<h4 className="text-neutral-700 font-medium text-lg">{props.title}</h4>
						<p className="text-neutral-700 ">{props.location}</p>
					</div>
					<div>
						<p className="text-neutral-700 font-bold text-tiny">{props.date}</p>
						<p className="text-neutral-700 font-bold text-tiny">{props.hour}</p>
					</div>
				</div>
			</CardFooter>
		</Card>
	)
}
