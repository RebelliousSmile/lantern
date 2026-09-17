import {
    carryCanonicalSource,
    stringifyCanonical,
} from '@/contracts/canonicalSource'
import { documentContracts } from '@/contracts/registry'
const contract = documentContracts.require<Record<string, unknown>>(
    'pbta/the-sprawl-playbook'
)
export const importFromTOMLWithWarnings = (text: string) => {
    const theSprawlPlaybook = contract.parseToml(text)
    return {
        theSprawlPlaybook: carryCanonicalSource(
            theSprawlPlaybook,
            structuredClone(theSprawlPlaybook)
        ),
        warnings: [],
    }
}
export const exportToTOML = (doc: Record<string, unknown>) =>
    stringifyCanonical(contract, doc, doc)
