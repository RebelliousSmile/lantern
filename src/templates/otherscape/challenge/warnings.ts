import type { ImportWarning } from '@/core/templates/types'
import { parseToken } from '@/utils/tags'
import type { OtherscapeChallenge } from './model'

export function computeOtherscapeChallengeWarnings(
    otherscapeChallenge: OtherscapeChallenge
): ImportWarning[] {
    const warnings: ImportWarning[] = []

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
        warnings.push({
            key: 'otherscape:warnings.invalidTokens',
            values: { tokens: invalidTokens.join(', ') },
        })
    }

    if (limitsFound.length > 0) {
        warnings.push({
            key: 'otherscape:challenge.warnings.limitTokens',
            values: { tokens: limitsFound.join(', ') },
        })
    }

    const emptyOnMax = otherscapeChallenge.limits.filter(
        (limit) => limit.is_progress && !limit.on_max?.trim()
    )
    if (emptyOnMax.length > 0) {
        warnings.push({
            key: 'otherscape:challenge.warnings.progressWithoutOnMax',
            values: {
                limits: emptyOnMax.map((limit) => limit.name).join(', '),
            },
        })
    }

    // A polar Limit is one label holding two opposed poles, and the slash is
    // what separates them. Without it the card prints a single pole.
    const unslashedPolar = otherscapeChallenge.limits.filter(
        (limit) => limit.is_polar && !limit.name.includes('/')
    )
    if (unslashedPolar.length > 0) {
        warnings.push({
            key: 'otherscape:challenge.warnings.polarWithoutSlash',
            values: {
                limits: unslashedPolar.map((limit) => limit.name).join(', '),
            },
        })
    }

    const onMaxWithoutProgress = otherscapeChallenge.limits.filter(
        (limit) => !limit.is_progress && limit.on_max?.trim()
    )
    if (onMaxWithoutProgress.length > 0) {
        warnings.push({
            key: 'otherscape:challenge.warnings.onMaxWithoutProgress',
            values: {
                limits: onMaxWithoutProgress
                    .map((limit) => limit.name)
                    .join(', '),
            },
        })
    }

    if (!otherscapeChallenge.limits.length) {
        warnings.push({ key: 'otherscape:challenge.warnings.noLimits' })
    }

    return warnings
}
