import { documentContracts } from '@/contracts/registry'
import type { LegendInTheMistChallenge as PublishedChallenge } from '@/contracts/mist-engine'
import {
    toLegendInTheMistChallengeDocument,
    type LegendInTheMistChallenge,
} from './model'

export function migrateLegacyChallengeWorkspace(
    raw: unknown
): LegendInTheMistChallenge | null {
    const result = documentContracts
        .require<PublishedChallenge>('mist/legend-in-the-mist/challenge')
        .schema.safeParse((raw as { data?: unknown }).data)
    return result.success
        ? toLegendInTheMistChallengeDocument(result.data)
        : null
}
