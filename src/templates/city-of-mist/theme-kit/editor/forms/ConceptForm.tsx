import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useUiText } from '@/i18n/text'
import { useCityOfMistThemeKitStore } from '../../hooks'
import StringListInput from './StringListInput'

/* The page's four prose zones in one pass: they are written together and read
   together, and a panel that flipped between them for a one-line edit would
   cost more than it saves. */
export default function ConceptForm() {
    const text = useUiText()
    const { cityOfMistThemeKit, setCityOfMistThemeKit, setExtraTags } =
        useCityOfMistThemeKitStore()

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label htmlFor="theme-kit-introduction">
                    {text('city:forms.themeKit.concept.introductionLabel')}
                </Label>
                <Textarea
                    id="theme-kit-introduction"
                    className="min-h-28 text-sm"
                    value={cityOfMistThemeKit.introduction}
                    onChange={(event) =>
                        setCityOfMistThemeKit({
                            introduction: event.target.value,
                        })
                    }
                    placeholder={text(
                        'city:forms.themeKit.concept.introductionPlaceholder'
                    )}
                />
            </div>
            <div className="grid gap-1">
                <Label htmlFor="theme-kit-concept">
                    {text('city:forms.themeKit.concept.conceptLabel')}
                </Label>
                <Textarea
                    id="theme-kit-concept"
                    className="min-h-16 text-sm"
                    value={cityOfMistThemeKit.concept}
                    onChange={(event) =>
                        setCityOfMistThemeKit({ concept: event.target.value })
                    }
                    placeholder={text(
                        'city:forms.themeKit.concept.conceptPlaceholder'
                    )}
                />
            </div>
            <div className="grid gap-1">
                <Label>
                    {text('city:forms.themeKit.concept.extraTagsLabel')}
                </Label>
                <StringListInput
                    value={cityOfMistThemeKit.extra_tags}
                    onChange={setExtraTags}
                    placeholder={text(
                        'city:forms.themeKit.concept.extraTagPlaceholder'
                    )}
                />
                <p className="text-xs text-muted-foreground">
                    {text('city:forms.themeKit.concept.extraTagsHelp')}
                </p>
            </div>
            <div className="grid gap-1">
                <Label htmlFor="theme-kit-title-guidance">
                    {text('city:forms.themeKit.concept.titleGuidanceLabel')}
                </Label>
                <Textarea
                    id="theme-kit-title-guidance"
                    className="min-h-16 text-sm"
                    value={cityOfMistThemeKit.title_guidance}
                    onChange={(event) =>
                        setCityOfMistThemeKit({
                            title_guidance: event.target.value,
                        })
                    }
                    placeholder={text(
                        'city:forms.themeKit.concept.titleGuidancePlaceholder'
                    )}
                />
            </div>
            <p className="text-xs text-muted-foreground">
                {text('city:forms.shared.help.inlineMarkdown')}
            </p>
        </div>
    )
}
