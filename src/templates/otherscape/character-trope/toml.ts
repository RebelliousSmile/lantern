import { parse as tomlParse, stringify as tomlStringify } from 'smol-toml'
import {
    toOtherscapeCharacterTropeDocument,
    toOtherscapeCharacterTropePayload,
    type OtherscapeCharacterTrope,
} from './model'
import { OtherscapeCharacterTropeSchema } from './schema'
import { computeOtherscapeCharacterTropeWarnings } from './warnings'

function formatIssues(error: {
    issues: { path: PropertyKey[]; message: string }[]
}) {
    return error.issues
        .map((issue) => `${issue.path.join('.') || 'root'}: ${issue.message}`)
        .join('\n')
}

/** Import and validate. Throws with a readable message on errors. */
export const importFromTOML = (t: string) => importFromTOMLWithWarnings(t)

export function importFromTOMLWithWarnings(tomlText: string): {
    otherscapeCharacterTrope: OtherscapeCharacterTrope
    warnings: string[]
} {
    const raw = tomlParse(tomlText) // may throw if not TOML
    const parsed = OtherscapeCharacterTropeSchema.safeParse(raw)

    if (!parsed.success) {
        throw new Error(formatIssues(parsed.error))
    }

    const otherscapeCharacterTrope = toOtherscapeCharacterTropeDocument(
        parsed.data
    )
    const warnings = computeOtherscapeCharacterTropeWarnings(
        otherscapeCharacterTrope
    )
    return { otherscapeCharacterTrope, warnings }
}

/**
 * Ensure we only export validated data, and only the fields that carry
 * something: an untouched optional field would otherwise be written out as an
 * empty value and read back as deliberate.
 */
export function exportToTOML(
    otherscapeCharacterTrope: OtherscapeCharacterTrope
): string {
    const payload = toOtherscapeCharacterTropePayload(otherscapeCharacterTrope)
    const parsed = OtherscapeCharacterTropeSchema.safeParse(payload)
    if (!parsed.success) {
        throw new Error(
            `Cannot export: data is invalid.\n${formatIssues(parsed.error)}`
        )
    }

    return tomlStringify(payload as any)
}
