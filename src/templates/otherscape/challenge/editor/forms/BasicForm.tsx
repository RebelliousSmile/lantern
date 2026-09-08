import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useOtherscapeChallengeStore } from '../../hooks'

export default function BasicForm() {
    const { otherscapeChallenge, setOtherscapeChallenge } =
        useOtherscapeChallengeStore()

    return (
        <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                <div className="grid gap-1">
                    <Label htmlFor="os-challenge-name">Challenge name</Label>
                    <Input
                        id="os-challenge-name"
                        className="h-8 px-2 text-sm"
                        placeholder="e.g., Chrome Vulture Runner"
                        value={otherscapeChallenge.name}
                        onChange={(event) =>
                            setOtherscapeChallenge({
                                name:
                                    event.target.value || 'Untitled Challenge',
                            })
                        }
                    />
                </div>

                <div className="grid w-[88px] gap-1">
                    <Label htmlFor="os-challenge-scale">Scale</Label>
                    <Input
                        id="os-challenge-scale"
                        className="h-8 px-2 text-sm"
                        type="number"
                        step={1}
                        placeholder="-"
                        value={otherscapeChallenge.scale ?? ''}
                        onChange={(event) => {
                            /* An emptied field is not a zero: it is a Challenge
                               that prints no scale at all, which is what the
                               document stores as `null`. */
                            const raw = event.target.value.trim()
                            setOtherscapeChallenge({
                                scale: raw ? Math.trunc(Number(raw)) : null,
                            })
                        }}
                    />
                </div>
            </div>
            <p className="text-xs text-muted-foreground">
                Leave the scale empty for a person-sized Challenge. Larger
                counts up, and smaller counts down.
            </p>

            <div className="space-y-2">
                <Label htmlFor="os-challenge-description">Description</Label>
                <Textarea
                    id="os-challenge-description"
                    rows={4}
                    className="px-2 py-1 text-sm"
                    placeholder="Write a short summary of the challenge here..."
                    value={otherscapeChallenge.description}
                    onChange={(event) =>
                        setOtherscapeChallenge({
                            description: event.target.value,
                        })
                    }
                />
            </div>
        </div>
    )
}
