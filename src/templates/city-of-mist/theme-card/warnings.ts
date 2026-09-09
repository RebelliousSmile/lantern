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
): string[] {
    const warnings: string[] = []

    if (
        themeCard.erosion &&
        ((themeCard.theme_type === 'mythos' &&
            themeCard.erosion.kind !== 'fade') ||
            (themeCard.theme_type === 'logos' &&
                themeCard.erosion.kind !== 'crack'))
    ) {
        warnings.push(
            `${themeCard.theme_type === 'mythos' ? 'Mythos' : 'Logos'} cards use ${themeCard.theme_type === 'mythos' ? 'Fade' : 'Crack'}, but this card carries ${themeCard.erosion.kind}.`
        )
    }

    if (themeCard.theme_type === 'crew' && themeCard.erosion) {
        warnings.push(
            'Crew cards carry no erosion track, so this track will not print.'
        )
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
            warnings.push(
                `${themeCard.themebook} has weakness questions A to D, but these tags cite other letters: ${invalidWeaknessLetters.join(', ')}.`
            )
        }
    }

    return warnings
}
