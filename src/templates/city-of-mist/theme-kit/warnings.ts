import type { ImportWarning } from '@/core/templates/types'
import { translate, type TranslationKey } from '@/i18n/text'
import type { Question, ThemeKitDocument } from './model'

/* The letters have to read A, B, C down the page: a played card cites the
   letter of the question its tag answers, so a gap or a repeat leaves a tag
   pointing at nothing. The detail list is worded in the language active when
   the warning is raised. */
function outOfSequence(
    questions: Question[],
    key: TranslationKey
): ImportWarning | null {
    const wrong = questions
        .map((question, index) => ({
            index,
            expected: String.fromCharCode(65 + index),
            actual: question.letter,
        }))
        .filter((row) => row.expected !== row.actual)

    if (!wrong.length) return null

    const detail = wrong
        .map((row) =>
            translate('city:themeKit.warnings.outOfSequenceItem', {
                letter: row.actual,
                position: row.index + 1,
            })
        )
        .join(', ')

    return { key, values: { detail } }
}

export function computeCityOfMistThemeKitWarnings(
    themeKit: ThemeKitDocument
): ImportWarning[] {
    const warnings: ImportWarning[] = []

    if (themeKit.improvements.length !== 5) {
        warnings.push({
            key: 'city:themeKit.warnings.improvementCount',
            values: { count: themeKit.improvements.length },
        })
    }

    const power = outOfSequence(
        themeKit.power_tag_questions,
        'city:themeKit.warnings.powerOutOfSequence'
    )
    if (power) warnings.push(power)

    const weakness = outOfSequence(
        themeKit.weakness_tag_questions,
        'city:themeKit.warnings.weaknessOutOfSequence'
    )
    if (weakness) warnings.push(weakness)

    if (themeKit.theme_type === 'crew' && !themeKit.crew_relationships.length) {
        warnings.push({
            key: 'city:themeKit.warnings.crewWithoutRelationships',
        })
    }

    if (themeKit.theme_type !== 'crew' && themeKit.crew_relationships.length) {
        warnings.push({
            key: 'city:themeKit.warnings.relationshipsWithoutCrew',
        })
    }

    return warnings
}
