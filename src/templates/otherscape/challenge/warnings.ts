import { parseToken } from '@/utils/tags'
import type { OtherscapeChallenge } from './model'

export function computeOtherscapeChallengeWarnings(
    otherscapeChallenge: OtherscapeChallenge
): string[] {
    const warnings: string[] = []

    // Unlike the tags of a Theme, these are stored exactly as printed, braces
    // included, so parseToken reads them as they stand.
    const invalidTokens: string[] = []
    const limitsFound: string[] = []
    for (const token of otherscapeChallenge.tags_and_statuses) {
        const parsed = parseToken(token)
        if (!parsed) {
            invalidTokens.push(token)
            continue
        }

        if (parsed.kind === 'limit') {
            limitsFound.push(token)
        }
    }

    if (invalidTokens.length > 0) {
        warnings.push(
            `Some tokens aren't recognized as {!weakness}, {status-<n>} or {tag}: ${invalidTokens.join(', ')}.`
        )
    }

    if (limitsFound.length > 0) {
        warnings.push(
            `Limit-like tokens were found in Tags & Statuses and will be ignored by some tools: ${limitsFound.join(', ')}. Consider moving them to the Limits section.`
        )
    }

    const emptyOnMax = otherscapeChallenge.limits.filter(
        (limit) => limit.is_progress && !limit.on_max?.trim()
    )
    if (emptyOnMax.length > 0) {
        warnings.push(
            `Progress limit(s) without "on_max": ${emptyOnMax.map((limit) => limit.name).join(', ')}. The track fills up and nothing is printed for it.`
        )
    }

    // A polar Limit is one label holding two opposed poles, and the slash is
    // what separates them. Without it the card prints a single pole.
    const unslashedPolar = otherscapeChallenge.limits.filter(
        (limit) => limit.is_polar && !limit.name.includes('/')
    )
    if (unslashedPolar.length > 0) {
        warnings.push(
            `Polar limit(s) with no "/" in their name: ${unslashedPolar.map((limit) => limit.name).join(', ')}. A polar Limit joins its two poles with a slash, as in "catch/outrun".`
        )
    }

    const onMaxWithoutProgress = otherscapeChallenge.limits.filter(
        (limit) => !limit.is_progress && limit.on_max?.trim()
    )
    if (onMaxWithoutProgress.length > 0) {
        warnings.push(
            `Limit(s) carrying an "on_max" outcome without being a progress track: ${onMaxWithoutProgress.map((limit) => limit.name).join(', ')}. The outcome will never be reached.`
        )
    }

    if (!otherscapeChallenge.limits.length) {
        warnings.push(
            'This Challenge has no Limits, so there is no printed way to overcome it.'
        )
    }

    return warnings
}
