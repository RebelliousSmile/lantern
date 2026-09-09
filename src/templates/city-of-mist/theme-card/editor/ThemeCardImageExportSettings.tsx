import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useCityOfMistThemeCardViewStore } from '../hooks'

export function ThemeCardImageExportSettings() {
    const { exportPrefs, setExportPrefs } = useCityOfMistThemeCardViewStore()

    return (
        <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Image scale
            </p>
            <RadioGroup
                value={String(exportPrefs.scale)}
                onValueChange={(value) => setExportPrefs({ scale: Number(value) as 1 | 2 | 3 })}
                className="flex items-center gap-3"
            >
                {([1, 2, 3] as const).map((scale) => (
                    <label key={scale} className="flex cursor-pointer items-center gap-1.5">
                        <RadioGroupItem value={String(scale)} id={`theme-card-export-scale-${scale}`} />
                        <span className="text-xs">{scale}x</span>
                    </label>
                ))}
            </RadioGroup>
        </div>
    )
}
