import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useUiText } from '@/i18n/text'
import { useOtherscapeThemeKitStore } from '../../hooks'

export default function DescriptionForm() {
    const text = useUiText()
    const { otherscapeThemeKit, setDescription } = useOtherscapeThemeKitStore()

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label htmlFor="os-theme-kit-description">
                    {text('otherscape:forms.themeKit.description.label')}{' '}
                    <span className="text-muted-foreground">
                        {text('otherscape:forms.themeKit.optional')}
                    </span>
                </Label>
                <Textarea
                    id="os-theme-kit-description"
                    className="min-h-32 text-sm"
                    value={otherscapeThemeKit.description}
                    onChange={(event) => setDescription(event.target.value)}
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
