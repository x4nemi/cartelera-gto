import { Label, TagGroup, Description, Key, Tag } from "@heroui/react";
import { MaskHappyIcon, MusicNoteIcon, PaletteIcon, PopcornIcon, ScissorsIcon } from "@phosphor-icons/react";
import { useState } from "react";

const categories = [{
    label: 'musica',
    icon: <MusicNoteIcon size={24} weight="duotone" />
},
{
    label: 'teatro',
    icon: <MaskHappyIcon size={24} weight="duotone" />
},
{
    label: 'taller',
    icon: <ScissorsIcon size={24} weight="duotone" />
},
{
    label: 'arte',
    icon: <PaletteIcon size={24} weight="duotone" />
},
{
    label: 'cine',
    icon: <PopcornIcon size={24} weight="duotone" />
}
];

export const CategoriesDropdown = () => {

    const [selected, setSelected] = useState<Iterable<Key>>([categories[0].label]);
    return (
        <TagGroup
            selectedKeys={selected}
            selectionMode="multiple"
            onSelectionChange={(keys) => setSelected(keys)}
        >
            <Label>¿Qué categorías te interesan?</Label>
            <TagGroup.List>
                {categories.map((c) => (
                    <Tag key={c.label}>
                        {c.icon}
                        {c.label}
                    </Tag>
                ))}
            </TagGroup.List>
            <Description>Elige las categorías que desees</Description>
        </TagGroup>
    )
}
