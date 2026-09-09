import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCityOfMistThemeKitStore } from '../../hooks'
import StringListInput from './StringListInput'

/* The page's four prose zones in one pass: they are written together and read
   together, and a panel that flipped between them for a one-line edit would
   cost more than it saves. */
export default function ConceptForm() {
    const { cityOfMistThemeKit, setCityOfMistThemeKit, setExtraTags } =
        useCityOfMistThemeKitStore()

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label htmlFor="theme-kit-introduction">Introduction</Label>
                <Textarea
                    id="theme-kit-introduction"
                    className="min-h-28 text-sm"
                    value={cityOfMistThemeKit.introduction}
                    onChange={(event) =>
                        setCityOfMistThemeKit({
                            introduction: event.target.value,
                        })
                    }
                    placeholder="The paragraph that pitches this theme to the player."
                />
            </div>
            <div className="grid gap-1">
                <Label htmlFor="theme-kit-concept">Concept</Label>
                <Textarea
                    id="theme-kit-concept"
                    className="min-h-16 text-sm"
                    value={cityOfMistThemeKit.concept}
                    onChange={(event) =>
                        setCityOfMistThemeKit({ concept: event.target.value })
                    }
                    placeholder="You are who you are, and that is enough."
                />
            </div>
            <div className="grid gap-1">
                <Label>Extra tags</Label>
                <StringListInput
                    value={cityOfMistThemeKit.extra_tags}
                    onChange={setExtraTags}
                    placeholder="Add tag..."
                />
                <p className="text-xs text-muted-foreground">
                    Tags the themebook hands out directly, without a question to
                    answer.
                </p>
            </div>
            <div className="grid gap-1">
                <Label htmlFor="theme-kit-title-guidance">Title guidance</Label>
                <Textarea
                    id="theme-kit-title-guidance"
                    className="min-h-16 text-sm"
                    value={cityOfMistThemeKit.title_guidance}
                    onChange={(event) =>
                        setCityOfMistThemeKit({
                            title_guidance: event.target.value,
                        })
                    }
                    placeholder="Name the part of yourself this theme is about."
                />
            </div>
            <p className="text-xs text-muted-foreground">
                Supports inline Markdown.
            </p>
        </div>
    )
}
