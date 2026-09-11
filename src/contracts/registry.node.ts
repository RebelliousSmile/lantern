import { adrenalineDocumentContracts } from './adrenaline'
import type { AnyDocumentContract } from './documentContract'
import {
    CLIENT_DOCUMENT_CONTRACTS,
    createDocumentContractRegistry,
} from './registry'

/**
 * The client table plus Adrenaline, for the Node conformance harness.
 *
 * Nothing under `src/` outside this file may import it: `schema-adrenaline` is a
 * dev dependency and this is the single edge that reaches it.
 */
export const NODE_DOCUMENT_CONTRACTS: readonly AnyDocumentContract[] = [
    ...CLIENT_DOCUMENT_CONTRACTS,
    ...adrenalineDocumentContracts,
]

export const nodeDocumentContracts = createDocumentContractRegistry(
    NODE_DOCUMENT_CONTRACTS
)
