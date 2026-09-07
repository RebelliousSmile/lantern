import { parseToken } from '@/utils/tags'
import type { LegendInTheMistThemeKit, TagField } from './model'

const FIELD_LABEL: Record<TagField, string> = {
    power: 'Power tags',
    weakness: 'Weakness tags',
}

// Tags are stored bare: the field a tag sits in is what makes it a power tag or
// a weakness, so braces and the leading "!" are display syntax that should not
// reach the document. None of this blocks an import; it only flags content that
// will not render the way its author expects.
function collectTagWarnings(
    tags: string[],
    field: TagField,
    warnings: string[]
) {
    const braced = tags.filter((tag) => /^\{[\s\S]*\}$/.test(tag.trim()))
    if (braced.length > 0) {
        warnings.push(
            `${FIELD_LABEL[field]} written with braces: ${braced.join(', ')}. They are added when the card is rendered, so the braces will show up twice.`
        )
    }

    const marked = tags.filter((tag) =>
        tag.trim().replace(/^\{/, '').startsWith('!')
    )
    if (marked.length > 0) {
        warnings.push(
            `${FIELD_LABEL[field]} written with a leading "!": ${marked.join(', ')}. ${
                field === 'weakness'
                    ? 'Weakness tags are already marked by the field they are in.'
                    : 'A tag that works against the Hero belongs in Weakness tags.'
            }`
        )
    }

    const statusLike = tags.filter((tag) => {
        const parsed = parseToken(tag)
        return parsed?.kind === 'status' || parsed?.kind === 'limit'
    })
    if (statusLike.length > 0) {
        warnings.push(
            `${FIELD_LABEL[field]} that read as a status or a limit: ${statusLike.join(', ')}. A trailing "-<n>" or ":<n>" makes a tag render as a tracker rather than as a tag.`
        )
    }
}

export function computeLegendInTheMistThemeKitWarnings(
    legendInTheMistThemeKit: LegendInTheMistThemeKit
): string[] {
    const warnings: string[] = []

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
        warnings.push(
            'This Theme Kit suggests no tags, so there is nothing for a Hero to pick from.'
        )
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
        warnings.push(
            `Improvements named without an effect: ${namedOnly.join(', ')}. The card prints the label alone, which is right only if the themebook states nothing more.`
        )
    }

    return warnings
}
