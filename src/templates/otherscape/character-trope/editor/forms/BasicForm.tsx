import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useUiText } from '@/i18n/text'
import { useOtherscapeCharacterTropeStore } from '../../hooks'

export default function BasicForm() {
    const text = useUiText()
    const { otherscapeCharacterTrope, setOtherscapeCharacterTrope } =
        useOtherscapeCharacterTropeStore()

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label htmlFor="os-character-trope-name">
                    {text('otherscape:forms.characterTrope.basic.nameLabel')}
                </Label>
                <Input
                    id="os-character-trope-name"
                    className="h-8 px-2 text-sm"
                    placeholder={text(
                        'otherscape:forms.characterTrope.basic.namePlaceholder'
                    )}
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
                <Label htmlFor="os-character-trope-category">
                    {text(
                        'otherscape:forms.characterTrope.basic.categoryLabel'
                    )}
                </Label>
                {/* Free text rather than a picker: the category groups tropes
                    on the page, and nothing in the app resolves against it. */}
                <Input
                    id="os-character-trope-category"
                    className="h-8 px-2 text-sm"
                    placeholder={text(
                        'otherscape:forms.characterTrope.basic.categoryPlaceholder'
                    )}
                    value={otherscapeCharacterTrope.category}
                    onChange={(event) =>
                        setOtherscapeCharacterTrope({
                            category: event.target.value,
                        })
                    }
                />
                <p className="text-xs text-muted-foreground">
                    {text('otherscape:forms.characterTrope.basic.categoryHint')}
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="os-character-trope-description">
                    {text('fields.description')}
                </Label>
                <Textarea
                    id="os-character-trope-description"
                    rows={4}
                    className="px-2 py-1 text-sm"
                    placeholder={text(
                        'otherscape:forms.characterTrope.basic.descriptionPlaceholder'
                    )}
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
