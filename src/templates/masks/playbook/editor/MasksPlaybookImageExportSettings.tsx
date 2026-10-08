import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useMasksViewStore } from '../hooks'

export function MasksPlaybookImageExportSettings() {
    const { exportPrefs, setExportPrefs } = useMasksViewStore()
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
