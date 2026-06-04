import { Label, TagGroup, Key, Tag, Selection } from "@heroui/react";

interface CategoriesDropdownProps {
    selectedCategories: string[];
    onSelectionChange: (categories: string[]) => void;
    /** Category labels (tags) that exist in the current data. */
    availableCategories?: string[];
}

export const CategoriesDropdown = ({ selectedCategories, onSelectionChange, availableCategories }: CategoriesDropdownProps) => {

    const visibleCategories = [...(availableCategories ?? [])].sort((a, b) => a.localeCompare(b));

    const handleChange = (keys: Selection) => {
        if (keys === "all") {
            onSelectionChange(visibleCategories);
        } else {
            onSelectionChange(Array.from(keys as Set<Key>).map(String));
        }
    };

    if (visibleCategories.length === 0) return null;

    return (
        <TagGroup
            selectedKeys={new Set(selectedCategories)}
            selectionMode="multiple"
            onSelectionChange={handleChange}
            size="md"
        >
            <Label className="mb-2 block text-sm font-medium text-foreground/80">Categorías</Label>
            <TagGroup.List className="flex flex-wrap gap-2">
                {visibleCategories.map((label) => (
                    <Tag
                        key={label}
                        id={label}
                        className="flex items-center rounded-full border border-default-foreground/25 bg-transparent px-3 py-1.5 text-sm capitalize transition-colors hover:bg-content2 data-[selected=true]:border-transparent data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[selected=true]:hover:bg-accent"
                    >
                        {label}
                    </Tag>
                ))}
            </TagGroup.List>
        </TagGroup>
    )
}
