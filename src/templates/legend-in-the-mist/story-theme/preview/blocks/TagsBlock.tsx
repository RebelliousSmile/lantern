import { renderLitmInline } from '@/utils/markdown'
import { formatPower, formatWeakness } from '@/utils/tags'
import {
    useLegendInTheMistStoryThemeSheetStore,
    useLegendInTheMistStoryThemeStore,
    type TagField,
} from '../../hooks'
import { ClickableSection } from '../components/Clickable'
import { SectionGate } from '../components/SectionGate'

/* Tags are stored bare, so the braces the inline renderer expects are added
   here: the field a tag sits in is what decides which kind it becomes. */
const FORMAT: Record<TagField, (name: string) => string> = {
    power: formatPower,
    weakness: formatWeakness,
}

function TagItems({ field }: { field: TagField }) {
    const { legendInTheMistStoryTheme } = useLegendInTheMistStoryThemeStore()
    const { openSheet } = useLegendInTheMistStoryThemeSheetStore()

    const tags =
        field === 'power'
            ? legendInTheMistStoryTheme.power_tags
            : legendInTheMistStoryTheme.weakness_tags

    if (!tags.length) {
        return (
            <li>
                <button
                    type="button"
                    className="text-xs underline decoration-dotted opacity-80 hover:opacity-100 cursor-pointer"
                    onClick={() =>
                        openSheet({ kind: 'tags', field, mode: 'create' })
                    }
                >
                    add {field} tags
                </button>
            </li>
        )
    }

    return (
        <>
            {tags.map((tag, index) => (
                <li key={`${field}-${tag}-${index}`}>
                    <ClickableSection
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
                                __html: renderLitmInline(FORMAT[field](tag)),
                            }}
                        />
                    </ClickableSection>
                </li>
            ))}
        </>
    )
}

export default function TagsBlock() {
    return (
        <ul className="story-theme-tags">
            <SectionGate id="powerTags">
                <TagItems field="power" />
            </SectionGate>
            <SectionGate id="weaknessTags">
                <TagItems field="weakness" />
            </SectionGate>
        </ul>
    )
}
