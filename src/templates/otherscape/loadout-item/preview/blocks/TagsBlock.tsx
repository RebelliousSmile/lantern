import { renderLitmInline } from '@/utils/markdown'
import { formatPower, formatWeakness } from '@/utils/tags'
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

/* The card stacks its tags one per row rather than flowing them as a paragraph,
   so a weakness carries its own marker: the column is not a run, it is a list of
   single tags, and there is nothing for one shared marker to open. */
function TagRow({
    field,
    tag,
    onEdit,
}: {
    field: TagField
    tag: string
    onEdit: () => void
}) {
    const formatted =
        field === 'weakness' ? formatWeakness(tag) : formatPower(tag)

    return (
        <li>
            <ClickableInline
                onClick={onEdit}
                ariaLabel={`Edit ${field} tag ${tag}`}
                className="loadout-item-tag-row os-bar"
            >
                <span
                    dangerouslySetInnerHTML={{
                        __html: renderLitmInline(formatted),
                    }}
                />
                {/* The space a player marks when the tag is burnt. */}
                <span className="loadout-item-tag-row__mark" aria-hidden />
            </ClickableInline>
        </li>
    )
}

function EmptyRun({ field, label }: { field: TagField; label: string }) {
    const { openSheet } = useOtherscapeLoadoutItemSheetStore()

    return (
        <p className={`loadout-item-tags__empty loadout-item-tags--${field}`}>
            <button
                type="button"
                className="text-xs underline decoration-dotted opacity-80 hover:opacity-100 cursor-pointer"
                onClick={() =>
                    openSheet({ kind: 'tags', field, mode: 'create' })
                }
            >
                {label}
            </button>
        </p>
    )
}

function FeatureRun() {
    const { otherscapeLoadoutItem } = useOtherscapeLoadoutItemStore()
    const { openSheet } = useOtherscapeLoadoutItemSheetStore()

    /* The first feature tag is the item's name, which the title bar above has
       already printed, so the band starts after it. The index handed to the
       form is the one the document uses, not the one in this slice: the form
       edits `feature_tags`, and an offset index would edit the wrong tag. */
    const tags = featureTagsAfterName(otherscapeLoadoutItem)

    if (!tags.length) {
        return <EmptyRun field="feature" label="add feature tags" />
    }

    return (
        <ul className="loadout-item-tags loadout-item-tags--feature">
            {tags.map((tag, offset) => {
                const index = NAME_TAG_INDEX + 1 + offset
                return (
                    <TagRow
                        key={`feature-${tag}-${index}`}
                        field="feature"
                        tag={tag}
                        onEdit={() =>
                            openSheet({
                                kind: 'tags',
                                field: 'feature',
                                index,
                                mode: 'edit',
                            })
                        }
                    />
                )
            })}
        </ul>
    )
}

function WeaknessRow() {
    const { otherscapeLoadoutItem } = useOtherscapeLoadoutItemStore()
    const { openSheet } = useOtherscapeLoadoutItemSheetStore()

    // One slot rather than a list, so there is no index to carry.
    const tag = otherscapeLoadoutItem.weakness_tag

    if (!tag.trim()) {
        return <EmptyRun field="weakness" label="add a weakness tag" />
    }

    return (
        <ul className="loadout-item-tags loadout-item-tags--weakness">
            <TagRow
                field="weakness"
                tag={tag}
                onEdit={() =>
                    openSheet({
                        kind: 'tags',
                        field: 'weakness',
                        mode: 'edit',
                    })
                }
            />
        </ul>
    )
}

export default function TagsBlock() {
    const { otherscapeLoadoutItem } = useOtherscapeLoadoutItemStore()
    const view = useOtherscapeLoadoutItemViewStore()

    return (
        <div className="loadout-item-tag-runs">
            <SectionGate
                show={shouldShow(otherscapeLoadoutItem, 'featureTags', view)}
            >
                <FeatureRun />
            </SectionGate>
            <SectionGate
                show={shouldShow(otherscapeLoadoutItem, 'weaknessTag', view)}
            >
                <WeaknessRow />
            </SectionGate>
        </div>
    )
}
