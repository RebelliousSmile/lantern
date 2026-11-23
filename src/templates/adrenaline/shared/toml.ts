import { documentContracts } from '@/contracts/registry'
import { parse as parseToml } from 'smol-toml'
import { upgradeLegacyAdrenalineRanges } from './legacyRanges'

export function parseAdrenalineToml<TDocument>(key: string, source: string) {
    const contract = documentContracts.require<TDocument>(key)
    const legacyDocument = upgradeLegacyAdrenalineRanges(parseToml(source), key)
    return contract.parseToml(
        contract.stringifyToml(legacyDocument as TDocument)
    )
}

/**
 * A text that holds line breaks is written as a TOML multi-line string
 * (`"""`), so it stays readable and editable by hand instead of showing `\n`
 * escapes. Only `key = "..."` lines are rewritten; the text reads back
 * unchanged, except that CRLF becomes LF.
 */
export function multilineTomlStrings(source: string) {
    return source.replace(
        /^([ \t]*[A-Za-z0-9_-]+ = )("(?:[^"\\\n]|\\.)*")$/gm,
        (line, head: string, quoted: string) => {
            if (!/\\[nr]/.test(quoted)) return line
            let text: unknown
            try {
                text = JSON.parse(quoted)
            } catch {
                return line
            }
            if (typeof text !== 'string') return line
            const body = text
                .replace(/\r\n?/g, '\n')
                .replace(/\\/g, '\\\\')
                .replace(/"""/g, '""\\"')
            // eslint-disable-next-line no-control-regex
            if (/[\u0000-\u0008\u000b-\u001f\u007f]/.test(body)) return line
            return `${head}"""\n${body}"""`
        }
    )
}

export function stringifyAdrenalineToml<TDocument>(
    key: string,
    document: TDocument
) {
    return multilineTomlStrings(
        documentContracts.require<TDocument>(key).stringifyToml(document)
    )
}
