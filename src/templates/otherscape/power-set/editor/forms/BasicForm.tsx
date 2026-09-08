import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/utils/cn'
import { useOtherscapePowerSetStore } from '../../hooks'
import { powerSetTypeOptions } from '../../metadata'

export default function BasicForm() {
    const { otherscapePowerSet, setOtherscapePowerSet } =
        useOtherscapePowerSetStore()

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label htmlFor="os-power-set-name">Power Set name</Label>
                <Input
                    id="os-power-set-name"
                    className="h-8 px-2 text-sm"
                    placeholder="e.g., Source-Touched Berserk"
                    value={otherscapePowerSet.name}
                    onChange={(event) =>
                        setOtherscapePowerSet({
                            name: event.target.value || 'Untitled Power Set',
                        })
                    }
                />
            </div>

            <div className="space-y-2">
                <Label>Type</Label>
                {/* Segmented rather than a dropdown: three choices, all of them
                    worth seeing at once, and one of them is always taken. */}
                <div className="grid grid-cols-3 overflow-hidden rounded-md border sm:inline-grid">
                    {powerSetTypeOptions.map((option) => (
                        <Button
                            key={option.value}
                            type="button"
                            variant={
                                otherscapePowerSet.type === option.value
                                    ? 'default'
                                    : 'ghost'
                            }
                            className={cn(
                                'h-8 rounded-none border-none px-3 text-xs',
                                otherscapePowerSet.type === option.value
                                    ? ''
                                    : 'bg-background'
                            )}
                            onClick={() =>
                                setOtherscapePowerSet({ type: option.value })
                            }
                        >
                            {option.label}
                        </Button>
                    ))}
                </div>
                <p className="text-xs text-muted-foreground">
                    The type colours the card and says where the power comes
                    from: Self from the person, Mythos from something older,
                    Noise from the network.
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="os-power-set-description">Description</Label>
                <Textarea
                    id="os-power-set-description"
                    rows={4}
                    className="px-2 py-1 text-sm"
                    placeholder="Write a short summary of the power set here..."
                    value={otherscapePowerSet.description}
                    onChange={(event) =>
                        setOtherscapePowerSet({
                            description: event.target.value,
                        })
                    }
                />
            </div>
        </div>
    )
}
