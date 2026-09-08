import { parseToken } from '@/utils/tags'
import type { OtherscapePowerSet } from './model'

/* A Power Set carries no tags and no Limits of its own, so what can go wrong
   here is narrower than on a Challenge: an unreadable token written inside a
   Consequence, and a sheet that grants nothing. */
export function computeOtherscapePowerSetWarnings(
    otherscapePowerSet: OtherscapePowerSet
): string[] {
    const warnings: string[] = []

    const consequences = [
        ...otherscapePowerSet.general_consequences,
        ...otherscapePowerSet.threats.flatMap(
            (threat) => threat.consequences ?? []
        ),
    ]

    // Only what is written between braces is checked: the rest of a
    // Consequence is prose and has no token grammar to fail.
    const invalidTokens: string[] = []
    for (const consequence of consequences) {
        for (const token of consequence.match(/\{[^}]*\}/g) ?? []) {
            if (!parseToken(token)) invalidTokens.push(token)
        }
    }

    if (invalidTokens.length > 0) {
        warnings.push(
            `Some tokens aren't recognized as {!weakness}, {status-<n>} or {tag}: ${invalidTokens.join(', ')}.`
        )
    }

    if (
        !otherscapePowerSet.specials.length &&
        !otherscapePowerSet.threats.length
    ) {
        warnings.push(
            'This Power Set grants no Specials and no Threats, so grafting it onto a Challenge changes nothing.'
        )
    }

    return warnings
}
