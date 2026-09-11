import { usePlaybookStore } from '../../hooks'
import { GearEditor } from '../GearEditor'

export default function GearForm() {
    const { playbook, setGear } = usePlaybookStore()

    return <GearEditor value={playbook.gear} onChange={setGear} />
}
