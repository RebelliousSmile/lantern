import {
    carryCanonicalSource,
    stringifyCanonical,
} from '@/contracts/canonicalSource'
import { documentContracts } from '@/contracts/registry'
const contract = documentContracts.require<Record<string, unknown>>(
    'pbta/monster-of-the-week-playbook'
)
export const importFromTOMLWithWarnings = (text: string) => {
    const monsterOfTheWeekPlaybook = contract.parseToml(text)
    return {
        monsterOfTheWeekPlaybook: carryCanonicalSource(
            monsterOfTheWeekPlaybook,
            structuredClone(monsterOfTheWeekPlaybook)
        ),
        warnings: [],
    }
}
export const exportToTOML = (doc: Record<string, unknown>) =>
    stringifyCanonical(contract, doc, doc)
