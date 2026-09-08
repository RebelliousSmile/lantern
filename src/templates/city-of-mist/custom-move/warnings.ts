import type { CityOfMistCustomMove, OutcomeTier } from './model'

const TIER_LABEL: Record<OutcomeTier, string> = {
    miss: 'Miss',
    hit: 'Hit',
    '7-9': '7-9',
    '10+': '10+',
    '12+': '12+',
}

/* Runs on a document the schema already accepted. Nothing here blocks an
   import: it flags the moves that will print in a way their author did not
   mean, which the schema has no way to tell apart from a deliberate choice. */
export function computeCityOfMistCustomMoveWarnings(
    cityOfMistCustomMove: CityOfMistCustomMove
): string[] {
    const warnings: string[] = []
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
        warnings.push(
            `Outcome tiers written twice: ${[...repeated].map((tier) => TIER_LABEL[tier]).join(', ')}. The card prints both rows under the same heading.`
        )
    }

    // A 12+ is a roll result. On a move that rolls nothing it can never come
    // up, so the row prints an outcome no player can reach.
    if (!cityOfMistCustomMove.roll && seen.has('12+')) {
        warnings.push(
            'A 12+ outcome on a move that calls for no roll: nothing can produce that result, so the row never applies.'
        )
    }

    // `pick_count` is printed as "choose N", so a count above the list is an
    // instruction the reader cannot follow.
    const overPicked = outcomes
        .map((outcome, index) => ({ outcome, index }))
        .filter(
            ({ outcome }) =>
                outcome.pick_count != null &&
                outcome.pick_count > (outcome.options?.length ?? 0)
        )
    if (overPicked.length > 0) {
        warnings.push(
            `Outcomes asking for more options than they list: ${overPicked
                .map(
                    ({ outcome }) =>
                        `${TIER_LABEL[outcome.tier]} (choose ${outcome.pick_count} of ${outcome.options?.length ?? 0})`
                )
                .join(', ')}.`
        )
    }

    return warnings
}
