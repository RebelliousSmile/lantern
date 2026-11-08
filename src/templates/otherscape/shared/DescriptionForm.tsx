import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useUiText } from '@/i18n/text'

/* The description a themed card prints under its band. The kit and the theme
   edit the same free text, so the field lives once; each owner passes the
   value it holds and the id prefix that keeps its inputs apart on a page that
   mounts more than one form. The wording keeps the keys it was validated
   under. */
export default function DescriptionForm({
    idPrefix,
    value,
    onChange,
}: {
    idPrefix: string
    value: string
    onChange: (description: string) => void
}) {
    const text = useUiText()

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label htmlFor={`${idPrefix}-description`}>
                    {text('otherscape:forms.themeKit.description.label')}{' '}
                    <span className="text-muted-foreground">
                        {text('otherscape:forms.themeKit.optional')}
                    </span>
                </Label>
                <Textarea
                    id={`${idPrefix}-description`}
                    className="min-h-32 text-sm"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder={text(
                        'otherscape:forms.themeKit.description.placeholder'
                    )}
                />
                <p className="text-xs text-muted-foreground">
                    {text('otherscape:forms.themeKit.description.hint')}
                </p>
            </div>
        </div>
    )
}
