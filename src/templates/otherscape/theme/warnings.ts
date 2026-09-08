import { parseToken } from '@/utils/tags'
import type { OtherscapeTheme, TagField } from './model'

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
                    : 'A tag that works against the character belongs in Weakness tags.'
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

export function computeOtherscapeThemeWarnings(
    otherscapeTheme: OtherscapeTheme
): string[] {
    const warnings: string[] = []

    collectTagWarnings(otherscapeTheme.power_tags, 'power', warnings)
    collectTagWarnings(otherscapeTheme.weakness_tags, 'weakness', warnings)

    if (
        !otherscapeTheme.power_tags.length &&
        !otherscapeTheme.weakness_tags.length
    ) {
        warnings.push(
            'This Theme carries no tags, so there is nothing to invoke it with.'
        )
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
        warnings.push(
            `The title tag is repeated in Power tags: ${otherscapeTheme.title_tag}. The card already prints it as the title, so it would appear twice.`
        )
    }

    return warnings
}
