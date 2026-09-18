import { documentContracts } from '@/contracts/registry'
import { parse as parseToml } from 'smol-toml'
import { upgradeLegacyAdrenalineRanges } from './legacyRanges'

export function parseAdrenalineToml<TDocument>(key: string, source: string) {
    const contract = documentContracts.require<TDocument>(key)
    const legacyDocument = upgradeLegacyAdrenalineRanges(parseToml(source))
    return contract.parseToml(
        contract.stringifyToml(legacyDocument as TDocument)
    )
}

export function stringifyAdrenalineToml<TDocument>(
    key: string,
    document: TDocument
) {
    return documentContracts.require<TDocument>(key).stringifyToml(document)
}
