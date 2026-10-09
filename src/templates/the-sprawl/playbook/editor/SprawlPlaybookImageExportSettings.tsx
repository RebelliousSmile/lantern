import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useSprawlViewStore } from '../hooks'

export function SprawlPlaybookImageExportSettings() {
    const { exportPrefs, setExportPrefs } = useSprawlViewStore()
    return (
        <RadioGroup
            value={String(exportPrefs.scale)}
            onValueChange={(value) =>
                setExportPrefs({ scale: Number(value) as 1 | 2 | 3 })
            }
        >
            {[1, 2, 3].map((scale) => (
                <label className="mr-3" key={scale}>
                    <RadioGroupItem value={String(scale)} /> {scale}x
                </label>
            ))}
        </RadioGroup>
    )
}
