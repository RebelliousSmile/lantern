import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/utils/cn'
import { useCityOfMistCustomMoveStore, type CustomMoveKind } from '../../hooks'
import TemplateGuideForm from './TemplateGuideForm'

const KINDS: { value: CustomMoveKind; label: string; hint: string }[] = [
    {
        value: 'danger',
        label: 'Danger',
        hint: 'Belongs to a danger and fires when it acts.',
    },
    {
        value: 'situational',
        label: 'Situational',
        hint: 'Belongs to a place or a situation the crew walks into.',
    },
    {
        value: 'improvement',
        label: 'Improvement',
        hint: 'Belongs to a theme and is bought as an improvement.',
    },
]

export default function TriggerForm() {
    const { cityOfMistCustomMove, setCityOfMistCustomMove } =
        useCityOfMistCustomMoveStore()
    const kind = KINDS.find(
        (entry) => entry.value === cityOfMistCustomMove.kind
    )

    return (
        <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                <div className="grid gap-1">
                    <Label htmlFor="move-name">Move name</Label>
                    <Input
                        id="move-name"
                        className="h-8 px-2 text-sm"
                        value={cityOfMistCustomMove.name}
                        onChange={(event) =>
                            setCityOfMistCustomMove({
                                name: event.target.value,
                            })
                        }
                        placeholder="e.g., War-Torn City"
                    />
                </div>

                <div className="grid w-[88px] gap-1">
                    <Label htmlFor="move-impact">Impact (0-3)</Label>
                    <Input
                        id="move-impact"
                        className="h-8 px-2 text-sm"
                        type="number"
                        min={0}
                        max={3}
                        value={cityOfMistCustomMove.impact || 0}
                        onChange={(event) =>
                            setCityOfMistCustomMove({
                                impact: Math.max(
                                    0,
                                    Math.min(
                                        3,
                                        Math.floor(
                                            Number(event.target.value) || 0
                                        )
                                    )
                                ),
                            })
                        }
                    />
                </div>
            </div>

            <div className="grid gap-1">
                <Label>Kind</Label>
                <div className="grid grid-cols-3 overflow-hidden rounded-md border">
                    {KINDS.map((entry) => (
                        <Button
                            key={entry.value}
                            type="button"
                            variant={
                                cityOfMistCustomMove.kind === entry.value
                                    ? 'default'
                                    : 'ghost'
                            }
                            className={cn(
                                'h-8 rounded-none border-none px-2 text-xs',
                                cityOfMistCustomMove.kind === entry.value
                                    ? ''
                                    : 'bg-background'
                            )}
                            onClick={() =>
                                setCityOfMistCustomMove({ kind: entry.value })
                            }
                        >
                            {entry.label}
                        </Button>
                    ))}
                </div>
                {kind ? (
                    <p className="text-xs text-muted-foreground">{kind.hint}</p>
                ) : null}
            </div>

            <TemplateGuideForm />

            <div className="space-y-2">
                <Label htmlFor="move-trigger">Trigger</Label>
                <Textarea
                    id="move-trigger"
                    rows={3}
                    className="px-2 py-1 text-sm"
                    value={cityOfMistCustomMove.trigger}
                    onChange={(event) =>
                        setCityOfMistCustomMove({ trigger: event.target.value })
                    }
                    placeholder="When you spend a day in the war-torn city,"
                />
                <p className="text-xs text-muted-foreground">
                    Supports Markdown. A trigger reads as the opening half of a
                    sentence the outcomes finish.
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="move-frequency">
                    Frequency{' '}
                    <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                    id="move-frequency"
                    className="h-8 px-2 text-sm"
                    value={cityOfMistCustomMove.frequency}
                    onChange={(event) =>
                        setCityOfMistCustomMove({
                            frequency: event.target.value,
                        })
                    }
                    placeholder="e.g., Once per day spent in the city."
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="move-mc-note">
                    MC note{' '}
                    <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Textarea
                    id="move-mc-note"
                    rows={3}
                    className="px-2 py-1 text-sm"
                    value={cityOfMistCustomMove.mc_note}
                    onChange={(event) =>
                        setCityOfMistCustomMove({ mc_note: event.target.value })
                    }
                    placeholder="How to run the move at the table."
                />
            </div>
        </div>
    )
}
