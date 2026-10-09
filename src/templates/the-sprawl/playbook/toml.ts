import {
    carryCanonicalSource,
    stringifyCanonical,
} from '@/contracts/canonicalSource'
import { documentContracts } from '@/contracts/registry'
import type { TheSprawlPlaybook } from './model'
import type { TheSprawlPlaybook as Published } from './schema'

const contract = documentContracts.require<Published>(
    'pbta/the-sprawl-playbook'
)

export function importFromTOMLWithWarnings(text: string) {
    const parsed = contract.parseToml(text) as unknown as TheSprawlPlaybook
    const playbook = carryCanonicalSource(parsed, structuredClone(parsed))
    return { playbook, theSprawlPlaybook: playbook, warnings: [] }
}

export const exportToTOML = (document: TheSprawlPlaybook) =>
    stringifyCanonical(
        contract,
        document,
        document as unknown as Record<string, unknown>
    )
