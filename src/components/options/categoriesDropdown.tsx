import { Label, TagGroup, Key, Tag } from "@heroui/react";
import { MaskHappyIcon, MusicNoteIcon, PaletteIcon, PopcornIcon, ScissorsIcon } from "@phosphor-icons/react";
// import {MusicNote} from '@gravity-ui/icons';
import { useState } from "react";

const categories = [{
    label: 'musica',
    icon: <MusicNoteIcon weight="bold" size={16} />
},
{
    label: 'teatro',
    icon: <MaskHappyIcon weight="bold" size={16} />
},
{
    label: 'taller',
    icon: <ScissorsIcon weight="bold" size={16} />
},
{
    label: 'arte',
    icon: <PaletteIcon weight="bold" size={16} />
},
{
    label: 'cine',
    icon: <PopcornIcon weight="bold" size={16} />
}
];

export const CategoriesDropdown = () => {

    const [selected, setSelected] = useState<Iterable<Key>>([categories[0].label]);
    return (
        <TagGroup
            selectedKeys={selected}
            selectionMode="multiple"
            onSelectionChange={(keys) => setSelected(keys)}
            size="md"
        >
            <Label className="mb-2 block text-sm font-medium text-foreground/80">Categorías</Label>
            <TagGroup.List className="flex flex-wrap gap-2">
                {categories.map((c) => (
                    <Tag
                        key={c.label}
                        className="flex items-center gap-1.5 rounded-full border border-default-foreground/25 bg-transparent px-3 py-1.5 text-sm capitalize transition-colors hover:bg-content2 data-[selected=true]:border-transparent data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[selected=true]:hover:bg-accent"
                    >
                        {c.icon}
                        {c.label}
                    </Tag>
                ))}
            </TagGroup.List>
        </TagGroup>
    )
}
