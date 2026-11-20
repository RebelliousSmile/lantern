import type { TemplateExportPage } from '@/core/templates/types'
import i18n from '@/i18n'
import { useUiText } from '@/i18n/text'
import { NotesForm } from '@/templates/shared/notes/NotesForm'
import { NotesPage } from '@/templates/shared/notes/NotesPage'
import type { CSSProperties } from 'react'
import {
    getPbtaPlaybookPages,
    SESSION_NOTES_CAPACITY,
    type PbtaPlaybookPage,
    type PbtaPlaybookPagesTarget,
} from 'schema-pbta'

/*
 * The printed pages of a PbtA booklet and the room its notes have. Both come from schema-pbta: a
 * renamed page, a new face or a new capacity reaches the editor, the preview and the export without
 * an edit here. Every booklet that prints notes shares this one notes page, form and export rule.
 */
export { SESSION_NOTES_CAPACITY }

/** The sheet target that opens the notes in the editor panel. */
export const NOTES_TARGET = 'notes'

/** The field of the document the notes are written into. */
export const SESSION_NOTES_FIELD = 'sessionNotes'

type Notable = { sessionNotes?: string }

/** The pages the pack publishes for a booklet, in print order. */
export function playbookPages(
    target: PbtaPlaybookPagesTarget
): readonly PbtaPlaybookPage[] {
    const pages = getPbtaPlaybookPages(target)
    if (!pages) throw new Error(`schema-pbta publishes no pages for ${target}`)
    return pages
}

/** The page's name in the reader's language; any other language reads the English. */
export const pageLabel = (
    page: PbtaPlaybookPage,
    language: string | undefined = i18n.language
): string => (language?.startsWith('fr') ? page.label.fr : page.label.en)

/** The page that holds the notes: the one that declares the field they are written into. */
export const notesPageOf = (
    target: PbtaPlaybookPagesTarget
): PbtaPlaybookPage | undefined =>
    playbookPages(target).find((page) => page.notes_field)

/** The id of the page that prints the booklet's regions, for a booklet that is a single sheet. */
export const sheetPageIdOf = (target: PbtaPlaybookPagesTarget): string => {
    const page = playbookPages(target).find((candidate) => !candidate.notes_field)
    if (!page) throw new Error(`${target} publishes no sheet page`)
    return page.id
}

/** The export declaration of a booklet: its pages, the notes page marked as such. */
export const exportPagesOf = (
    target: PbtaPlaybookPagesTarget
): TemplateExportPage[] =>
    playbookPages(target).map((page) => ({
        id: page.id,
        label: { text: pageLabel(page) },
        notes: Boolean(page.notes_field),
    }))

/** The document without its notes, for an export the player wants to share. */
export function withoutSessionNotes<T extends Notable>(document: T): T {
    const rest = { ...document }
    delete rest.sessionNotes
    return rest
}

/** The document with its notes set; an empty text leaves the field out. */
export function withSessionNotes<T extends Notable>(
    document: T,
    notes: string
): T {
    const next = { ...document }
    if (notes === '') delete next.sessionNotes
    else next.sessionNotes = notes
    return next
}

/** The notes page, drawn after the faces on the paper of the booklet it belongs to. */
export function PlaybookNotesPage({
    target,
    value,
    className,
    style,
    onOpen,
}: {
    target: PbtaPlaybookPagesTarget
    value: string | undefined
    className?: string
    style?: CSSProperties
    onOpen?: () => void
}) {
    const page = notesPageOf(target)
    if (!page) return null
    return (
        <NotesPage
            id={page.id}
            title={pageLabel(page)}
            value={value}
            className={className}
            style={style}
            onOpen={onOpen}
        />
    )
}

/** The editor of the notes: free text held to the schema's capacity and to the page. */
export function SessionNotesPanel({
    value,
    onChange,
}: {
    value: string | undefined
    onChange: (notes: string) => void
}) {
    const text = useUiText()
    return (
        <section className="grid gap-3">
            <h3 className="font-semibold">{text('notes.heading')}</h3>
            <NotesForm
                label={text('notes.heading')}
                value={value ?? ''}
                capacity={SESSION_NOTES_CAPACITY}
                onChange={onChange}
            />
        </section>
    )
}
