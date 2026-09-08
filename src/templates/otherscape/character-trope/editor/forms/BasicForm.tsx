import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useOtherscapeCharacterTropeStore } from '../../hooks'

export default function BasicForm() {
    const { otherscapeCharacterTrope, setOtherscapeCharacterTrope } =
        useOtherscapeCharacterTropeStore()

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label htmlFor="os-character-trope-name">
                    Character Trope name
                </Label>
                <Input
                    id="os-character-trope-name"
                    className="h-8 px-2 text-sm"
                    placeholder="e.g., Neon Exorcist"
                    value={otherscapeCharacterTrope.name}
                    onChange={(event) =>
                        setOtherscapeCharacterTrope({
                            name:
                                event.target.value ||
                                'Untitled Character Trope',
                        })
                    }
                />
            </div>

            <div className="grid gap-1">
                <Label htmlFor="os-character-trope-category">Category</Label>
                {/* Free text rather than a picker: the category groups tropes
                    on the page, and nothing in the app resolves against it. */}
                <Input
                    id="os-character-trope-category"
                    className="h-8 px-2 text-sm"
                    placeholder="e.g., MYSTICS & MEDIUMS"
                    value={otherscapeCharacterTrope.category}
                    onChange={(event) =>
                        setOtherscapeCharacterTrope({
                            category: event.target.value,
                        })
                    }
                />
                <p className="text-xs text-muted-foreground">
                    The family of characters this trope belongs to, as the book
                    files it.
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="os-character-trope-description">
                    Description
                </Label>
                <Textarea
                    id="os-character-trope-description"
                    rows={4}
                    className="px-2 py-1 text-sm"
                    placeholder="Write a short summary of the character trope here..."
                    value={otherscapeCharacterTrope.description}
                    onChange={(event) =>
                        setOtherscapeCharacterTrope({
                            description: event.target.value,
                        })
                    }
                />
            </div>
        </div>
    )
}
