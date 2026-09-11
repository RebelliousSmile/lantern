import { usePlaybookStore } from '../../hooks'
import { ChoiceSetsEditor } from '../ChoiceSetsEditor'

export default function ChoiceSetsForm() {
    const { playbook, setChoiceSets } = usePlaybookStore()

    return (
        <ChoiceSetsEditor
            value={playbook.choiceSets}
            onChange={setChoiceSets}
        />
    )
}
