import type { AdrenalineRelations } from '@/contracts/adrenaline'
import { compactAgainst } from '../shared/editor/schemaCompact'
import { parseAdrenalineToml, stringifyAdrenalineToml } from '../shared/toml'

export function importFromTOMLWithWarnings(source: string) {
    return {
        relations: parseAdrenalineToml<AdrenalineRelations>(
            'adrenaline/relations',
            source
        ),
        warnings: [],
    }
}

export const importFromTOML = importFromTOMLWithWarnings
/* The editor keeps drafts; the export writes the lines the schema takes whole. */
export const exportToTOML = (document: AdrenalineRelations) =>
    stringifyAdrenalineToml<AdrenalineRelations>(
        'adrenaline/relations',
        (compactAgainst('relations', document) ?? {}) as AdrenalineRelations
    )
