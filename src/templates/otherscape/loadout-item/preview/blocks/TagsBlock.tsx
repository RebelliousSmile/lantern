import type { ReactNode } from 'react'
import { bareTag } from '../../../shared/preview/bareTag'
import { ClickableInline } from '../../../shared/preview/components/Clickable'
import { SectionGate } from '../../../shared/preview/components/SectionGate'
import {
    shouldShow,
    useOtherscapeLoadoutItemSheetStore,
    useOtherscapeLoadoutItemStore,
    useOtherscapeLoadoutItemViewStore,
    type TagField,
} from '../../hooks'
import { NAME_TAG_INDEX, featureTagsAfterName } from '../../model'

/* A clickable run of words that wraps like the text around it. A `<button>`
   is an atomic box and cannot break across lines, so a long tag would stand
   as a block in the column where the book lets it flow; this span takes the
   button's role, focus and keys instead. */
function InlineTag({
    onClick,
    ariaLabel,
    className,
    children,
}: {
    onClick: () => void
    ariaLabel: string
    className: string
    children: ReactNode
}) {
    return (
        <span
            role="button"
            tabIndex={0}
            aria-label={ariaLabel}
            className={`cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${className}`}
            onClick={onClick}
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    onClick()
                }
            }}
        >
            {children}
        </span>
    )
}

function EmptyCell({ field, label }: { field: TagField; label: string }) {
    const { openSheet } = useOtherscapeLoadoutItemSheetStore()

    return (
        <button
            type="button"
            className="text-xs underline decoration-dotted opacity-80 hover:opacity-100 cursor-pointer"
            onClick={() => openSheet({ kind: 'tags', field, mode: 'create' })}
        >
            {label}
        </button>
    )
}

/* The feature tags as the catalog sets them: italic words on a highlight, run
   one after the other in their own column, the name tag first and in bold. */
function FeatureCell() {
    const { otherscapeLoadoutItem } = useOtherscapeLoadoutItemStore()
    const { openSheet } = useOtherscapeLoadoutItemSheetStore()

    /* The first feature tag is the item's name as a tag: the book prints it
       again here, in bold, ahead of the others. It is edited with the name, so
       it opens the basic form. The index handed to the tags form is the one
       the document uses, not the one in the slice after the name: the form
       edits `feature_tags`, and an offset index would edit the wrong tag. */
    const nameTag = bareTag(
        otherscapeLoadoutItem.feature_tags[NAME_TAG_INDEX] ?? ''
    ).trim()
    const tags = featureTagsAfterName(otherscapeLoadoutItem)

    return (
        <div className="loadout-item-cell loadout-item-cell--feature">
            {/* Each comma is held to the tag before it, so a line never
                starts with one. */}
            {nameTag && (
                <>
                    <span className="loadout-item-tag">
                        <InlineTag
                            onClick={() =>
                                openSheet({ kind: 'basic', mode: 'edit' })
                            }
                            ariaLabel={`Edit the name tag ${nameTag}`}
                            className="loadout-item-feature loadout-item-feature--name"
                        >
                            {nameTag}
                        </InlineTag>
                        {tags.length > 0 && ','}
                    </span>{' '}
                </>
            )}
            {tags.length ? (
                tags.map((tag, offset) => {
                    const index = NAME_TAG_INDEX + 1 + offset
                    const label = bareTag(tag)
                    return (
                        <span key={`feature-${tag}-${index}`}>
                            <span className="loadout-item-tag">
                                <InlineTag
                                    onClick={() =>
                                        openSheet({
                                            kind: 'tags',
                                            field: 'feature',
                                            index,
                                            mode: 'edit',
                                        })
                                    }
                                    ariaLabel={`Edit feature tag ${label}`}
                                    className="loadout-item-feature"
                                >
                                    {label}
                                </InlineTag>
                                {offset < tags.length - 1 && ','}
                            </span>{' '}
                        </span>
                    )
                })
            ) : (
                <EmptyCell field="feature" label="add feature tags" />
            )}
        </div>
    )
}

/* The one weakness in the grey box, pointed on its left, the catalog closes
   the row with. */
function WeaknessCell() {
    const { otherscapeLoadoutItem } = useOtherscapeLoadoutItemStore()
    const { openSheet } = useOtherscapeLoadoutItemSheetStore()

    // One slot rather than a list, so there is no index to carry.
    const tag = otherscapeLoadoutItem.weakness_tag

    return (
        <div className="loadout-item-cell loadout-item-cell--weakness">
            {tag.trim() ? (
                <ClickableInline
                    onClick={() =>
                        openSheet({
                            kind: 'tags',
                            field: 'weakness',
                            mode: 'edit',
                        })
                    }
                    ariaLabel={`Edit weakness tag ${bareTag(tag)}`}
                    className="loadout-item-weakness"
                >
                    <span className="loadout-item-weakness__text">
                        {bareTag(tag)}
                    </span>
                </ClickableInline>
            ) : (
                <EmptyCell field="weakness" label="add a weakness tag" />
            )}
        </div>
    )
}

export default function TagsBlock() {
    const { otherscapeLoadoutItem } = useOtherscapeLoadoutItemStore()
    const view = useOtherscapeLoadoutItemViewStore()

    return (
        <>
            <SectionGate
                show={shouldShow(otherscapeLoadoutItem, 'featureTags', view)}
            >
                <FeatureCell />
            </SectionGate>
            <SectionGate
                show={shouldShow(otherscapeLoadoutItem, 'weaknessTag', view)}
            >
                <WeaknessCell />
            </SectionGate>
        </>
    )
}
