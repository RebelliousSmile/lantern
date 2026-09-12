import { PBTA_DOCUMENT_CODECS } from 'schema-pbta'
import {
    toDocumentContracts,
    type AnyDocumentContract,
} from './documentContract'

/**
 * The five PbtA targets as registry entries, keyed `pbta/<target>`:
 * `game-definition`, `move`, `playbook`, `npc`, `front`.
 *
 * `PbtaDocumentCodec` is already `{ schema, parseToml, stringifyToml }` and
 * carries no JSON codec, so the fold drops nothing here.
 */
export const pbtaDocumentContracts: AnyDocumentContract[] = toDocumentContracts(
    'pbta',
    PBTA_DOCUMENT_CODECS
)
