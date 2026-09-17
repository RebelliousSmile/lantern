import type { LegendInTheMistChallenge } from '@/contracts/mist-engine'

export function normalizeLegacyChallenge(
    challenge: LegendInTheMistChallenge
): Record<string, unknown> {
    return {
        name: challenge.name,
        description: challenge.description ?? '',
        rating: challenge.rating,
        roles: challenge.roles ?? [],
        tags_and_statuses: challenge.tags_and_statuses ?? [],
        mights: challenge.mights ?? [],
        limits: challenge.limits ?? [],
        threats: challenge.threats ?? [],
        general_consequences: challenge.general_consequences ?? [],
        special_features: challenge.special_features ?? [],
        meta: challenge.meta,
    }
}
