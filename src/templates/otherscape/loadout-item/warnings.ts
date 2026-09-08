import { parseToken } from '@/utils/tags'
import {
    NAME_TAG_INDEX,
    type OtherscapeLoadoutItem,
    type TagField,
} from './model'

const FIELD_LABEL: Record<TagField, string> = {
    feature: 'Feature tags',
    weakness: 'Weakness tag',
}

// Tags are stored bare: the field a tag sits in is what makes it a feature or a
// weakness, so braces and the leading "!" are display syntax that should not
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
                    ? 'The weakness tag is already marked by the field it is in.'
                    : 'A tag that works against its bearer belongs in the weakness tag.'
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

export function computeOtherscapeLoadoutItemWarnings(
    otherscapeLoadoutItem: OtherscapeLoadoutItem
): string[] {
    const warnings: string[] = []

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
        warnings.push(
            'This Loadout Item grants no tags, so there is nothing to invoke it with.'
        )
    }

    // The Street Catalog prints the item's name as its first feature tag. A
    // list that opens on something else still imports, but the card and the
    // catalog then disagree about what the item is called.
    const name = otherscapeLoadoutItem.name.trim()
    const firstTag = otherscapeLoadoutItem.feature_tags[NAME_TAG_INDEX]
    if (name && firstTag != null && firstTag.trim() !== name) {
        warnings.push(
            `The first feature tag is "${firstTag}" rather than the item's name, "${name}". The Street Catalog opens the list with the name, and the card prints the rest of the list under it.`
        )
    }

    return warnings
}
