import type { ImportWarning } from '@/core/templates/types'
import type { OtherscapeCharacterTrope } from './model'

/* A Character Trope carries no tokens and no numbers, so nothing here can be
   malformed the way a numbered track can. What can go wrong is what the trope
   says about the character: a package that hands out nothing, and a choice
   list holding a single option, which is not a choice. */
export function computeOtherscapeCharacterTropeWarnings(
    otherscapeCharacterTrope: OtherscapeCharacterTrope
): ImportWarning[] {
    const warnings: ImportWarning[] = []

    if (
        !otherscapeCharacterTrope.theme_kits.length &&
        !otherscapeCharacterTrope.choices.length
    ) {
        warnings.push({
            key: 'otherscape:characterTrope.warnings.grantsNothing',
        })
    }

    if (otherscapeCharacterTrope.choices.length === 1) {
        warnings.push({
            key: 'otherscape:characterTrope.warnings.singleChoice',
        })
    }

    // The two lists are read together: a kit named on both sides is granted and
    // offered at once, which reads as a mistake on the page.
    const granted = new Set(
        otherscapeCharacterTrope.theme_kits.map((kit) =>
            kit.title_tag.trim().toLowerCase()
        )
    )
    const both = otherscapeCharacterTrope.choices
        .map((choice) => choice.title_tag)
        .filter((titleTag) => granted.has(titleTag.trim().toLowerCase()))

    if (both.length > 0) {
        warnings.push({
            key: 'otherscape:characterTrope.warnings.grantedAndOffered',
            values: { kits: both.join(', ') },
        })
    }

    return warnings
}
