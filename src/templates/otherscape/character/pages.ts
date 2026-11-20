import {
    OTHERSCAPE_CHARACTER_PAGES,
    SESSION_NOTES_CAPACITY,
} from 'schema-in-the-mist'

/*
 * The pages of the sheet, in print order, and the room its notes have. Both are published by the
 * schema: a renamed page or a new capacity reaches the editor, the preview and the export without
 * an edit here.
 */
export { OTHERSCAPE_CHARACTER_PAGES, SESSION_NOTES_CAPACITY }

type Page = (typeof OTHERSCAPE_CHARACTER_PAGES)[number]

/** The notes page declares the field the player writes into; the others declare what they print. */
export const isNotesPage = (page: Page): boolean => 'notes_field' in page

/** The page's name in the reader's language; any other language reads the English. */
export const pageLabel = (page: Page, language: string | undefined): string =>
    language?.startsWith('fr') ? page.label.fr : page.label.en

/** Whether the page prints the field. */
export const pagePrints = (page: Page, field: string): boolean =>
    'fields' in page && (page.fields as readonly string[]).includes(field)
