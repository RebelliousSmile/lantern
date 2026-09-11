import { StringListEditor } from '../../../shared/StringListEditor'
import { usePlaybookStore } from '../../hooks'

export default function AdvancementForm() {
    const { playbook, setAdvancement } = usePlaybookStore()

    return (
        <StringListEditor
            value={playbook.advancement}
            onChange={setAdvancement}
            placeholder="Add advancement and press Enter"
        />
    )
}
