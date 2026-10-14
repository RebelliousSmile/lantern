/**
 * Stand-in for the workspace hook of the Adrenaline editors in the PJ harness only.
 *
 * The PNJ and creature panels read and write their document through `useAdrenalineDocument`, which
 * needs the workspace store. This double reads the document and the sheet from
 * `globalThis.__lanternEdit`, and writes the mutated clone back to it, so the harness can type into
 * those panels the way it types into the PJ panels.
 */
type Edit = {
    doc: Record<string, unknown>
    sheet: {
        open: boolean
        target: string | null
        profile?: string
        keys?: string[]
    }
}

const edit = () => (globalThis as { __lanternEdit?: Edit }).__lanternEdit

export function useAdrenalineDocument<T extends Record<string, unknown>>(
    _templateId: string,
    fallback: T
) {
    const current = edit()
    return {
        sheet: current?.sheet ?? { open: false, target: null },
        document: (current?.doc ?? fallback) as T,
        update: (mutate: (document: T) => void) => {
            if (!current) return
            const next = JSON.parse(JSON.stringify(current.doc)) as T
            mutate(next)
            current.doc = next
        },
        openSection: (section: string, profile?: string, keys?: string[]) => {
            if (!current) return
            current.sheet = {
                open: true,
                target: section,
                ...(profile === undefined ? {} : { profile }),
                ...(keys === undefined ? {} : { keys }),
            }
        },
    }
}
