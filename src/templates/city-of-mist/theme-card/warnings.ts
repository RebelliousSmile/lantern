import type { ImportWarning } from '@/core/templates/types'
import type { ThemeCardDocument } from './model'

const STANDARD_THEMEBOOKS = new Set([
    'adaptation',
    'bastion',
    'defining event',
    'defining relationship',
    'divination',
    'expression',
    'mission',
    'mobility',
    'personality',
    'possessions',
    'relic',
    'routine',
    'subversion',
    'training',
])

export function computeCityOfMistThemeCardWarnings(
    themeCard: ThemeCardDocument
): ImportWarning[] {
    const warnings: ImportWarning[] = []

    if (
        themeCard.erosion &&
        ((themeCard.theme_type === 'mythos' &&
            themeCard.erosion.kind !== 'fade') ||
            (themeCard.theme_type === 'logos' &&
                themeCard.erosion.kind !== 'crack'))
    ) {
        warnings.push({
            key:
                themeCard.theme_type === 'mythos'
                    ? 'city:themeCard.warnings.mythosErosion'
                    : 'city:themeCard.warnings.logosErosion',
            values: { kind: themeCard.erosion.kind },
        })
    }

    if (themeCard.theme_type === 'crew' && themeCard.erosion) {
        warnings.push({ key: 'city:themeCard.warnings.crewErosion' })
    }

    const themebook = themeCard.themebook.trim().toLowerCase()
    if (STANDARD_THEMEBOOKS.has(themebook)) {
        const invalidWeaknessLetters = themeCard.weakness_tags
            .map((tag) => tag.letter)
            .filter(
                (letter): letter is string =>
                    letter != null && !['A', 'B', 'C', 'D'].includes(letter)
            )

        if (invalidWeaknessLetters.length) {
            warnings.push({
                key: 'city:themeCard.warnings.weaknessLetters',
                values: {
                    themebook: themeCard.themebook,
                    letters: invalidWeaknessLetters.join(', '),
                },
            })
        }
    }

    return warnings
}
