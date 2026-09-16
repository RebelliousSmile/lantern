import type {
    MonstreDocument,
    PersonnageJoueurValeur,
    PersonnageNonJoueValeur,
} from 'schema-adrenaline'
import { ADRENALINE_DOCUMENT_CODECS } from 'schema-adrenaline'
import {
    toDocumentContracts,
    type AnyDocumentContract,
} from './documentContract'

/**
 * The three Adrenaline targets as registry entries, keyed `adrenaline/<target>`:
 * `pj`, `pnj`, `monstre`.
 *
 * The package is a runtime dependency: the three browser templates use these
 * same codecs for their TOML boundary. Its codecs also publish a JSON pair,
 * which the fold deliberately drops — the conformance harness reaches for
 * those directly.
 */
export const adrenalineDocumentContracts: AnyDocumentContract[] =
    toDocumentContracts('adrenaline', ADRENALINE_DOCUMENT_CODECS)

export type AdrenalinePj = PersonnageJoueurValeur
export type AdrenalinePnj = PersonnageNonJoueValeur
export type AdrenalineMonstre = MonstreDocument
