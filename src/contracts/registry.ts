import type { AnyDocumentContract, DocumentContract } from './documentContract'
import { mistDocumentContracts } from './mist-engine'
import { pbtaDocumentContracts } from './pbta'

export type DocumentContractRegistry = {
    has: (key: string) => boolean
    /**
     * The document generic is a claim the caller makes, not a check the registry
     * performs: a key is a string and the table is heterogeneous. It is here so a
     * call site keeps the document type it had when it imported the codec by name,
     * and so the unsoundness lives on this one line rather than in fourteen
     * modules that would otherwise hand `any` to their model functions.
     */
    get: <TDocument = unknown>(
        key: string
    ) => DocumentContract<TDocument> | undefined
    /** Same as `get`, but names the key and the known ones when it resolves to nothing. */
    require: <TDocument = unknown>(key: string) => DocumentContract<TDocument>
    keys: () => string[]
    all: () => AnyDocumentContract[]
    byContract: (contractId: string) => AnyDocumentContract[]
}

export function createDocumentContractRegistry(
    contracts: readonly AnyDocumentContract[]
): DocumentContractRegistry {
    const byKey = new Map<string, AnyDocumentContract>()
    for (const contract of contracts) {
        if (byKey.has(contract.key)) {
            throw new Error(`Duplicate document contract key: ${contract.key}`)
        }
        byKey.set(contract.key, contract)
    }

    return {
        has: (key) => byKey.has(key),
        get: (key) => byKey.get(key),
        require: (key) => {
            const contract = byKey.get(key)
            if (!contract) {
                throw new Error(
                    `Unknown document contract key: ${key}. Known keys: ${[...byKey.keys()].join(', ')}`
                )
            }
            return contract
        },
        keys: () => [...byKey.keys()],
        all: () => [...byKey.values()],
        byContract: (contractId) =>
            [...byKey.values()].filter((c) => c.contractId === contractId),
    }
}

/**
 * Every contract the client can open a document against. No branch on a game
 * lives here, and `adrenaline.ts` is deliberately absent: that import is what
 * would drag a dev dependency into the client bundle.
 */
export const CLIENT_DOCUMENT_CONTRACTS: readonly AnyDocumentContract[] = [
    ...mistDocumentContracts,
    ...pbtaDocumentContracts,
]

export const documentContracts = createDocumentContractRegistry(
    CLIENT_DOCUMENT_CONTRACTS
)
