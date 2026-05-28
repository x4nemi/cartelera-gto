import { CategoriesDropdown } from "@/components/options/categoriesDropdown"
import { PriceRangesDropdown } from "@/components/options/priceRangesDropdown"
import { Surface, Typography } from "@heroui/react"

export const HomeView = () => {
    return (
        <div className="flex flex-col gap-4 pt-6">
            <Surface className="flex min-w-[320px] flex-col gap-3 rounded-3xl p-6" variant="secondary">
                <Typography.Heading level={3}>¿Qué te gustaría hacer hoy?</Typography.Heading>
                <CategoriesDropdown />
                <PriceRangesDropdown />
            </Surface>
        </div>
    )
}
