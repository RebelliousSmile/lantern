import {
    carryCanonicalSource,
    stringifyCanonical,
} from '@/contracts/canonicalSource'
import { documentContracts } from '@/contracts/registry'
import type { MonsterheartsPlaybook } from './model'
import type { MonsterheartsPlaybook as Published } from './schema'
const contract = documentContracts.require<Published>(
    'pbta/monsterhearts-playbook'
)
export const importFromTOMLWithWarnings = (text: string) => {
    const playbook = contract.parseToml(
        text
    ) as unknown as MonsterheartsPlaybook
    const canonical = carryCanonicalSource(playbook, structuredClone(playbook))
    return {
        playbook: canonical,
        monsterheartsPlaybook: canonical,
        warnings: [],
    }
}
export const exportToTOML = (doc: MonsterheartsPlaybook) =>
    stringifyCanonical(contract, doc, doc as unknown as Record<string, unknown>)
