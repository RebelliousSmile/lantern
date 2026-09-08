import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useOtherscapeThemeKitStore, type ThemeType } from '../../hooks'
import { QUEST_LABEL, THEME_TYPE_LABEL } from '../../model'

const THEME_TYPES: ThemeType[] = ['self', 'mythos', 'noise', 'crew']

export default function BasicForm() {
    const { otherscapeThemeKit, setTitleTag, setThemeType, setCategory } =
        useOtherscapeThemeKitStore()

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label htmlFor="os-theme-kit-title-tag">Title tag</Label>
                <Input
                    id="os-theme-kit-title-tag"
                    className="h-8 px-2 text-sm"
                    value={otherscapeThemeKit.title_tag}
                    onChange={(event) => setTitleTag(event.target.value)}
                    placeholder="Back-Alley Ripperdoc"
                />
                <p className="text-xs text-muted-foreground">
                    The card prints it as its title, so write it bare, without
                    braces, and leave it out of the power tags.
                </p>
            </div>

            <div className="grid gap-1">
                <Label>Theme type</Label>
                <RadioGroup
                    value={otherscapeThemeKit.theme_type}
                    onValueChange={(value) => setThemeType(value as ThemeType)}
                    className="flex flex-wrap items-center gap-3"
                >
                    {THEME_TYPES.map((themeType) => (
                        <label
                            key={themeType}
                            className="flex cursor-pointer items-center gap-2"
                        >
                            <RadioGroupItem
                                value={themeType}
                                id={`os-theme-kit-type-${themeType}`}
                            />
                            <span className="text-xs">
                                {THEME_TYPE_LABEL[themeType]}
                            </span>
                        </label>
                    ))}
                </RadioGroup>
                <p className="text-xs text-muted-foreground">
                    Sets the card's colour and what its quest is called:{' '}
                    {QUEST_LABEL[otherscapeThemeKit.theme_type]} for a{' '}
                    {THEME_TYPE_LABEL[otherscapeThemeKit.theme_type]} theme.
                </p>
            </div>

            <div className="grid gap-1">
                <Label htmlFor="os-theme-kit-category">
                    Themebook{' '}
                    <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                    id="os-theme-kit-category"
                    className="h-8 px-2 text-sm"
                    value={otherscapeThemeKit.category}
                    onChange={(event) => setCategory(event.target.value)}
                    placeholder="Street Trade, Augmented, Enclave..."
                />
                <p className="text-xs text-muted-foreground">
                    Printed in the header band. Left empty, the band still
                    shows.
                </p>
            </div>
        </div>
    )
}
