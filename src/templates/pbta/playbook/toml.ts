import {
    carryCanonicalSource,
    stringifyCanonical,
} from '@/contracts/canonicalSource'
import { documentContracts } from '@/contracts/registry'
import type { ImportWarning } from '@/core/templates/types'
import {
    toPlaybookDocument,
    toPlaybookPayload,
    type PbtaPlaybook,
} from './model'
import type { Playbook as Published } from './schema'

const contract = documentContracts.require<Published>('pbta/playbook')

export const importFromTOML = (tomlText: string) =>
    importFromTOMLWithWarnings(tomlText)

export function importFromTOMLWithWarnings(tomlText: string): {
    playbook: PbtaPlaybook
    warnings: ImportWarning[]
} {
    const parsed = contract.parseToml(tomlText)
    return {
        playbook: carryCanonicalSource(toPlaybookDocument(parsed), parsed),
        warnings: [],
    }
}

export function exportToTOML(document: PbtaPlaybook): string {
    return stringifyCanonical(contract, document, toPlaybookPayload(document))
}
