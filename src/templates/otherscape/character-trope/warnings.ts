import type { OtherscapeCharacterTrope } from './model'

/* A Character Trope carries no tokens and no numbers, so nothing here can be
   malformed the way a numbered track can. What can go wrong is what the trope
   says about the character: a package that hands out nothing, and a choice
   list holding a single option, which is not a choice. */
export function computeOtherscapeCharacterTropeWarnings(
    otherscapeCharacterTrope: OtherscapeCharacterTrope
): string[] {
    const warnings: string[] = []

    if (
        !otherscapeCharacterTrope.theme_kits.length &&
        !otherscapeCharacterTrope.choices.length
    ) {
        warnings.push(
            'This Character Trope grants no theme kit and offers none to pick, so it hands a player nothing to build on.'
        )
    }

    if (otherscapeCharacterTrope.choices.length === 1) {
        warnings.push(
            'Only one entry sits under Choices, so there is nothing to choose between. Move it to the granted theme kits, or add the options it is meant to compete with.'
        )
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
        warnings.push(
            `Some theme kits are both granted and offered as a choice: ${both.join(', ')}.`
        )
    }

    return warnings
}
