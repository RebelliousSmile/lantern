import type { ImportWarning } from '@/core/templates/types'
import { translate, type TranslationKey } from '@/i18n/text'
import type { CityOfMistCustomMove, OutcomeTier } from './model'

/* Miss and Hit are words; the numeric tiers read the same in every language. */
const WORDED_TIERS: Partial<Record<OutcomeTier, TranslationKey>> = {
    miss: 'city:customMove.tiers.miss',
    hit: 'city:customMove.tiers.hit',
}

function tierLabel(tier: OutcomeTier): string {
    const key = WORDED_TIERS[tier]
    return key ? translate(key) : tier
}

/* Runs on a document the schema already accepted. Nothing here blocks an
   import: it flags the moves that will print in a way their author did not
   mean, which the schema has no way to tell apart from a deliberate choice.
   List fragments are worded in the language active when the warning is raised. */
export function computeCityOfMistCustomMoveWarnings(
    cityOfMistCustomMove: CityOfMistCustomMove
): ImportWarning[] {
    const warnings: ImportWarning[] = []
    const outcomes = cityOfMistCustomMove.outcomes

    // The card prints one row per outcome, in order. Two rows headed the same
    // tier read as a contradiction rather than as two options.
    const seen = new Set<OutcomeTier>()
    const repeated = new Set<OutcomeTier>()
    for (const outcome of outcomes) {
        if (seen.has(outcome.tier)) repeated.add(outcome.tier)
        seen.add(outcome.tier)
    }
    if (repeated.size > 0) {
        warnings.push({
            key: 'city:customMove.warnings.repeatedTiers',
            values: { tiers: [...repeated].map(tierLabel).join(', ') },
        })
    }

    // A 12+ is a roll result. On a move that rolls nothing it can never come
    // up, so the row prints an outcome no player can reach.
    if (!cityOfMistCustomMove.roll && seen.has('12+')) {
        warnings.push({ key: 'city:customMove.warnings.unreachableTwelve' })
    }

    // `pick_count` is printed as "choose N", so a count above the list is an
    // instruction the reader cannot follow.
    const overPicked = outcomes.filter(
        (outcome) =>
            outcome.pick_count != null &&
            outcome.pick_count > (outcome.options?.length ?? 0)
    )
    if (overPicked.length > 0) {
        warnings.push({
            key: 'city:customMove.warnings.overPicked',
            values: {
                outcomes: overPicked
                    .map((outcome) =>
                        translate('city:customMove.warnings.overPickedItem', {
                            tier: tierLabel(outcome.tier),
                            count: outcome.pick_count ?? 0,
                            total: outcome.options?.length ?? 0,
                        })
                    )
                    .join(', '),
            },
        })
    }

    return warnings
}
