import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useUiText } from '@/i18n/text'
import { useOtherscapeCharacterTropeViewStore } from '../hooks'

export function CharacterTropeImageExportSettings() {
    const text = useUiText()
    const { exportPrefs, setExportPrefs } =
        useOtherscapeCharacterTropeViewStore()

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {text(
                        'otherscape:forms.characterTrope.imageExport.scaleHeading'
                    )}
                </p>
                <RadioGroup
                    value={String(exportPrefs.scale)}
                    onValueChange={(value) =>
                        setExportPrefs({ scale: Number(value) as 1 | 2 | 3 })
                    }
                    className="flex items-center gap-3"
                >
                    <label className="flex cursor-pointer items-center gap-1.5">
                        <RadioGroupItem
                            value="1"
                            id="os-character-trope-export-scale-1"
                        />
                        <span className="text-xs">
                            {text(
                                'otherscape:forms.characterTrope.imageExport.scale1x'
                            )}
                        </span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-1.5">
                        <RadioGroupItem
                            value="2"
                            id="os-character-trope-export-scale-2"
                        />
                        <span className="text-xs">
                            {text(
                                'otherscape:forms.characterTrope.imageExport.scale2x'
                            )}
                        </span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-1.5">
                        <RadioGroupItem
                            value="3"
                            id="os-character-trope-export-scale-3"
                        />
                        <span className="text-xs">
                            {text(
                                'otherscape:forms.characterTrope.imageExport.scale3x'
                            )}
                        </span>
                    </label>
                </RadioGroup>
            </div>
        </div>
    )
}
