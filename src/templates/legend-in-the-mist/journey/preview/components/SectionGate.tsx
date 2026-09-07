import {
    groupShouldShow,
    shouldShow,
    useLegendInTheMistJourneyStore,
    useLegendInTheMistJourneyViewStore,
    type SectionId,
} from '../../hooks'

export function SectionGate({
    id,
    children,
}: {
    id: SectionId
    children: React.ReactNode
}) {
    const { legendInTheMistJourney } = useLegendInTheMistJourneyStore()
    const view = useLegendInTheMistJourneyViewStore()
    if (!shouldShow(legendInTheMistJourney, id, view)) return null
    return <>{children}</>
}

export function SectionGroupGate({
    ids,
    children,
}: {
    ids: SectionId[]
    children: React.ReactNode
}) {
    const { legendInTheMistJourney } = useLegendInTheMistJourneyStore()
    const view = useLegendInTheMistJourneyViewStore()
    if (!groupShouldShow(legendInTheMistJourney, ids, view)) return null
    return <>{children}</>
}
