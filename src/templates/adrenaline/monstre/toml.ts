import type { AdrenalineMonstre } from '@/contracts/adrenaline'
import { compactAgainst } from '../shared/editor/schemaCompact'
import { parseAdrenalineToml, stringifyAdrenalineToml } from '../shared/toml'

export function importFromTOMLWithWarnings(source: string) {
    return {
        monstre: parseAdrenalineToml<AdrenalineMonstre>(
            'adrenaline/monstre',
            source
        ),
        warnings: [],
    }
}

export const importFromTOML = importFromTOMLWithWarnings
/* The editor keeps drafts; the export writes the lines the schema takes whole. */
export const exportToTOML = (document: AdrenalineMonstre) =>
    stringifyAdrenalineToml<AdrenalineMonstre>(
        'adrenaline/monstre',
        (compactAgainst('monstre', document) ?? {}) as AdrenalineMonstre
    )
