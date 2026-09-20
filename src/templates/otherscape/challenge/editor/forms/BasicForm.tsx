import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useUiText } from '@/i18n/text'
import { useOtherscapeChallengeStore } from '../../hooks'

export default function BasicForm() {
    const text = useUiText()
    const { otherscapeChallenge, setOtherscapeChallenge } =
        useOtherscapeChallengeStore()

    return (
        <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                <div className="grid gap-1">
                    <Label htmlFor="os-challenge-name">
                        {text('otherscape:forms.challenge.basic.nameLabel')}
                    </Label>
                    <Input
                        id="os-challenge-name"
                        className="h-8 px-2 text-sm"
                        placeholder={text(
                            'otherscape:forms.challenge.basic.namePlaceholder'
                        )}
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
                    <Label htmlFor="os-challenge-scale">
                        {text('otherscape:forms.challenge.basic.scaleLabel')}
                    </Label>
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
                {text('otherscape:forms.challenge.basic.scaleHint')}
            </p>

            <div className="space-y-2">
                <Label htmlFor="os-challenge-description">
                    {text('fields.description')}
                </Label>
                <Textarea
                    id="os-challenge-description"
                    rows={4}
                    className="px-2 py-1 text-sm"
                    placeholder={text(
                        'otherscape:forms.challenge.basic.descriptionPlaceholder'
                    )}
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
