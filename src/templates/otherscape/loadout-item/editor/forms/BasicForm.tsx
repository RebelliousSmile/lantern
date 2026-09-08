import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useOtherscapeLoadoutItemStore } from '../../hooks'

export default function BasicForm() {
    const { otherscapeLoadoutItem, setName, setCategory, setDescription } =
        useOtherscapeLoadoutItemStore()

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label htmlFor="os-loadout-item-name">Name</Label>
                <Input
                    id="os-loadout-item-name"
                    className="h-8 px-2 text-sm"
                    value={otherscapeLoadoutItem.name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Kestrel Whisperlink"
                />
                <p className="text-xs text-muted-foreground">
                    Printed as the card's title, and kept as the first feature
                    tag: the catalog opens the tag list with the item's own
                    name, so renaming the item rewrites that tag too.
                </p>
            </div>

            <div className="grid gap-1">
                <Label htmlFor="os-loadout-item-category">
                    Category{' '}
                    <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                    id="os-loadout-item-category"
                    className="h-8 px-2 text-sm"
                    value={otherscapeLoadoutItem.category}
                    onChange={(event) => setCategory(event.target.value)}
                    placeholder="Weapons, Cybernetics, Drones..."
                />
                <p className="text-xs text-muted-foreground">
                    The rubric this item is filed under. Printed in the header
                    band; left empty, the band still shows.
                </p>
            </div>

            <div className="grid gap-1">
                <Label htmlFor="os-loadout-item-description">
                    Description{' '}
                    <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Textarea
                    id="os-loadout-item-description"
                    className="min-h-24 text-sm"
                    value={otherscapeLoadoutItem.description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="What the item is, and what carrying it says about you."
                />
                <p className="text-xs text-muted-foreground">
                    Markdown and braced tags are rendered. Leave a blank line
                    between paragraphs.
                </p>
            </div>
        </div>
    )
}
