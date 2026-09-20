import type { ImportWarning } from '@/core/templates/types'
import type { TranslationKey } from '@/i18n/text'
import { parseToken } from '@/utils/tags'
import type { LegendInTheMistThemeKit, TagField } from './model'

const TAG_WARNING_KEYS: Record<
    TagField,
    {
        braced: TranslationKey
        marked: TranslationKey
        statusLike: TranslationKey
    }
> = {
    power: {
        braced: 'legend:themeKit.warnings.power.braced',
        marked: 'legend:themeKit.warnings.power.marked',
        statusLike: 'legend:themeKit.warnings.power.statusLike',
    },
    weakness: {
        braced: 'legend:themeKit.warnings.weakness.braced',
        marked: 'legend:themeKit.warnings.weakness.marked',
        statusLike: 'legend:themeKit.warnings.weakness.statusLike',
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

export function computeLegendInTheMistThemeKitWarnings(
    legendInTheMistThemeKit: LegendInTheMistThemeKit
): ImportWarning[] {
    const warnings: ImportWarning[] = []

    collectTagWarnings(legendInTheMistThemeKit.power_tags, 'power', warnings)
    collectTagWarnings(
        legendInTheMistThemeKit.weakness_tags,
        'weakness',
        warnings
    )

    if (
        !legendInTheMistThemeKit.power_tags.length &&
        !legendInTheMistThemeKit.weakness_tags.length
    ) {
        warnings.push({ key: 'legend:themeKit.warnings.noTags' })
    }

    // An improvement is a choice offered to a Hero. A label with no effect is
    // valid, since some themebooks print only the label, but it is worth
    // naming: more often it means the effect was not carried across.
    const namedOnly = legendInTheMistThemeKit.improvements
        .filter(
            (improvement) => !improvement.effect || !improvement.effect.trim()
        )
        .map((improvement) => improvement.name)
    if (namedOnly.length > 0) {
        warnings.push({
            key: 'legend:themeKit.warnings.improvementsWithoutEffect',
            values: { improvements: namedOnly.join(', ') },
        })
    }

    return warnings
}
