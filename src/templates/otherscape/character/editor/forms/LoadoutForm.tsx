import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUiText } from '@/i18n/text'
import { cn } from '@/utils/cn'
import {
    ChevronDown,
    ChevronRight,
    ChevronUp,
    Plus,
    Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useOtherscapeCharacterStore } from '../../hooks'
import { blankLoadoutItem } from '../../model'
import { zoneLabel } from '../../zoneLabels'
import TagChips from './TagChips'

/* A click on one item of the sheet opens this list with that item expanded;
   a click on the band opens it with every row closed. The parent remounts the
   form on the item, so the starting row is read once. */
export default function LoadoutForm({ focusIndex }: { focusIndex?: number }) {
    const text = useUiText()
    const { i18n } = useTranslation()
    const {
        otherscapeCharacter,
        addLoadoutItem,
        updateLoadoutItemAt,
        removeLoadoutItemAt,
        moveLoadoutItem,
    } = useOtherscapeCharacterStore()
    const [openIndex, setOpenIndex] = useState<number | null>(
        focusIndex ?? null
    )
    const loadout = otherscapeCharacter.loadout

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold">
                {zoneLabel('loadout', i18n.resolvedLanguage)}
            </h3>
            <p className="text-xs text-muted-foreground">
                {text('otherscape:forms.character.loadout.hint')}
            </p>

            {loadout.length === 0 && (
                <p className="text-sm text-muted-foreground">
                    {text('otherscape:forms.character.loadout.empty')}
                </p>
            )}

            <ul className="space-y-2">
                {loadout.map((item, index) => {
                    const expanded = openIndex === index
                    const id = `os-character-loadout-${index}`
                    return (
                        <li key={index} className="rounded-md border bg-card">
                            <div className="flex items-center gap-1.5 px-2 py-1.5">
                                <Checkbox
                                    checked={item.loaded === true}
                                    aria-label={text(
                                        'otherscape:forms.character.loadout.loadedAriaLabel',
                                        { name: item.name }
                                    )}
                                    onCheckedChange={(value) =>
                                        updateLoadoutItemAt(index, {
                                            loaded: value === true,
                                        })
                                    }
                                />
                                <button
                                    type="button"
                                    className={cn(
                                        'flex min-w-0 flex-1 cursor-pointer items-center gap-1 text-left text-sm',
                                        item.loaded !== true &&
                                            'text-muted-foreground'
                                    )}
                                    aria-expanded={expanded}
                                    aria-label={text(
                                        expanded
                                            ? 'otherscape:forms.character.loadout.collapseAriaLabel'
                                            : 'otherscape:forms.character.loadout.expandAriaLabel',
                                        { name: item.name }
                                    )}
                                    onClick={() =>
                                        setOpenIndex(expanded ? null : index)
                                    }
                                >
                                    {expanded ? (
                                        <ChevronDown
                                            className="size-3.5 shrink-0"
                                            aria-hidden
                                        />
                                    ) : (
                                        <ChevronRight
                                            className="size-3.5 shrink-0"
                                            aria-hidden
                                        />
                                    )}
                                    <span className="truncate">
                                        {item.name}
                                    </span>
                                </button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="size-7"
                                    disabled={index === 0}
                                    aria-label={text(
                                        'otherscape:forms.character.loadout.moveUpAriaLabel',
                                        { name: item.name }
                                    )}
                                    onClick={() => {
                                        moveLoadoutItem(index, index - 1)
                                        if (expanded) setOpenIndex(index - 1)
                                    }}
                                >
                                    <ChevronUp
                                        className="size-3.5"
                                        aria-hidden
                                    />
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="size-7"
                                    disabled={index === loadout.length - 1}
                                    aria-label={text(
                                        'otherscape:forms.character.loadout.moveDownAriaLabel',
                                        { name: item.name }
                                    )}
                                    onClick={() => {
                                        moveLoadoutItem(index, index + 1)
                                        if (expanded) setOpenIndex(index + 1)
                                    }}
                                >
                                    <ChevronDown
                                        className="size-3.5"
                                        aria-hidden
                                    />
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="size-7"
                                    aria-label={text(
                                        'otherscape:forms.character.loadout.removeAriaLabel',
                                        { name: item.name }
                                    )}
                                    onClick={() => {
                                        removeLoadoutItemAt(index)
                                        setOpenIndex(null)
                                    }}
                                >
                                    <Trash2 className="size-3.5" aria-hidden />
                                </Button>
                            </div>

                            {expanded && (
                                <div className="space-y-3 border-t px-3 py-3">
                                    <div className="grid gap-1">
                                        <Label htmlFor={`${id}-name`}>
                                            {text(
                                                'otherscape:forms.character.loadout.nameLabel'
                                            )}
                                        </Label>
                                        <Input
                                            id={`${id}-name`}
                                            className="h-8 px-2 text-sm"
                                            value={item.name}
                                            placeholder={text(
                                                'otherscape:forms.character.loadout.namePlaceholder'
                                            )}
                                            onChange={(event) =>
                                                updateLoadoutItemAt(index, {
                                                    name: event.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="grid gap-1">
                                        <Label htmlFor={`${id}-tags`}>
                                            {text(
                                                'otherscape:forms.character.loadout.featureTagsLabel'
                                            )}
                                        </Label>
                                        <TagChips
                                            id={`${id}-tags`}
                                            tags={item.feature_tags}
                                            placeholder={text(
                                                'otherscape:forms.character.loadout.featureTagsPlaceholder'
                                            )}
                                            onChange={(feature_tags) =>
                                                updateLoadoutItemAt(index, {
                                                    feature_tags,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="grid gap-1">
                                        <Label htmlFor={`${id}-weakness`}>
                                            {text(
                                                'otherscape:forms.character.loadout.weaknessTagLabel'
                                            )}
                                        </Label>
                                        <Input
                                            id={`${id}-weakness`}
                                            className="h-8 px-2 text-sm"
                                            value={item.weakness_tag}
                                            placeholder={text(
                                                'otherscape:forms.character.loadout.weaknessTagPlaceholder'
                                            )}
                                            onChange={(event) =>
                                                updateLoadoutItemAt(index, {
                                                    weakness_tag:
                                                        event.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {text(
                                            'otherscape:forms.character.loadout.loadedHelp'
                                        )}
                                    </p>
                                </div>
                            )}
                        </li>
                    )
                })}
            </ul>

            <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-8 text-xs"
                onClick={() => {
                    addLoadoutItem(blankLoadoutItem())
                    setOpenIndex(loadout.length)
                }}
            >
                <Plus className="size-3.5" aria-hidden />
                {text('otherscape:forms.character.loadout.addButton')}
            </Button>
        </div>
    )
}
