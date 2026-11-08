import type { ImportWarning } from '@/core/templates/types'
import { computeOtherscapeThemeWarnings } from '../theme/warnings'
import { isCompleteCombo, type OtherscapeCharacter } from './model'

/* A character's themes are the theme document itself, so what the theme warns
   about (tags written with braces, a title repeated among the power tags, a theme
   with no tags) is what the sheet warns about. The same sentence raised by two
   themes is said once: it names the tags, not the theme, so a second copy would
   add nothing. */
export function computeOtherscapeCharacterWarnings(
    otherscapeCharacter: OtherscapeCharacter
): ImportWarning[] {
    const warnings: ImportWarning[] = []
    const seen = new Set<string>()

    for (const theme of otherscapeCharacter.themes) {
        for (const warning of computeOtherscapeThemeWarnings(theme)) {
            const signature = JSON.stringify([warning.key, warning.values])
            if (seen.has(signature)) continue
            seen.add(signature)
            warnings.push(warning)
        }
    }

    // A combo the schema would refuse stays on the sheet and is left out of the
    // exported file, so the author is told rather than finding it gone.
    const incomplete = otherscapeCharacter.tag_combos.filter(
        (combo) => !isCompleteCombo(combo)
    ).length
    if (incomplete > 0) {
        warnings.push({
            key: 'otherscape:character.warnings.incompleteCombos',
            values: { count: incomplete },
        })
    }

    return warnings
}
