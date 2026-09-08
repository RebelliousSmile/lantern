import { parse as tomlParse, stringify as tomlStringify } from 'smol-toml'
import {
    toOtherscapeChallengeDocument,
    toOtherscapeChallengePayload,
    type OtherscapeChallenge,
} from './model'
import { OtherscapeChallengeSchema } from './schema'
import { computeOtherscapeChallengeWarnings } from './warnings'

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
    otherscapeChallenge: OtherscapeChallenge
    warnings: string[]
} {
    const raw = tomlParse(tomlText) // may throw if not TOML
    const parsed = OtherscapeChallengeSchema.safeParse(raw)

    if (!parsed.success) {
        throw new Error(formatIssues(parsed.error))
    }

    const otherscapeChallenge = toOtherscapeChallengeDocument(parsed.data)
    const warnings = computeOtherscapeChallengeWarnings(otherscapeChallenge)
    return { otherscapeChallenge, warnings }
}

/**
 * Ensure we only export validated data, and only the fields that carry
 * something: an untouched optional field would otherwise be written out as an
 * empty value and read back as deliberate.
 */
export function exportToTOML(otherscapeChallenge: OtherscapeChallenge): string {
    const payload = toOtherscapeChallengePayload(otherscapeChallenge)
    const parsed = OtherscapeChallengeSchema.safeParse(payload)
    if (!parsed.success) {
        throw new Error(
            `Cannot export: data is invalid.\n${formatIssues(parsed.error)}`
        )
    }

    return tomlStringify(payload as any)
}
