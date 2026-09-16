import type { AdrenalinePnj } from '@/contracts/adrenaline'
import { parseAdrenalineToml, stringifyAdrenalineToml } from '../shared/toml'

export function importFromTOMLWithWarnings(source: string) {
    return {
        pnj: parseAdrenalineToml<AdrenalinePnj>('adrenaline/pnj', source),
        warnings: [],
    }
}

export const importFromTOML = importFromTOMLWithWarnings
export const exportToTOML = (document: AdrenalinePnj) =>
    stringifyAdrenalineToml('adrenaline/pnj', document)
