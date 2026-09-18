import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { usePlaybookStore } from '../../hooks'

export default function AdvancementForm() {
    const { playbook, setAdvancement } = usePlaybookStore()

    return (
        <div className="space-y-2">
            {playbook.advancement.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                    <Checkbox checked={entry.checked === true} onCheckedChange={(checked) =>
                        setAdvancement(playbook.advancement.map((current, i) =>
                            i === index ? { ...current, ...(checked === true ? { checked: true } : {}) } : current
                        ))
                    } />
                    <Input value={entry.label} onChange={(event) =>
                        setAdvancement(playbook.advancement.map((current, i) =>
                            i === index ? { ...current, label: event.target.value } : current
                        ))
                    } />
                </div>
            ))}
        </div>
    )
}
