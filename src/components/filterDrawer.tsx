import { Card, CardBody, CardHeader, } from '@heroui/react'
import { FilterIcon } from './icons'
import { ViewSwitch } from './viewSwitch'

export const FilterDrawer = ({ isEventsView, setIsEventsView, }: { isEventsView: boolean, setIsEventsView: (value: boolean) => void }) => {

	return (
		<Card className='fixed bottom-10 z-50' isBlurred>
			<CardHeader className='flex justify-center py-0 text-foreground/70 gap-1 pt-1'>
				<FilterIcon size={15} />
				<h4 className='font-semibold text-xs'>Vista</h4>
			</CardHeader>
			<CardBody className='flex flex-row items-center justify-center p-2 h-fit gap-2'>
				<ViewSwitch className='bg-secondary text-secondary-800 light:text-purple-10' isEventsView={isEventsView} setIsEventsView={setIsEventsView} />
			</CardBody>
		</Card>
	)
}
