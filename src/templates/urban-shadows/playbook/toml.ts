import {
    carryCanonicalSource,
    stringifyCanonical,
} from '@/contracts/canonicalSource'
import { documentContracts } from '@/contracts/registry'
import type { UrbanShadowsPlaybook } from './model'
import type { UrbanShadowsPlaybook as Published } from './schema'
const contract = documentContracts.require<Published>(
    'pbta/urban-shadows-playbook'
)
export function importFromTOMLWithWarnings(text: string) {
    const parsed = contract.parseToml(text) as unknown as UrbanShadowsPlaybook
    return { playbook: carryCanonicalSource(parsed, parsed), warnings: [] }
}
export const exportToTOML = (document: UrbanShadowsPlaybook) =>
    stringifyCanonical(
        contract,
        document,
        document as unknown as Record<string, unknown>
    )
