import type { AdrenalineMonstre } from '@/contracts/adrenaline'
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
export const exportToTOML = (document: AdrenalineMonstre) =>
    stringifyAdrenalineToml('adrenaline/monstre', document)
