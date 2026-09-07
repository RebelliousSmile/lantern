import {
    groupShouldShow,
    shouldShow,
    useLegendInTheMistThemeKitStore,
    useLegendInTheMistThemeKitViewStore,
    type SectionId,
} from '../../hooks'

export function SectionGate({
    id,
    children,
}: {
    id: SectionId
    children: React.ReactNode
}) {
    const { legendInTheMistThemeKit } = useLegendInTheMistThemeKitStore()
    const view = useLegendInTheMistThemeKitViewStore()
    if (!shouldShow(legendInTheMistThemeKit, id, view)) return null
    return <>{children}</>
}

export function SectionGroupGate({
    ids,
    children,
}: {
    ids: SectionId[]
    children: React.ReactNode
}) {
    const { legendInTheMistThemeKit } = useLegendInTheMistThemeKitStore()
    const view = useLegendInTheMistThemeKitViewStore()
    if (!groupShouldShow(legendInTheMistThemeKit, ids, view)) return null
    return <>{children}</>
}
