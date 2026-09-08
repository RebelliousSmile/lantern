import { ClickableSection } from '../../../shared/preview/components/Clickable'
import {
    useOtherscapeLoadoutItemSheetStore,
    useOtherscapeLoadoutItemStore,
} from '../../hooks'

export default function HeaderBlock() {
    const { otherscapeLoadoutItem } = useOtherscapeLoadoutItemStore()
    const { openSheet } = useOtherscapeLoadoutItemSheetStore()

    const openBasic = () => openSheet({ kind: 'basic', mode: 'edit' })

    /* Neither region is gated: the band and the title are the card's top edge
       rather than sections, so an item filed under no rubric still prints the
       band and the frame stays closed. */
    return (
        <>
            <ClickableSection
                onClick={openBasic}
                ariaLabel="Edit the catalog category"
            >
                <div className="loadout-item-header os-bar">
                    <span className="loadout-item-header__category">
                        {otherscapeLoadoutItem.category || (
                            <span className="os-placeholder">
                                add a category
                            </span>
                        )}
                    </span>
                    {/* The rubric the whole card belongs to. A theme card names
                        which of the four it is here; a catalog entry has only
                        the one kind, so the band says so and stops. */}
                    <span className="loadout-item-header__kind os-label">
                        Loadout
                    </span>
                </div>
            </ClickableSection>

            <ClickableSection
                onClick={openBasic}
                ariaLabel="Edit the item name"
            >
                <div className="loadout-item-title os-bar">
                    {/* A printed title, not a tag: the same string is also the
                        first feature tag, and that is where it takes braces. */}
                    <span className="loadout-item-title__text os-display">
                        {otherscapeLoadoutItem.name || 'Untitled Loadout Item'}
                    </span>
                </div>
            </ClickableSection>
        </>
    )
}
