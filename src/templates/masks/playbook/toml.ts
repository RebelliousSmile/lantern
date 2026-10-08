import {
    carryCanonicalSource,
    stringifyCanonical,
} from '@/contracts/canonicalSource'
import { documentContracts } from '@/contracts/registry'
import type { MasksPlaybook } from './model'
import type { MasksPlaybook as Published } from './schema'

const contract = documentContracts.require<Published>('pbta/masks-playbook')

export function importFromTOMLWithWarnings(text: string) {
    const parsed = contract.parseToml(text) as unknown as MasksPlaybook
    const playbook = carryCanonicalSource(parsed, structuredClone(parsed))
    return { playbook, masksPlaybook: playbook, warnings: [] }
}

export const exportToTOML = (document: MasksPlaybook) =>
    stringifyCanonical(
        contract,
        document,
        document as unknown as Record<string, unknown>
    )
