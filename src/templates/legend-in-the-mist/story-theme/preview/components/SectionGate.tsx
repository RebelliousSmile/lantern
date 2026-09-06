import {
    groupShouldShow,
    shouldShow,
    useLegendInTheMistStoryThemeStore,
    useLegendInTheMistStoryThemeViewStore,
    type SectionId,
} from '../../hooks'

export function SectionGate({
    id,
    children,
}: {
    id: SectionId
    children: React.ReactNode
}) {
    const { legendInTheMistStoryTheme } = useLegendInTheMistStoryThemeStore()
    const view = useLegendInTheMistStoryThemeViewStore()
    if (!shouldShow(legendInTheMistStoryTheme, id, view)) return null
    return <>{children}</>
}

export function SectionGroupGate({
    ids,
    children,
}: {
    ids: SectionId[]
    children: React.ReactNode
}) {
    const { legendInTheMistStoryTheme } = useLegendInTheMistStoryThemeStore()
    const view = useLegendInTheMistStoryThemeViewStore()
    if (!groupShouldShow(legendInTheMistStoryTheme, ids, view)) return null
    return <>{children}</>
}
