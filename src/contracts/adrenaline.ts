import { ADRENALINE_DOCUMENT_CODECS } from 'schema-adrenaline'
import {
    toDocumentContracts,
    type AnyDocumentContract,
} from './documentContract'

/**
 * The three Adrenaline targets as registry entries, keyed `adrenaline/<target>`:
 * `pj`, `pnj`, `monstre`.
 *
 * `schema-adrenaline` is a **dev** dependency. This module is imported by
 * `registry.node.ts` and by the conformance harness only; importing it from the
 * client would bundle three Zod schemas no user can open a document against.
 * Its codecs also publish a JSON pair, which the fold deliberately drops — the
 * harness reaches for those directly.
 */
export const adrenalineDocumentContracts: AnyDocumentContract[] =
    toDocumentContracts('adrenaline', ADRENALINE_DOCUMENT_CODECS)
