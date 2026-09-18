import ThreatsEditor, { type ThreatEditorStore } from '../../../shared/ThreatsEditor'
import { useOtherscapePowerSetStore } from '../../hooks'

export default function ThreatsForm({ focusIndex }: { focusIndex?: number }) {
    const store = useOtherscapePowerSetStore()
    const adapter: ThreatEditorStore = {
        ...store,
        otherscapeChallenge: store.otherscapePowerSet,
    }
    return <ThreatsEditor focusIndex={focusIndex} noun="Power Set" store={adapter} />
}
