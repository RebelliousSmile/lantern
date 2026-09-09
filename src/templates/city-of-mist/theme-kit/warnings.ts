import type { Question, ThemeKitDocument } from './model'

/* The letters have to read A, B, C down the page: a played card cites the
   letter of the question its tag answers, so a gap or a repeat leaves a tag
   pointing at nothing. */
function outOfSequence(questions: Question[], label: string): string | null {
    const wrong = questions
        .map((question, index) => ({
            index,
            expected: String.fromCharCode(65 + index),
            actual: question.letter,
        }))
        .filter((row) => row.expected !== row.actual)

    if (!wrong.length) return null

    const detail = wrong
        .map((row) => `${row.actual} at position ${row.index + 1}`)
        .join(', ')

    return `${label} should be lettered A, B, C down the list; found ${detail}.`
}

export function computeCityOfMistThemeKitWarnings(
    themeKit: ThemeKitDocument
): string[] {
    const warnings: string[] = []

    if (themeKit.improvements.length !== 5) {
        warnings.push(
            `Every themebook the books print carries five improvements; this one carries ${themeKit.improvements.length}.`
        )
    }

    const power = outOfSequence(
        themeKit.power_tag_questions,
        'Power tag questions'
    )
    if (power) warnings.push(power)

    const weakness = outOfSequence(
        themeKit.weakness_tag_questions,
        'Weakness tag questions'
    )
    if (weakness) warnings.push(weakness)

    if (themeKit.theme_type === 'crew' && !themeKit.crew_relationships.length) {
        warnings.push(
            'A Crew themebook prints its crew relationships in place of a motivation, and this one carries none.'
        )
    }

    if (themeKit.theme_type !== 'crew' && themeKit.crew_relationships.length) {
        warnings.push(
            'Crew relationships only print on a Crew themebook, so these will not appear.'
        )
    }

    return warnings
}
