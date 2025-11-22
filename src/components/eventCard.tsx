import { Button, Card, CardFooter, CardHeader, Image } from "@heroui/react"
import { EventCardProps } from "./interfaces"

export const EventCard = (props: EventCardProps) => {
	return (
		// the footer is hidden, but when 
		<Card isFooterBlurred className="group">
			<Image
				removeWrapper
				alt="Card example background"
				className="z-0 w-full h-full"
				src={props.image}
			/>
			<CardFooter className="absolute bg-pink-300/10 bottom-0 rounded-2xl z-10 justify-between p-4 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:bg-pink-300/40 group-hover:border-2 group-hover:border-slate-50/20">
				<div className="flex justify-between w-full items-center">
					<div>
						<h4 className="text-white text-2xl font-bold">{props.title}</h4>
						{/* <h4 className="text-neutral-200 font-medium text-lg sm:text-xl">{props.title}</h4> */}
						{/* <span className="flex"> */}
						<p className="text-neutral-100 sm:text-lg font-bold">Lugar</p>
						<p className="text-neutral-50">{props.location}</p>
						<p className="text-neutral-100 sm:text-lg font-bold">Día y hora</p>
						<p className="text-neutral-50">{props.date} - {props.hour} hrs</p>
					</div>
					{/* <div>
						<p className="text-neutral-200 text-tiny sm:text-lg">Día: {props.date}</p>
						<p className="text-neutral-200 text-tiny sm:text-lg">Hora: {props.hour}</p>
					</div> */}
				</div>
			</CardFooter>
		</Card>
	)
}
