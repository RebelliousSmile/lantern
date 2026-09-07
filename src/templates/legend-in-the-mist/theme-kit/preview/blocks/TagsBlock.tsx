import { renderLitmInline } from '@/utils/markdown'
import { formatPower } from '@/utils/tags'
import {
    useLegendInTheMistThemeKitSheetStore,
    useLegendInTheMistThemeKitStore,
    type TagField,
} from '../../hooks'
import { ClickableInline } from '../components/Clickable'
import { SectionGate } from '../components/SectionGate'

/* The book flows both runs as paragraphs and opens the weakness run with a
   single double chevron, where the token renderer would pin one to every
   weakness tag. So both runs go through the plain tag renderer and the run
   itself carries the chevron and the warmer tint. */
function TagRun({ field }: { field: TagField }) {
    const { legendInTheMistThemeKit } = useLegendInTheMistThemeKitStore()
    const { openSheet } = useLegendInTheMistThemeKitSheetStore()

    const tags =
        field === 'power'
            ? legendInTheMistThemeKit.power_tags
            : legendInTheMistThemeKit.weakness_tags

    if (!tags.length) {
        return (
            <p className={`theme-kit-tags theme-kit-tags--${field}`}>
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
        <p className={`theme-kit-tags theme-kit-tags--${field}`}>
            {field === 'weakness' && (
                <span className="theme-kit-tags__chevron" aria-hidden />
            )}
            {tags.map((tag, index) => (
                <span key={`${field}-${tag}-${index}`}>
                    <ClickableInline
                        onClick={() =>
                            openSheet({
                                kind: 'tags',
                                field,
                                index,
                                mode: 'edit',
                            })
                        }
                        ariaLabel={`Edit ${field} tag ${tag}`}
                    >
                        <span
                            dangerouslySetInnerHTML={{
                                __html: renderLitmInline(formatPower(tag)),
                            }}
                        />
                    </ClickableInline>
                    {index < tags.length - 1 && (
                        <span className="theme-kit-tags__comma">, </span>
                    )}
                </span>
            ))}
        </p>
    )
}

export default function TagsBlock() {
    return (
        <div className="theme-kit-tag-runs">
            <SectionGate id="powerTags">
                <TagRun field="power" />
            </SectionGate>
            <SectionGate id="weaknessTags">
                <TagRun field="weakness" />
            </SectionGate>
        </div>
    )
}
