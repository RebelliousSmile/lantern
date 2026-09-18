import type { ImportWarning } from '@/core/templates/types'
import type { TranslationKey } from '@/i18n/text'
import { parseToken } from '@/utils/tags'
import type { OtherscapeTheme, TagField } from './model'

/* One sentence per field and per problem: the field name is part of the
   sentence, so it cannot be interpolated without breaking French agreement. */
const TAG_WARNING_KEYS: Record<
    TagField,
    {
        braced: TranslationKey
        marked: TranslationKey
        statusLike: TranslationKey
    }
> = {
    power: {
        braced: 'otherscape:warnings.power.braced',
        marked: 'otherscape:warnings.power.marked',
        statusLike: 'otherscape:warnings.power.statusLike',
    },
    weakness: {
        braced: 'otherscape:warnings.weakness.braced',
        marked: 'otherscape:warnings.weakness.marked',
        statusLike: 'otherscape:warnings.weakness.statusLike',
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
        warnings.push({ key: keys.braced, values: { tags: braced.join(', ') } })
    }

    const marked = tags.filter((tag) =>
        tag.trim().replace(/^\{/, '').startsWith('!')
    )
    if (marked.length > 0) {
        warnings.push({ key: keys.marked, values: { tags: marked.join(', ') } })
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

export function computeOtherscapeThemeWarnings(
    otherscapeTheme: OtherscapeTheme
): ImportWarning[] {
    const warnings: ImportWarning[] = []

    collectTagWarnings(otherscapeTheme.power_tags, 'power', warnings)
    collectTagWarnings(otherscapeTheme.weakness_tags, 'weakness', warnings)

    if (
        !otherscapeTheme.power_tags.length &&
        !otherscapeTheme.weakness_tags.length
    ) {
        warnings.push({ key: 'otherscape:theme.warnings.noTags' })
    }

    // The printed card is a header followed by the title tag alone on its
    // line, so a title repeated in the tag list prints twice on the same card.
    const title = otherscapeTheme.title_tag.trim().toLowerCase()
    if (
        title &&
        otherscapeTheme.power_tags.some(
            (tag) => tag.trim().toLowerCase() === title
        )
    ) {
        warnings.push({
            key: 'otherscape:warnings.titleRepeated',
            values: { title: otherscapeTheme.title_tag },
        })
    }

    return warnings
}
