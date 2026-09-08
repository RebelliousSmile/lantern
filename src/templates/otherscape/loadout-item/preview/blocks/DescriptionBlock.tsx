import { renderLitmMarkdown } from '@/utils/markdown'
import { ClickableSection } from '../../../shared/preview/components/Clickable'
import {
    useOtherscapeLoadoutItemSheetStore,
    useOtherscapeLoadoutItemStore,
} from '../../hooks'

export default function DescriptionBlock() {
    const { otherscapeLoadoutItem } = useOtherscapeLoadoutItemStore()
    const { openSheet } = useOtherscapeLoadoutItemSheetStore()

    /* The prose is edited in the basic form beside the name and the category:
       the three are what the catalog prints above the tags, and splitting them
       across two sheets would make a one-line item a two-panel edit. */
    return (
        <ClickableSection
            onClick={() => openSheet({ kind: 'basic', mode: 'edit' })}
            ariaLabel="Edit the description"
        >
            <div className="loadout-item-description">
                {otherscapeLoadoutItem.description ? (
                    <div
                        className="loadout-item-description__text"
                        dangerouslySetInnerHTML={{
                            __html: renderLitmMarkdown(
                                otherscapeLoadoutItem.description
                            ),
                        }}
                    />
                ) : (
                    <span className="text-xs underline decoration-dotted cursor-pointer">
                        add what this item is
                    </span>
                )}
            </div>
        </ClickableSection>
    )
}
