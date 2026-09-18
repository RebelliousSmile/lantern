import ThreatsEditor from '../../../shared/ThreatsEditor'
import { useOtherscapeChallengeStore } from '../../hooks'

export default function ThreatsForm({ focusIndex }: { focusIndex?: number }) {
    return <ThreatsEditor focusIndex={focusIndex} noun="Challenge" store={useOtherscapeChallengeStore()} />
}
