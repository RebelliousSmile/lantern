import {
    carryCanonicalSource,
    stringifyCanonical,
} from '@/contracts/canonicalSource'
import { documentContracts } from '@/contracts/registry'
import type { MonsterOfTheWeekPlaybook } from './model'
import type { MonsterOfTheWeekPlaybook as Published } from './schema'

const contract = documentContracts.require<Published>(
    'pbta/monster-of-the-week-playbook'
)

export function importFromTOMLWithWarnings(text: string) {
    const parsed = contract.parseToml(
        text
    ) as unknown as MonsterOfTheWeekPlaybook
    const playbook = carryCanonicalSource(parsed, structuredClone(parsed))
    return { playbook, monsterOfTheWeekPlaybook: playbook, warnings: [] }
}

export const exportToTOML = (document: MonsterOfTheWeekPlaybook) =>
    stringifyCanonical(
        contract,
        document,
        document as unknown as Record<string, unknown>
    )
