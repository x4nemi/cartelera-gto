import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Accordion, AccordionItem, Card, CardBody, cn } from "@heroui/react";
import { useState } from "react";

export default function PublishPage() {
	const [selectedKey, setSelectedKey] = useState<string | null>(null);
	
	const RadioCircle = ({ isSelected }: { isSelected: boolean }) => (
		<div className={cn(
			"w-5 h-5 rounded-full border-2 flex items-center justify-center",
			isSelected ? "border-secondary" : "border-default-300"
		)}>
			<div className={cn(
				"w-2.5 h-2.5 rounded-full transition-colors",
				isSelected ? "bg-secondary" : "bg-transparent"
			)} />
		</div>
	);
	
	return (
		<DefaultLayout>
			<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
				<div className="flex flex-col w-full max-w-2xl px-2">
					<h1 className={title({ class: "mb-4" })}>Publica un evento</h1>
					<Card className="w-full rounded-3xl focus:ring-0" shadow="lg">
						<CardBody className="px-1">
							<Accordion 
								showDivider={false}
								selectionMode="single"
								hideIndicator
								selectedKeys={selectedKey ? [selectedKey] : []}
								onSelectionChange={(keys) => {
									const key = Array.from(keys)[0] as string;
									setSelectedKey(key === selectedKey ? key : key);
								}}
								itemClasses={{
									base: "mb-2 w-full",
									title: "font-bold text-lg",
									subtitle: "text-default-500 font-medium",
									trigger: cn(
										"p-4 bg-content1 hover:bg-content2 border-2 border-transparent rounded-2xl hover:border-secondary/30",
										"data-[open=true]:border-secondary/30 data-[open=true]:rounded-b-none data-[open=true]:bg-gray",
										"flex items-center justify-between gap-4 duration-250 transition-all"
									),
									content: "px-4 pb-4 bg-gray border-2 border-t-0 border-secondary/30 rounded-b-2xl pt-5"
								}}
							>
								<AccordionItem
									key="1"
									aria-label="Free"
									title={
										<div className="flex items-center justify-between w-full">
											<div className="flex flex-col items-start">
												<span className="font-bold text-lg">Con un link de Instagram</span>
												<span className="text-sm text-default-400">Requieres tener una cuenta pública</span>
											</div>
											<RadioCircle isSelected={selectedKey === "1"} />
										</div>
									}
								>
									<p className="text-left">Content for free plan. You can add forms, buttons, or any other content here.</p>
								</AccordionItem>
								<AccordionItem
									key="2"
									aria-label="Pro"
									title={
										<div className="flex items-center justify-between w-full">
											<div className="flex flex-col items-start">
												<span className="font-bold text-lg">Desde cero</span>
												<span className="text-sm text-default-400">Sube las imágenes y detalles de tu evento</span>
											</div>
											<RadioCircle isSelected={selectedKey === "2"} />
										</div>
									}
								>
									<p className="text-left">Content for pro plan with all the details and features included.</p>
								</AccordionItem>
							</Accordion>
						</CardBody>
					</Card>
				</div>
			</section>
		</DefaultLayout>
	);
}
