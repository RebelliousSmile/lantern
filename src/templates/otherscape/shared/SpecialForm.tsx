import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useUiText } from '@/i18n/text'

export type SpecialValue = { name: string; description: string }

/* The Special a themed card closes on, edited the same way on a kit and on a
   theme: the owner passes the value it holds, the id prefix that keeps its
   inputs apart, and how a change is written back. */
export default function SpecialForm({
    idPrefix,
    special,
    onChange,
}: {
    idPrefix: string
    special: SpecialValue
    onChange: (update: Partial<SpecialValue>) => void
}) {
    const text = useUiText()
    // The schema requires both fields of a Special: a half-filled one is not
    // written out, and the form says so rather than dropping it silently.
    const incomplete = !!special.name.trim() !== !!special.description.trim()

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label htmlFor={`${idPrefix}-special-name`}>
                    {text('otherscape:forms.themeKit.special.nameLabel')}
                </Label>
                <Input
                    id={`${idPrefix}-special-name`}
                    className="h-8 px-2 text-sm"
                    value={special.name}
                    onChange={(event) => onChange({ name: event.target.value })}
                    placeholder={text(
                        'otherscape:forms.themeKit.special.namePlaceholder'
                    )}
                />
            </div>

            <div className="grid gap-1">
                <Label htmlFor={`${idPrefix}-special-description`}>
                    {text('otherscape:forms.themeKit.special.descriptionLabel')}
                </Label>
                <Textarea
                    id={`${idPrefix}-special-description`}
                    className="min-h-24 text-sm"
                    value={special.description}
                    onChange={(event) =>
                        onChange({ description: event.target.value })
                    }
                    placeholder={text(
                        'otherscape:forms.themeKit.special.descriptionPlaceholder'
                    )}
                />
                <p className="text-xs text-muted-foreground">
                    {text(
                        incomplete
                            ? 'otherscape:forms.themeKit.special.incomplete'
                            : 'otherscape:forms.themeKit.special.hint'
                    )}
                </p>
            </div>
        </div>
    )
}
