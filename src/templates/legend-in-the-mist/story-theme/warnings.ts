import type { ImportWarning } from '@/core/templates/types'
import type { TranslationKey } from '@/i18n/text'
import { parseToken } from '@/utils/tags'
import type { LegendInTheMistStoryTheme, TagField } from './model'

const TAG_WARNING_KEYS: Record<
    TagField,
    {
        braced: TranslationKey
        marked: TranslationKey
        statusLike: TranslationKey
    }
> = {
    power: {
        braced: 'legend:storyTheme.warnings.power.braced',
        marked: 'legend:storyTheme.warnings.power.marked',
        statusLike: 'legend:storyTheme.warnings.power.statusLike',
    },
    weakness: {
        braced: 'legend:storyTheme.warnings.weakness.braced',
        marked: 'legend:storyTheme.warnings.weakness.marked',
        statusLike: 'legend:storyTheme.warnings.weakness.statusLike',
    },
}

// Tags are stored bare: the field a tag sits in is what makes it a power tag or
// a weakness, so braces and the leading "!" are display syntax that should not
// reach the document. None of this blocks an import; it only flags content that
// will not render the way its author expects.
function collectTagWarnings(
    tags: string[],
    field: TagField,
    warnings: ImportWarning[]
) {
    const keys = TAG_WARNING_KEYS[field]

    const braced = tags.filter((tag) => /^\{[\s\S]*\}$/.test(tag.trim()))
    if (braced.length > 0) {
        warnings.push({
            key: keys.braced,
            values: { tags: braced.join(', ') },
        })
    }

    const marked = tags.filter((tag) =>
        tag.trim().replace(/^\{/, '').startsWith('!')
    )
    if (marked.length > 0) {
        warnings.push({
            key: keys.marked,
            values: { tags: marked.join(', ') },
        })
    }

    const statusLike = tags.filter((tag) => {
        const parsed = parseToken(tag)
        return parsed?.kind === 'status' || parsed?.kind === 'limit'
    })
    if (statusLike.length > 0) {
        warnings.push({
            key: keys.statusLike,
            values: { tags: statusLike.join(', ') },
        })
    }
}

export function computeLegendInTheMistStoryThemeWarnings(
    legendInTheMistStoryTheme: LegendInTheMistStoryTheme
): ImportWarning[] {
    const warnings: ImportWarning[] = []

    collectTagWarnings(legendInTheMistStoryTheme.power_tags, 'power', warnings)
    collectTagWarnings(
        legendInTheMistStoryTheme.weakness_tags,
        'weakness',
        warnings
    )

    if (
        !legendInTheMistStoryTheme.power_tags.length &&
        !legendInTheMistStoryTheme.weakness_tags.length
    ) {
        warnings.push({ key: 'legend:storyTheme.warnings.noTags' })
    }

    return warnings
}
