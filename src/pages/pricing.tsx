import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Accordion, AccordionItem, Card, CardBody, cn } from "@heroui/react";
import { useState } from "react";

export default function DocsPage() {
	const [selectedKey, setSelectedKey] = useState<string | null>(null);
	
	const RadioCircle = ({ isSelected }: { isSelected: boolean }) => (
		<div className={cn(
			"w-5 h-5 rounded-full border-2 flex items-center justify-center",
			isSelected ? "border-primary" : "border-default-300"
		)}>
			<div className={cn(
				"w-2.5 h-2.5 rounded-full transition-colors",
				isSelected ? "bg-primary" : "bg-transparent"
			)} />
		</div>
	);
	
	return (
		<DefaultLayout>
			<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
				<div className="flex flex-col w-full max-w-2xl px-4">
					<h1 className={title({ class: "mb-4" })}>Publica un evento</h1>
					<Card className="w-full">
						<CardBody className="gap-2">
							<Accordion 
								showDivider={false}
								selectionMode="single"
								hideIndicator
								selectedKeys={selectedKey ? [selectedKey] : []}
								onSelectionChange={(keys) => {
									const key = Array.from(keys)[0] as string;
									setSelectedKey(key === selectedKey ? null : key);
								}}
								itemClasses={{
									base: "mb-2 w-full",
									title: "font-bold text-lg",
									subtitle: "text-default-500",
									trigger: cn(
										"p-4 bg-content1 hover:bg-content2 rounded-lg border-2 border-transparent",
										"data-[open=true]:border-primary data-[open=true]:rounded-b-none",
										"flex items-center justify-between gap-4"
									),
									content: "px-4 pb-4 pt-2 border-2 border-t-0 border-primary rounded-b-lg",
								}}
							>
								<AccordionItem
									key="1"
									aria-label="Free"
									title={
										<div className="flex items-center justify-between w-full">
											<div className="flex flex-col items-start">
												<span className="font-bold text-lg">Free</span>
												<span className="text-sm text-default-500">Up to 20 items</span>
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
												<span className="font-bold text-lg">Pro</span>
												<span className="text-sm text-default-500">Unlimited items. $10 per month.</span>
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
