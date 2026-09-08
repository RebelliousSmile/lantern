import { renderLitmInline } from '@/utils/markdown'
import { formatPower, formatWeakness } from '@/utils/tags'
import { ClickableInline } from '../../../shared/preview/components/Clickable'
import { SectionGate } from '../../../shared/preview/components/SectionGate'
import {
    shouldShow,
    useOtherscapeThemeKitSheetStore,
    useOtherscapeThemeKitStore,
    useOtherscapeThemeKitViewStore,
    type TagField,
} from '../../hooks'

/* The card stacks its tags one per row rather than flowing them as a paragraph,
   so a weakness carries its own marker: the column is not a run, it is a list of
   single tags, and there is nothing for one shared marker to open. Phases 2 and
   3 print the same stack and hold the same choice. */
function TagRow({
    field,
    tag,
    index,
}: {
    field: TagField
    tag: string
    index: number
}) {
    const { openSheet } = useOtherscapeThemeKitSheetStore()

    const formatted =
        field === 'weakness' ? formatWeakness(tag) : formatPower(tag)

    return (
        <li>
            <ClickableInline
                onClick={() =>
                    openSheet({ kind: 'tags', field, index, mode: 'edit' })
                }
                ariaLabel={`Edit ${field} tag ${tag}`}
                className="theme-kit-tag-row os-bar"
            >
                <span
                    dangerouslySetInnerHTML={{
                        __html: renderLitmInline(formatted),
                    }}
                />
                {/* The space a player marks when the tag is burnt. */}
                <span className="theme-kit-tag-row__mark" aria-hidden />
            </ClickableInline>
        </li>
    )
}

function TagRun({ field }: { field: TagField }) {
    const { otherscapeThemeKit } = useOtherscapeThemeKitStore()
    const { openSheet } = useOtherscapeThemeKitSheetStore()

    const tags =
        field === 'power'
            ? otherscapeThemeKit.power_tags
            : otherscapeThemeKit.weakness_tags

    if (!tags.length) {
        return (
            <p className={`theme-kit-tags__empty theme-kit-tags--${field}`}>
                <button
                    type="button"
                    className="text-xs underline decoration-dotted opacity-80 hover:opacity-100 cursor-pointer"
                    onClick={() =>
                        openSheet({ kind: 'tags', field, mode: 'create' })
                    }
                >
                    add {field} tags
                </button>
            </p>
        )
    }

    return (
        <ul className={`theme-kit-tags theme-kit-tags--${field}`}>
            {tags.map((tag, index) => (
                <TagRow
                    key={`${field}-${tag}-${index}`}
                    field={field}
                    tag={tag}
                    index={index}
                />
            ))}
        </ul>
    )
}

export default function TagsBlock() {
    const { otherscapeThemeKit } = useOtherscapeThemeKitStore()
    const view = useOtherscapeThemeKitViewStore()

    return (
        <div className="theme-kit-tag-runs">
            <SectionGate
                show={shouldShow(otherscapeThemeKit, 'powerTags', view)}
            >
                <TagRun field="power" />
            </SectionGate>
            <SectionGate
                show={shouldShow(otherscapeThemeKit, 'weaknessTags', view)}
            >
                <TagRun field="weakness" />
            </SectionGate>
        </div>
    )
}
