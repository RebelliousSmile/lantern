import type {
    TemplateExportPage,
    TemplateExportSelection,
} from '@/core/templates/types'

/** The attribute a preview puts on the node of each page it declares. */
export const EXPORT_PAGE_ATTRIBUTE = 'data-export-page'

export type PageChoice = {
    /** One chosen page, or every page. */
    scope: 'one' | 'all'
    /** The page to export when `scope` is `one`; the first page when it names none. */
    pageId?: string
    /** Keep the session-notes page; unticked, it leaves every export. */
    includeNotes: boolean
    /** PNG only: every page in one archive. */
    archive?: boolean
}

/** The pages an export covers: notes dropped when unticked, one page when one is chosen. */
export function selectPages(
    pages: readonly TemplateExportPage[],
    choice: PageChoice
): TemplateExportSelection {
    const kept = pages.filter((page) => choice.includeNotes || !page.notes)
    if (choice.scope === 'all')
        return {
            pages: kept,
            archive: choice.archive !== false && kept.length > 1,
        }
    const chosen = kept.find((page) => page.id === choice.pageId) ?? kept[0]
    return { pages: chosen ? [chosen] : [], archive: false }
}

/** The preview node of a page, or null when the preview does not draw it. */
export function findPageNode(
    root: HTMLElement,
    page: TemplateExportPage
): HTMLElement | null {
    const nodes = root.querySelectorAll<HTMLElement>(`[${EXPORT_PAGE_ATTRIBUTE}]`)
    for (const node of Array.from(nodes))
        if (node.getAttribute(EXPORT_PAGE_ATTRIBUTE) === page.id) return node
    return null
}

/** A page id as the ASCII a file name may carry. */
export function pageSlug(page: TemplateExportPage) {
    const slug = page.id
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    return slug || 'page'
}

/** The numbered form an archive entry carries, so the files sort in sheet order. */
export function numberedPageSlug(page: TemplateExportPage, index: number) {
    return `${String(index + 1).padStart(2, '0')}-${pageSlug(page)}`
}
