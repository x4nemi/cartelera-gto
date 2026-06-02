import { CategoriesDropdown } from "@/components/options/categoriesDropdown"
import { PriceRangesDropdown } from "@/components/options/priceRangesDropdown"
import { Card, Typography } from "@heroui/react"

export const HomeView = () => {
    return (
        <div className="flex flex-col gap-4 pt-6">
            <Card>
                <Card.Header>
                    {/* <Card.Description>Bienvenidx.</Card.Description> */}
                    <Typography type="h3">¿Qué te gustaría hacer?</Typography>
                </Card.Header>
                <Card.Content>
                    <CategoriesDropdown />
                    <PriceRangesDropdown />
                </Card.Content>
            </Card>
        </div>
    )
}
