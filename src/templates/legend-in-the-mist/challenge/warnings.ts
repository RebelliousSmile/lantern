import type { ImportWarning } from '@/core/templates/types'
import { rolesList } from '@/utils/constants'
import { parseToken } from '@/utils/tags'
import type { LegendInTheMistChallenge } from './model'

export function computeLegendInTheMistChallengeWarnings(
    legendInTheMistChallenge: LegendInTheMistChallenge
): ImportWarning[] {
    const warnings: ImportWarning[] = []

    const knownRoles = new Set(rolesList.map((role) => role.toLowerCase()))
    const unknownRoles = (legendInTheMistChallenge.roles ?? []).filter(
        (role) => !knownRoles.has(role.toLowerCase())
    )
    if (unknownRoles.length > 0) {
        warnings.push({
            key: 'legend:challenge.warnings.unknownRoles',
            values: { roles: unknownRoles.join(', ') },
        })
    }

    const invalidTokens: string[] = []
    const limitsFound: string[] = []
    for (const token of legendInTheMistChallenge.tags_and_statuses ?? []) {
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
            key: 'legend:challenge.warnings.unrecognizedTokens',
            values: { tokens: invalidTokens.join(', ') },
        })
    }

    if (limitsFound.length > 0) {
        warnings.push({
            key: 'legend:challenge.warnings.limitTokens',
            values: { tokens: limitsFound.join(', ') },
        })
    }

    const emptyOnMax = (legendInTheMistChallenge.limits ?? []).filter(
        (limit) => limit.is_progress && !limit.on_max
    )
    if (emptyOnMax.length > 0) {
        warnings.push({
            key: 'legend:challenge.warnings.progressWithoutOnMax',
            values: {
                limits: emptyOnMax.map((limit) => limit.name).join(', '),
            },
        })
    }

    return warnings
}
