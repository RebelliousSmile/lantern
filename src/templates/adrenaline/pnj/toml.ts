import type { AdrenalinePnj } from '@/contracts/adrenaline'
import { compactAgainst } from '../shared/editor/schemaCompact'
import { parseAdrenalineToml, stringifyAdrenalineToml } from '../shared/toml'

export function importFromTOMLWithWarnings(source: string) {
    return {
        pnj: parseAdrenalineToml<AdrenalinePnj>('adrenaline/pnj', source),
        warnings: [],
    }
}

export const importFromTOML = importFromTOMLWithWarnings
/* The editor keeps drafts; the export writes the lines the schema takes whole. */
export const exportToTOML = (document: AdrenalinePnj) =>
    stringifyAdrenalineToml<AdrenalinePnj>(
        'adrenaline/pnj',
        (compactAgainst('pnj', document) ?? {}) as AdrenalinePnj
    )
