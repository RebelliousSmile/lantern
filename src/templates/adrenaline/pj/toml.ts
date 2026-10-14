import type { AdrenalinePj } from '@/contracts/adrenaline'
import { compactAgainst } from '../shared/editor/schemaCompact'
import { parseAdrenalineToml, stringifyAdrenalineToml } from '../shared/toml'

export function importFromTOMLWithWarnings(source: string) {
    return {
        pj: parseAdrenalineToml<AdrenalinePj>('adrenaline/pj', source),
        warnings: [],
    }
}

export const importFromTOML = importFromTOMLWithWarnings
/*
 * The contract is strict: a blank string, an empty list, a nameless row and a line lacking a
 * required key are not a document. The editor keeps them as drafts while they are typed, and says
 * so; the export writes what is whole.
 */
export const exportToTOML = (document: AdrenalinePj) =>
    stringifyAdrenalineToml<AdrenalinePj>(
        'adrenaline/pj',
        (compactAgainst('pj', document) ?? {}) as AdrenalinePj
    )
