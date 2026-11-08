import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useUiText } from '@/i18n/text'
import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
    useOtherscapeCharacterSheetStore,
    useOtherscapeCharacterStore,
} from '../../hooks'
import { isCompleteCombo } from '../../model'
import { zoneLabel } from '../../zoneLabels'
import TagChips from './TagChips'

export default function ComboForm({ index }: { index: number }) {
    const text = useUiText()
    const { i18n } = useTranslation()
    const { otherscapeCharacter, updateComboAt, removeComboAt } =
        useOtherscapeCharacterStore()
    const { closeSheet } = useOtherscapeCharacterSheetStore()

    const combo = otherscapeCharacter.tag_combos[index]
    if (!combo) {
        return (
            <p className="text-sm text-muted-foreground">
                {text('otherscape:forms.character.combos.notFound')}
            </p>
        )
    }

    const id = `os-character-combo-${index}`
    const count = otherscapeCharacter.tag_combos.length

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold">
                {zoneLabel('tag_combos', i18n.resolvedLanguage)}
                {' · '}
                {text('otherscape:forms.character.combos.itemTitle', {
                    position: index + 1,
                    count,
                })}
            </h3>

            <div className="grid gap-1">
                <Label htmlFor={`${id}-label`}>
                    {text('otherscape:forms.character.combos.labelLabel')}
                </Label>
                <Input
                    id={`${id}-label`}
                    className="h-8 px-2 text-sm"
                    value={combo.label}
                    placeholder={text(
                        'otherscape:forms.character.combos.labelPlaceholder'
                    )}
                    onChange={(event) =>
                        updateComboAt(index, { label: event.target.value })
                    }
                />
            </div>

            <div className="grid gap-1">
                <Label htmlFor={`${id}-tags`}>
                    {text('otherscape:forms.character.combos.tagsLabel')}
                </Label>
                <TagChips
                    id={`${id}-tags`}
                    tags={combo.tags}
                    placeholder={text(
                        'otherscape:forms.character.combos.tagsPlaceholder'
                    )}
                    onChange={(tags) => updateComboAt(index, { tags })}
                />
                <p className="text-xs text-muted-foreground">
                    {text('otherscape:forms.character.combos.tagsHelp')}
                </p>
            </div>

            <div className="grid gap-1">
                <Label htmlFor={`${id}-power`}>
                    {zoneLabel('power', i18n.resolvedLanguage)}
                </Label>
                <Input
                    id={`${id}-power`}
                    type="number"
                    min={0}
                    className="h-8 w-24 px-2 text-sm"
                    value={combo.power}
                    onChange={(event) =>
                        updateComboAt(index, {
                            power: Number(event.target.value),
                        })
                    }
                />
            </div>

            <div className="grid gap-1">
                <Label htmlFor={`${id}-effect`}>
                    {text('otherscape:forms.character.combos.effectLabel')}
                </Label>
                <Textarea
                    id={`${id}-effect`}
                    className="min-h-20 px-2 text-sm"
                    value={combo.effect}
                    placeholder={text(
                        'otherscape:forms.character.combos.effectPlaceholder'
                    )}
                    onChange={(event) =>
                        updateComboAt(index, { effect: event.target.value })
                    }
                />
            </div>

            {!isCompleteCombo(combo) && (
                <p className="text-xs text-muted-foreground">
                    {text('otherscape:forms.character.combos.incomplete')}
                </p>
            )}

            <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-8 text-xs"
                onClick={() => {
                    removeComboAt(index)
                    closeSheet()
                }}
            >
                <Trash2 className="size-3.5" aria-hidden />
                {text('otherscape:forms.character.combos.removeButton')}
            </Button>
        </div>
    )
}
