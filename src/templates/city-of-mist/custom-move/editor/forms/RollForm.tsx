import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUiText, type TranslationKey } from '@/i18n/text'
import { cn } from '@/utils/cn'
import { useCityOfMistCustomMoveStore, type RollStat } from '../../hooks'

const STATS: { value: RollStat; label: TranslationKey }[] = [
    { value: 'power', label: 'city:forms.customMove.roll.statPower' },
    { value: 'mythos', label: 'city:forms.customMove.roll.statMythos' },
    { value: 'logos', label: 'city:forms.customMove.roll.statLogos' },
    { value: 'custom', label: 'city:forms.customMove.roll.statCustom' },
]

export default function RollForm() {
    const text = useUiText()
    const { cityOfMistCustomMove, setRoll, clearRoll } =
        useCityOfMistCustomMoveStore()
    const roll = cityOfMistCustomMove.roll

    if (!roll) {
        return (
            <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                    {text('city:forms.customMove.roll.empty')}
                </p>
                <Button
                    type="button"
                    size="sm"
                    className="h-8"
                    onClick={() => setRoll({ stat: 'power' })}
                >
                    {text('city:forms.customMove.roll.add')}
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label>{text('city:forms.customMove.roll.statLabel')}</Label>
                <div className="grid grid-cols-4 overflow-hidden rounded-md border">
                    {STATS.map((stat) => (
                        <Button
                            key={stat.value}
                            type="button"
                            variant={
                                roll.stat === stat.value ? 'default' : 'ghost'
                            }
                            className={cn(
                                'h-8 rounded-none border-none px-2 text-xs',
                                roll.stat === stat.value ? '' : 'bg-background'
                            )}
                            onClick={() => setRoll({ stat: stat.value })}
                        >
                            {text(stat.label)}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_110px] sm:items-end">
                <div className="grid gap-1">
                    <Label htmlFor="move-roll-label">
                        {roll.stat === 'custom'
                            ? text('city:forms.customMove.roll.labelCustom')
                            : text(
                                  'city:forms.customMove.roll.labelOverride'
                              )}{' '}
                        <span className="text-muted-foreground">
                            {roll.stat === 'custom'
                                ? ''
                                : text('city:forms.shared.meta.optional')}
                        </span>
                    </Label>
                    <Input
                        id="move-roll-label"
                        className="h-8 px-2 text-sm"
                        value={roll.label ?? ''}
                        onChange={(event) =>
                            setRoll({ label: event.target.value })
                        }
                        placeholder={text(
                            'city:forms.customMove.roll.labelPlaceholder'
                        )}
                    />
                </div>

                <div className="grid gap-1">
                    <Label htmlFor="move-roll-modifier">
                        {text('city:forms.customMove.roll.modifierLabel')}
                    </Label>
                    <Input
                        id="move-roll-modifier"
                        className="h-8 px-2 text-sm"
                        type="number"
                        min={-4}
                        max={4}
                        value={roll.modifier ?? 0}
                        onChange={(event) =>
                            setRoll({
                                modifier: Math.max(
                                    -4,
                                    Math.min(
                                        4,
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

            <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8"
                onClick={clearRoll}
            >
                {text('city:forms.customMove.roll.remove')}
            </Button>
        </div>
    )
}
