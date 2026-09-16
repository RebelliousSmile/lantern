import { documentContracts } from '@/contracts/registry'

export function parseAdrenalineToml<TDocument>(key: string, source: string) {
    return documentContracts.require<TDocument>(key).parseToml(source)
}

export function stringifyAdrenalineToml<TDocument>(
    key: string,
    document: TDocument
) {
    return documentContracts.require<TDocument>(key).stringifyToml(document)
}
