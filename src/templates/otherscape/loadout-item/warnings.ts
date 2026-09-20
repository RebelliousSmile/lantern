import type { ImportWarning } from '@/core/templates/types'
import type { TranslationKey } from '@/i18n/text'
import { parseToken } from '@/utils/tags'
import {
    NAME_TAG_INDEX,
    type OtherscapeLoadoutItem,
    type TagField,
} from './model'

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
    feature: {
        braced: 'otherscape:loadoutItem.warnings.feature.braced',
        marked: 'otherscape:loadoutItem.warnings.feature.marked',
        statusLike: 'otherscape:loadoutItem.warnings.feature.statusLike',
    },
    weakness: {
        braced: 'otherscape:loadoutItem.warnings.weakness.braced',
        marked: 'otherscape:loadoutItem.warnings.weakness.marked',
        statusLike: 'otherscape:loadoutItem.warnings.weakness.statusLike',
    },
}

// Tags are stored bare: the field a tag sits in is what makes it a feature or a
// weakness, so braces and the leading "!" are display syntax that should not
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

export function computeOtherscapeLoadoutItemWarnings(
    otherscapeLoadoutItem: OtherscapeLoadoutItem
): ImportWarning[] {
    const warnings: ImportWarning[] = []

    collectTagWarnings(otherscapeLoadoutItem.feature_tags, 'feature', warnings)
    if (otherscapeLoadoutItem.weakness_tag.trim()) {
        collectTagWarnings(
            [otherscapeLoadoutItem.weakness_tag],
            'weakness',
            warnings
        )
    }

    if (
        !otherscapeLoadoutItem.feature_tags.length &&
        !otherscapeLoadoutItem.weakness_tag.trim()
    ) {
        warnings.push({ key: 'otherscape:loadoutItem.warnings.noTags' })
    }

    // The Street Catalog prints the item's name as its first feature tag. A
    // list that opens on something else still imports, but the card and the
    // catalog then disagree about what the item is called.
    const name = otherscapeLoadoutItem.name.trim()
    const firstTag = otherscapeLoadoutItem.feature_tags[NAME_TAG_INDEX]
    if (name && firstTag != null && firstTag.trim() !== name) {
        warnings.push({
            key: 'otherscape:loadoutItem.warnings.firstTagNotName',
            values: { firstTag, name },
        })
    }

    return warnings
}
