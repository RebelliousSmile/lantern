import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useUiText } from '@/i18n/text'
import { useOtherscapeThemeKitStore } from '../../hooks'

export default function SpecialForm() {
    const text = useUiText()
    const { otherscapeThemeKit, setSpecial } = useOtherscapeThemeKitStore()
    const special = otherscapeThemeKit.special
    // The schema requires both fields of a Special: a half-filled one is not
    // written out, and the form says so rather than dropping it silently.
    const incomplete = !!special.name.trim() !== !!special.description.trim()

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label htmlFor="os-theme-kit-special-name">
                    {text('otherscape:forms.themeKit.special.nameLabel')}
                </Label>
                <Input
                    id="os-theme-kit-special-name"
                    className="h-8 px-2 text-sm"
                    value={special.name}
                    onChange={(event) =>
                        setSpecial({ name: event.target.value })
                    }
                    placeholder={text(
                        'otherscape:forms.themeKit.special.namePlaceholder'
                    )}
                />
            </div>

            <div className="grid gap-1">
                <Label htmlFor="os-theme-kit-special-description">
                    {text('otherscape:forms.themeKit.special.descriptionLabel')}
                </Label>
                <Textarea
                    id="os-theme-kit-special-description"
                    className="min-h-24 text-sm"
                    value={special.description}
                    onChange={(event) =>
                        setSpecial({ description: event.target.value })
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
