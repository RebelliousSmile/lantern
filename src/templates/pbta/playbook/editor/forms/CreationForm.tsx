import { usePlaybookStore } from '../../hooks'
import { CreationEntriesEditor } from '../CreationEntriesEditor'

export default function CreationForm() {
    const { playbook, setCreation } = usePlaybookStore()

    return (
        <CreationEntriesEditor
            value={playbook.creation}
            onChange={setCreation}
        />
    )
}
