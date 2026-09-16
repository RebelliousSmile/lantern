import type { AdrenalinePj } from '@/contracts/adrenaline'
import { parseAdrenalineToml, stringifyAdrenalineToml } from '../shared/toml'

export function importFromTOMLWithWarnings(source: string) {
    return {
        pj: parseAdrenalineToml<AdrenalinePj>('adrenaline/pj', source),
        warnings: [],
    }
}

export const importFromTOML = importFromTOMLWithWarnings
export const exportToTOML = (document: AdrenalinePj) =>
    stringifyAdrenalineToml('adrenaline/pj', document)
