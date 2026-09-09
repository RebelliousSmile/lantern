import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/utils/cn'
import { Trash2 } from 'lucide-react'
import {
    useCityOfMistThemeKitStore,
    type MotivationKind,
    type ThemeType,
} from '../../hooks'
import StringListInput from './StringListInput'

const KINDS: { value: MotivationKind; label: string }[] = [
    { value: 'mystery', label: 'Mystery' },
    { value: 'identity', label: 'Identity' },
    { value: 'either', label: "Player's choice" },
]

const ZONE_LABEL: Record<ThemeType, string> = {
    mythos: 'Mystery',
    logos: 'Identity',
    extra: 'Motivation',
    crew: 'Motivation',
}

export default function MotivationForm() {
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
                    A Crew themebook prints its crew relationships in place of a
                    motivation, so this zone will not appear on the page.
                </p>
            ) : null}

            {kindIsOpen ? (
                <div className="grid gap-1">
                    <Label>Written as</Label>
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
                                {kind.label}
                            </Button>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="text-xs text-muted-foreground">
                    A {themeType === 'mythos' ? 'Mythos' : 'Logos'} themebook
                    always writes this zone as {ZONE_LABEL[themeType]}.
                </p>
            )}

            <div className="grid gap-1">
                <Label htmlFor="theme-kit-motivation-intro">Intro line</Label>
                <Textarea
                    id="theme-kit-motivation-intro"
                    className="min-h-20 text-sm"
                    value={motivation?.intro ?? ''}
                    onChange={(event) =>
                        setMotivation({ intro: event.target.value })
                    }
                    placeholder="What is the question you cannot stop asking?"
                />
                <p className="text-xs text-muted-foreground">
                    The line the themebook prints above the zone. Supports
                    inline Markdown.
                </p>
            </div>

            <div className="grid gap-1">
                <Label>
                    Examples{' '}
                    <span className="text-muted-foreground">(optional)</span>
                </Label>
                <StringListInput
                    value={motivation?.examples ?? []}
                    onChange={(examples) =>
                        setMotivation({
                            examples: examples.length ? examples : undefined,
                        })
                    }
                    placeholder="Add example..."
                />
            </div>

            <div className="grid gap-1">
                <Label>
                    Closed list{' '}
                    <span className="text-muted-foreground">(optional)</span>
                </Label>
                <StringListInput
                    value={motivation?.options ?? []}
                    onChange={(options) =>
                        setMotivation({
                            options: options.length ? options : undefined,
                        })
                    }
                    placeholder="Add option..."
                />
                <p className="text-xs text-muted-foreground">
                    For the themebooks that offer a list to pick from instead of
                    a blank line.
                </p>
            </div>

            <div className="grid gap-1">
                <Label htmlFor="theme-kit-motivation-rule">
                    Rule{' '}
                    <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Textarea
                    id="theme-kit-motivation-rule"
                    className="min-h-16 text-sm"
                    value={motivation?.rule ?? ''}
                    onChange={(event) =>
                        setMotivation({ rule: event.target.value })
                    }
                    placeholder="When you answer this Mystery, the theme fades and you lose it."
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
                    <Trash2 className="h-3.5 w-3.5" /> Remove the motivation
                    zone
                </Button>
            ) : null}
        </div>
    )
}
