import { CategoriesDropdown } from "@/components/options/categoriesDropdown"
import { PriceRangesDropdown } from "@/components/options/priceRangesDropdown"
import { Card } from "@heroui/react"

export const HomeView = () => {
    return (
        <div className="flex flex-col gap-4 pt-6">
            <Card>
                <Card.Header>
                    <Card.Description>Bienvenidx.</Card.Description>
                    <Card.Title>¿Qué te gustaría hacer?</Card.Title>
                </Card.Header>
                <Card.Content>
                    <CategoriesDropdown />
                    <PriceRangesDropdown />
                </Card.Content>
            </Card>
        </div>
    )
}
