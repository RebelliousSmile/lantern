import { renderLitmInline } from '@/utils/markdown'
import { formatPower, formatWeakness } from '@/utils/tags'
import { ClickableInline } from '../../../shared/preview/components/Clickable'
import { SectionGate } from '../../../shared/preview/components/SectionGate'
import {
    shouldShow,
    useOtherscapeThemeSheetStore,
    useOtherscapeThemeStore,
    useOtherscapeThemeViewStore,
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
    const { openSheet } = useOtherscapeThemeSheetStore()

    const formatted =
        field === 'weakness' ? formatWeakness(tag) : formatPower(tag)

    return (
        <li>
            <ClickableInline
                onClick={() =>
                    openSheet({ kind: 'tags', field, index, mode: 'edit' })
                }
                ariaLabel={`Edit ${field} tag ${tag}`}
                className="theme-tag-row os-bar"
            >
                <span
                    dangerouslySetInnerHTML={{
                        __html: renderLitmInline(formatted),
                    }}
                />
                {/* The space a player marks when the tag is burnt. */}
                <span className="theme-tag-row__mark" aria-hidden />
            </ClickableInline>
        </li>
    )
}

function TagRun({ field }: { field: TagField }) {
    const { otherscapeTheme } = useOtherscapeThemeStore()
    const { openSheet } = useOtherscapeThemeSheetStore()

    const tags =
        field === 'power'
            ? otherscapeTheme.power_tags
            : otherscapeTheme.weakness_tags

    if (!tags.length) {
        return (
            <p className={`theme-tags__empty theme-tags--${field}`}>
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
        <ul className={`theme-tags theme-tags--${field}`}>
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
    const { otherscapeTheme } = useOtherscapeThemeStore()
    const view = useOtherscapeThemeViewStore()

    return (
        <div className="theme-tag-runs">
            <SectionGate show={shouldShow(otherscapeTheme, 'powerTags', view)}>
                <TagRun field="power" />
            </SectionGate>
            <SectionGate
                show={shouldShow(otherscapeTheme, 'weaknessTags', view)}
            >
                <TagRun field="weakness" />
            </SectionGate>
        </div>
    )
}
