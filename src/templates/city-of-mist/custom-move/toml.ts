import { parse as tomlParse, stringify as tomlStringify } from 'smol-toml'
import type { CityOfMistCustomMove } from './model'
import {
    toCityOfMistCustomMoveDocument,
    toCityOfMistCustomMovePayload,
} from './model'
import { CityOfMistCustomMoveSchema } from './schema'
import { computeCityOfMistCustomMoveWarnings } from './warnings'

export const importFromTOML = (tomlText: string) =>
    importFromTOMLWithWarnings(tomlText)

export function importFromTOMLWithWarnings(tomlText: string): {
    cityOfMistCustomMove: CityOfMistCustomMove
    warnings: string[]
} {
    const raw = tomlParse(tomlText)
    const parsed = CityOfMistCustomMoveSchema.safeParse(raw)

    if (!parsed.success) {
        throw new Error(
            parsed.error.issues
                .map(
                    (issue) =>
                        `${issue.path.join('.') || 'root'}: ${issue.message}`
                )
                .join('\n')
        )
    }

    const cityOfMistCustomMove = toCityOfMistCustomMoveDocument(parsed.data)

    return {
        cityOfMistCustomMove,
        warnings: computeCityOfMistCustomMoveWarnings(cityOfMistCustomMove),
    }
}

export function exportToTOML(cityOfMistCustomMove: CityOfMistCustomMove) {
    /* The document keeps every optional filled in so the forms never meet an
       `undefined`; the payload puts the empty ones back to absent. Validating
       the payload rather than the document is what keeps an untouched field
       from being exported as a deliberate empty value. */
    const payload = toCityOfMistCustomMovePayload(cityOfMistCustomMove)
    const parsed = CityOfMistCustomMoveSchema.safeParse(payload)

    if (!parsed.success) {
        throw new Error(
            'Cannot export: data is invalid.\n' +
                parsed.error.issues
                    .map(
                        (issue) =>
                            `${issue.path.join('.') || 'root'}: ${issue.message}`
                    )
                    .join('\n')
        )
    }

    return tomlStringify(parsed.data as any)
}
