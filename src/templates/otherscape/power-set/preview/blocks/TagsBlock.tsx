import { renderLitmInline } from '@/utils/markdown'
import { ClickableSection } from '../../../shared/preview/components/Clickable'
import { SectionHeader } from '../../../shared/preview/components/SectionHeader'
import {
    useOtherscapePowerSetSheetStore,
    useOtherscapePowerSetStore,
} from '../../hooks'

/* What the Power Set adds to the Challenge it is grafted onto, read as one run
   the way a Challenge prints its own tags and statuses. */
export default function TagsBlock() {
    const { otherscapePowerSet } = useOtherscapePowerSetStore()
    const { openSheet } = useOtherscapePowerSetSheetStore()

    const openTags = () => openSheet({ kind: 'tags', mode: 'edit' })
    const tags = otherscapePowerSet.tags_and_statuses

    return (
        <div className="power-set-tags">
            <SectionHeader
                title="Tags & Statuses"
                align="end"
                onClick={openTags}
            />

            <ClickableSection
                onClick={openTags}
                ariaLabel="Edit the tags and statuses"
            >
                {tags.length ? (
                    <ul className="power-set-tags__list">
                        {tags.map((tag, index) => (
                            <li
                                key={`power-set-tag-${index}-${tag}`}
                                className="power-set-tags__item"
                                /* Stored with their own braces, so they go to
                                   the renderer as written. */
                                dangerouslySetInnerHTML={{
                                    __html: renderLitmInline(tag),
                                }}
                            />
                        ))}
                    </ul>
                ) : (
                    <span className="os-placeholder">
                        add tags and statuses
                    </span>
                )}
            </ClickableSection>
        </div>
    )
}
