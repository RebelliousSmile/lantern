import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useUiText, type TranslationKey } from '@/i18n/text'
import { cn } from '@/utils/cn'
import { Trash2 } from 'lucide-react'
import {
    useCityOfMistThemeKitStore,
    type MotivationKind,
    type ThemeType,
} from '../../hooks'
import StringListInput from './StringListInput'

const KINDS: { value: MotivationKind; label: TranslationKey }[] = [
    { value: 'mystery', label: 'city:forms.shared.zone.mystery' },
    { value: 'identity', label: 'city:forms.shared.zone.identity' },
    { value: 'either', label: 'city:forms.themeKit.motivation.kindEither' },
]

const ZONE_LABEL: Record<ThemeType, TranslationKey> = {
    mythos: 'city:forms.shared.zone.mystery',
    logos: 'city:forms.shared.zone.identity',
    extra: 'city:forms.shared.zone.motivation',
    crew: 'city:forms.shared.zone.motivation',
}

export default function MotivationForm() {
    const text = useUiText()
    const { cityOfMistThemeKit, setMotivation } = useCityOfMistThemeKitStore()
    const motivation = cityOfMistThemeKit.motivation
    const themeType = cityOfMistThemeKit.theme_type
    /* Mythos asks a Mystery and Logos states an Identity — the type already
       decides, so the choice only appears on the themebooks that leave it
       open. */
    const kindIsOpen = themeType === 'extra'

    return (
        <div className="space-y-4">
            {themeType === 'crew' ? (
                <p className="rounded-md border border-dashed p-2 text-xs text-muted-foreground">
                    {text('city:forms.themeKit.motivation.crewNote')}
                </p>
            ) : null}

            {kindIsOpen ? (
                <div className="grid gap-1">
                    <Label>
                        {text('city:forms.themeKit.motivation.writtenAs')}
                    </Label>
                    <div className="grid grid-cols-3 overflow-hidden rounded-md border">
                        {KINDS.map((kind) => (
                            <Button
                                key={kind.value}
                                type="button"
                                variant={
                                    (motivation?.kind ?? 'either') ===
                                    kind.value
                                        ? 'default'
                                        : 'ghost'
                                }
                                className={cn(
                                    'h-8 rounded-none border-none px-1 text-xs',
                                    (motivation?.kind ?? 'either') ===
                                        kind.value
                                        ? ''
                                        : 'bg-background'
                                )}
                                onClick={() =>
                                    setMotivation({ kind: kind.value })
                                }
                            >
                                {text(kind.label)}
                            </Button>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="text-xs text-muted-foreground">
                    {text('city:forms.themeKit.motivation.fixedKind', {
                        type: text(
                            themeType === 'mythos'
                                ? 'city:forms.shared.themeType.mythos'
                                : 'city:forms.shared.themeType.logos'
                        ),
                        zone: text(ZONE_LABEL[themeType]),
                    })}
                </p>
            )}

            <div className="grid gap-1">
                <Label htmlFor="theme-kit-motivation-intro">
                    {text('city:forms.themeKit.motivation.introLabel')}
                </Label>
                <Textarea
                    id="theme-kit-motivation-intro"
                    className="min-h-20 text-sm"
                    value={motivation?.intro ?? ''}
                    onChange={(event) =>
                        setMotivation({ intro: event.target.value })
                    }
                    placeholder={text(
                        'city:forms.themeKit.motivation.introPlaceholder'
                    )}
                />
                <p className="text-xs text-muted-foreground">
                    {text('city:forms.themeKit.motivation.introHelp')}
                </p>
            </div>

            <div className="grid gap-1">
                <Label>
                    {text('city:forms.themeKit.motivation.examplesLabel')}{' '}
                    <span className="text-muted-foreground">
                        {text('city:forms.shared.meta.optional')}
                    </span>
                </Label>
                <StringListInput
                    value={motivation?.examples ?? []}
                    onChange={(examples) =>
                        setMotivation({
                            examples: examples.length ? examples : undefined,
                        })
                    }
                    placeholder={text(
                        'city:forms.themeKit.motivation.examplePlaceholder'
                    )}
                />
            </div>

            <div className="grid gap-1">
                <Label>
                    {text('city:forms.themeKit.motivation.optionsLabel')}{' '}
                    <span className="text-muted-foreground">
                        {text('city:forms.shared.meta.optional')}
                    </span>
                </Label>
                <StringListInput
                    value={motivation?.options ?? []}
                    onChange={(options) =>
                        setMotivation({
                            options: options.length ? options : undefined,
                        })
                    }
                    placeholder={text(
                        'city:forms.themeKit.motivation.optionPlaceholder'
                    )}
                />
                <p className="text-xs text-muted-foreground">
                    {text('city:forms.themeKit.motivation.optionsHelp')}
                </p>
            </div>

            <div className="grid gap-1">
                <Label htmlFor="theme-kit-motivation-rule">
                    {text('city:forms.themeKit.motivation.ruleLabel')}{' '}
                    <span className="text-muted-foreground">
                        {text('city:forms.shared.meta.optional')}
                    </span>
                </Label>
                <Textarea
                    id="theme-kit-motivation-rule"
                    className="min-h-16 text-sm"
                    value={motivation?.rule ?? ''}
                    onChange={(event) =>
                        setMotivation({ rule: event.target.value })
                    }
                    placeholder={text(
                        'city:forms.themeKit.motivation.rulePlaceholder'
                    )}
                />
            </div>

            {motivation ? (
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1.5 text-xs text-destructive"
                    onClick={() => setMotivation(null)}
                >
                    <Trash2 className="h-3.5 w-3.5" />{' '}
                    {text('city:forms.themeKit.motivation.remove')}
                </Button>
            ) : null}
        </div>
    )
}
