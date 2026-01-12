import { Avatar, Card, CardFooter, Image } from "@heroui/react"
import { EventCardProps } from "./interfaces"

export const EventCard = (props: EventCardProps) => {
	return (
		<Card className="group rounded-3xl" shadow="lg" isPressable>
			<Image
				removeWrapper
				alt="Card example background"
				className="z-0 w-full h-full rounded-b-none"
				src={props.image}
			/>
			<CardFooter className="flex justify-between">
				<div className="flex gap-2">
					<Avatar
						isBordered
						radius="full"
						size="md"
						src="https://heroui.com/avatars/avatar-1.png"
					/>
					<div className="flex flex-col gap-1 items-start justify-center">
						<h4 className="text-xs md:text-md font-semibold leading-none text-default-600">Zoey Lang</h4>
						<h5 className="text-xs md:text-md tracking-tight text-default-400">@casacuevano</h5>
					</div>
				</div>
				<div className="text-right">
				<p className="text-xs md:text-md">Martes 6 de enero,2026</p>
				<p className="text-xs md:text-md">20:00 hrs</p>
				</div>
			</CardFooter>
		</Card>
	)
}
