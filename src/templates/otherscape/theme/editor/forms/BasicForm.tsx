import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useOtherscapeThemeStore, type ThemeType } from '../../hooks'
import { QUEST_LABEL, THEME_TYPE_LABEL } from '../../model'

const THEME_TYPES: ThemeType[] = ['self', 'mythos', 'noise', 'crew']

export default function BasicForm() {
    const { otherscapeTheme, setTitleTag, setThemeType, setCategory } =
        useOtherscapeThemeStore()

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label htmlFor="os-theme-title-tag">Title tag</Label>
                <Input
                    id="os-theme-title-tag"
                    className="h-8 px-2 text-sm"
                    value={otherscapeTheme.title_tag}
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
                    value={otherscapeTheme.theme_type}
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
                                id={`os-theme-type-${themeType}`}
                            />
                            <span className="text-xs">
                                {THEME_TYPE_LABEL[themeType]}
                            </span>
                        </label>
                    ))}
                </RadioGroup>
                <p className="text-xs text-muted-foreground">
                    Sets the card's colour and what its quest is called:{' '}
                    {QUEST_LABEL[otherscapeTheme.theme_type]} for a{' '}
                    {THEME_TYPE_LABEL[otherscapeTheme.theme_type]} theme.
                </p>
            </div>

            <div className="grid gap-1">
                <Label htmlFor="os-theme-category">
                    Themebook{' '}
                    <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                    id="os-theme-category"
                    className="h-8 px-2 text-sm"
                    value={otherscapeTheme.category}
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
