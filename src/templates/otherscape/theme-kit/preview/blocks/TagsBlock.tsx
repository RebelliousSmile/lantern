import { useUiText } from '@/i18n/text'
import { bareTag } from '../../../shared/preview/bareTag'
import { ClickableInline } from '../../../shared/preview/components/Clickable'
import { SectionGate } from '../../../shared/preview/components/SectionGate'
import {
    shouldShow,
    useOtherscapeThemeKitSheetStore,
    useOtherscapeThemeKitStore,
    useOtherscapeThemeKitViewStore,
    type TagField,
} from '../../hooks'

/* A small slanted pill, flowing with the others like words on a line, the way
   the book prints the run. Power pills are dark with the type's stripe, the
   weakness pills olive. */
function TagPill({
    field,
    tag,
    index,
}: {
    field: TagField
    tag: string
    index: number
}) {
    const { openSheet } = useOtherscapeThemeKitSheetStore()
    const label = bareTag(tag)

    return (
        <li>
            <ClickableInline
                onClick={() =>
                    openSheet({ kind: 'tags', field, index, mode: 'edit' })
                }
                ariaLabel={`Edit ${field} tag ${label}`}
                className={`theme-kit-pill theme-kit-pill--${field}`}
            >
                <span className="theme-kit-pill__text">{label}</span>
            </ClickableInline>
        </li>
    )
}

function TagRun({ field }: { field: TagField }) {
    const text = useUiText()
    const { otherscapeThemeKit } = useOtherscapeThemeKitStore()
    const { openSheet } = useOtherscapeThemeKitSheetStore()

    const tags =
        field === 'power'
            ? otherscapeThemeKit.power_tags
            : otherscapeThemeKit.weakness_tags

    return (
        <div className={`theme-kit-run theme-kit-run--${field}`}>
            <span className="os-rule-label">
                {text(
                    field === 'power'
                        ? 'otherscape:themeKit.sections.powerTags'
                        : 'otherscape:themeKit.sections.weaknessTags'
                )}
            </span>

            {/* The book repeats the kit's name on a large banner at the head of
                the power tags: it is the title tag, the first power. */}
            {field === 'power' && (
                <ClickableInline
                    onClick={() => openSheet({ kind: 'basic', mode: 'edit' })}
                    ariaLabel="Edit the title tag"
                    className="theme-kit-banner"
                >
                    <span className="theme-kit-banner__text">
                        {otherscapeThemeKit.title_tag || 'Untitled Theme Kit'}
                    </span>
                </ClickableInline>
            )}

            {tags.length ? (
                <ul className="theme-kit-pills">
                    {tags.map((tag, index) => (
                        <TagPill
                            key={`${field}-${tag}-${index}`}
                            field={field}
                            tag={tag}
                            index={index}
                        />
                    ))}
                </ul>
            ) : (
                <p className="theme-kit-tags__empty">
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
            )}
        </div>
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
