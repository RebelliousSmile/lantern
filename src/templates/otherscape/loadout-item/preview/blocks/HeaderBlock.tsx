import { ClickableSection } from '../../../shared/preview/components/Clickable'
import { SectionHeader } from '../../../shared/preview/components/SectionHeader'
import {
    useOtherscapeLoadoutItemSheetStore,
    useOtherscapeLoadoutItemStore,
} from '../../hooks'

/* The rubric the catalog files the item under, flush right over the row. An
   item filed under nothing still prints the kicker, as "Loadout". */
export default function HeaderBlock() {
    const { otherscapeLoadoutItem } = useOtherscapeLoadoutItemStore()
    const { openSheet } = useOtherscapeLoadoutItemSheetStore()

    return (
        <>
            <SectionHeader
                title={otherscapeLoadoutItem.category.trim() || 'Loadout'}
                align="end"
                onClick={() => openSheet({ kind: 'basic', mode: 'edit' })}
            />
            {/* The table's column heads, printed only where the row has its
                four columns (see the stylesheet). */}
            <div className="loadout-item-heads" aria-hidden="true">
                <span>Item name</span>
                <span>Description</span>
                <span>Feature tags</span>
                <span>Weakness</span>
            </div>
        </>
    )
}

/* The first cell of the row: the name in the catalog's lime box. A printed
   title, not a tag: the same string is also the first feature tag, and that is
   where it takes braces. Never gated, it is what the row is. */
export function NameCell() {
    const { otherscapeLoadoutItem } = useOtherscapeLoadoutItemStore()
    const { openSheet } = useOtherscapeLoadoutItemSheetStore()

    return (
        <ClickableSection
            onClick={() => openSheet({ kind: 'basic', mode: 'edit' })}
            ariaLabel="Edit the item name"
        >
            <div className="loadout-item-name">
                {otherscapeLoadoutItem.name || 'Untitled Loadout Item'}
            </div>
        </ClickableSection>
    )
}
