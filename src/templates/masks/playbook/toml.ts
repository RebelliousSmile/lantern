import {
    carryCanonicalSource,
    stringifyCanonical,
} from '@/contracts/canonicalSource'
import { documentContracts } from '@/contracts/registry'
const contract = documentContracts.require<Record<string, unknown>>(
    'pbta/masks-playbook'
)
export const importFromTOMLWithWarnings = (text: string) => {
    const masksPlaybook = contract.parseToml(text)
    return {
        masksPlaybook: carryCanonicalSource(
            masksPlaybook,
            structuredClone(masksPlaybook)
        ),
        warnings: [],
    }
}
export const exportToTOML = (doc: Record<string, unknown>) =>
    stringifyCanonical(contract, doc, doc)
