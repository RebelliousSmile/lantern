import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUiText } from '@/i18n/text'
import { useCityOfMistThemeCardStore } from '../../hooks'

function TrackInput({
    id,
    label,
    filled,
    maximum,
    onChange,
}: {
    id: string
    label: string
    filled: number
    maximum: number
    onChange: (value: number) => void
}) {
    return (
        <div className="grid gap-1">
            <div className="flex items-center justify-between gap-2">
                <Label htmlFor={id}>{label}</Label>
                <span className="text-xs text-muted-foreground">
                    / {maximum}
                </span>
            </div>
            <Input
                id={id}
                className="h-8 px-2 text-sm"
                type="number"
                min={0}
                max={maximum}
                value={filled}
                onChange={(event) => onChange(Number(event.target.value))}
            />
        </div>
    )
}

export default function TracksForm() {
    const text = useUiText()
    const { cityOfMistThemeCard, setTrack } = useCityOfMistThemeCardStore()
    const attention = cityOfMistThemeCard.attention
    const erosion = cityOfMistThemeCard.erosion
    const erosionLabel =
        cityOfMistThemeCard.theme_type === 'mythos'
            ? text('city:forms.shared.track.fade')
            : text('city:forms.shared.track.crack')

    return (
        <div className="space-y-4">
            {attention ? (
                <TrackInput
                    id="theme-card-attention"
                    label={text('city:forms.shared.track.attention')}
                    filled={attention.filled}
                    maximum={attention.maximum}
                    onChange={(value) => setTrack('attention', value)}
                />
            ) : null}
            {(cityOfMistThemeCard.theme_type === 'mythos' ||
                cityOfMistThemeCard.theme_type === 'logos') &&
            erosion ? (
                <TrackInput
                    id="theme-card-erosion"
                    label={erosionLabel}
                    filled={erosion.filled}
                    maximum={erosion.maximum}
                    onChange={(value) => setTrack('erosion', value)}
                />
            ) : null}
            <p className="text-xs text-muted-foreground">
                {text('city:forms.themeCard.tracks.help')}
            </p>
        </div>
    )
}
