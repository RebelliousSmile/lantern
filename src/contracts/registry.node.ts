import type { AnyDocumentContract } from './documentContract'
import {
    CLIENT_DOCUMENT_CONTRACTS,
    createDocumentContractRegistry,
} from './registry'

/**
 * The client table, reused by the Node conformance harness. Adrenaline now
 * belongs to it because its templates parse TOML in the browser too.
 */
export const NODE_DOCUMENT_CONTRACTS: readonly AnyDocumentContract[] = [
    ...CLIENT_DOCUMENT_CONTRACTS,
]

export const nodeDocumentContracts = createDocumentContractRegistry(
    NODE_DOCUMENT_CONTRACTS
)
