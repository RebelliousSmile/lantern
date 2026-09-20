import type { ParseKeys } from 'i18next'
import i18n from './index'

type ZodLikeIssue = { path?: PropertyKey[]; message?: string }

/* Detected by shape rather than `instanceof`, so a zod copy nested in a schema package still matches. */
function isZodLikeError(
    error: unknown
): error is { name: string; issues: ZodLikeIssue[] } {
    return (
        typeof error === 'object' &&
        error !== null &&
        (error as { name?: unknown }).name === 'ZodError' &&
        Array.isArray((error as { issues?: unknown }).issues)
    )
}

function isTomlSyntaxError(
    error: unknown
): error is { line: number; column: number; message?: string } {
    return (
        typeof error === 'object' &&
        error !== null &&
        typeof (error as { line?: unknown }).line === 'number' &&
        typeof (error as { column?: unknown }).column === 'number'
    )
}

/** `['limits', 1, 'name']` => `limits[2].name`: indices are shown 1-based, as a user counts them. */
export function formatIssuePath(path: readonly PropertyKey[]): string {
    return path.reduce<string>((text, segment) => {
        if (typeof segment === 'number') return `${text}[${segment + 1}]`
        const name = String(segment)
        return text ? `${text}.${name}` : name
    }, '')
}

/**
 * Turns any thrown value into readable text in the UI language. A Zod error lists one line per
 * issue, a TOML syntax error names its position, anything else falls back to `fallbackKey`, so a
 * raw JSON dump never reaches the user.
 */
export function formatError(
    error: unknown,
    fallbackKey: ParseKeys<'common'>
): string {
    if (isZodLikeError(error)) {
        const lines = error.issues.map((issue) => {
            const path = formatIssuePath(issue.path ?? [])
            const message = issue.message ?? ''
            return path ? `${path} ${message}` : message
        })
        if (lines.length > 0) return lines.join('\n')
    }

    if (isTomlSyntaxError(error)) {
        const heading = i18n.t('errors.tomlSyntax', {
            line: error.line,
            column: error.column,
        })
        const detail = error.message?.split('\n')[0]?.trim()
        return detail ? `${heading}\n${detail}` : heading
    }

    // A plain Error message still carries the only diagnosis there is; keep it unless it is JSON.
    const fallback = i18n.t(fallbackKey)
    const message = error instanceof Error ? error.message.trim() : ''
    if (!message || /^[[{]/.test(message)) return fallback
    return `${fallback}\n${message}`
}
