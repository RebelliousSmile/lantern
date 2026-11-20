import type {
    TemplateExportAction,
    TemplateExportPage,
} from '@/core/templates/types'
import i18n from '@/i18n'
import { formatError } from '@/i18n/formatError'
import { toast } from 'sonner'
import { findPageNode } from './exportPages'

const PRINT_ROOT_ID = 'lantern-print-root'
const PRINT_STYLE_ID = 'lantern-print-pages'
const PRINTING_CLASS = 'lantern-printing'
const PAGE_ATTRIBUTE = 'data-print-page'

/** What a clone must lose so that the page node sits at the corner of its own printed page. */
const NEUTRAL_FRAME =
    'margin:0;padding:0;border:0;box-shadow:none;transform:none;width:auto;height:auto;min-height:0;max-height:none;position:static;overflow:visible'

type PrintTarget = { node: HTMLElement; width: number; height: number }

function removePrintArtefacts() {
    document.getElementById(PRINT_ROOT_ID)?.remove()
    document.getElementById(PRINT_STYLE_ID)?.remove()
    document.documentElement.classList.remove(PRINTING_CLASS)
}

/**
 * The preview with one page left in it: every other page node is dropped, the zoom and the frames
 * above the page are neutralised, and the ancestors that style the page (theme classes, tokens) stay.
 */
function isolatePage(root: HTMLElement, page: TemplateExportPage | null) {
    const clone = root.cloneNode(true) as HTMLElement
    if (!page) {
        clone.style.cssText += `;${NEUTRAL_FRAME}`
        return { clone, pageNode: clone }
    }
    const pageNode = findPageNode(clone, page)
    if (!pageNode) return { clone, pageNode: clone }
    /* Each level above the page keeps only the branch that leads to it; content that belongs to no page is not printed. */
    let child: HTMLElement = pageNode
    while (child !== clone && child.parentElement) {
        const parent: HTMLElement = child.parentElement
        for (const sibling of Array.from(parent.children))
            if (sibling !== child) sibling.remove()
        parent.style.cssText += `;${NEUTRAL_FRAME}`
        child = parent
    }
    pageNode.style.transform = 'none'
    return { clone, pageNode }
}

/**
 * Prints the pages natively: each page is cloned under `<body>` into a root of its own, sized
 * by a named `@page`, while `print.css` hides the rest of the application. Text stays text.
 */
export function printPages(
    root: HTMLElement,
    pages: readonly TemplateExportPage[]
) {
    removePrintArtefacts()

    const measure = (node: HTMLElement | null): PrintTarget => ({
        node: node as HTMLElement,
        width: node?.offsetWidth ?? 0,
        height: node?.offsetHeight ?? 0,
    })
    /* A template that declares no pages prints its whole preview as one page. */
    const targets: { target: PrintTarget; page: TemplateExportPage | null }[] =
        pages.length
            ? pages.map((page) => ({
                  page,
                  target: measure(findPageNode(root, page)),
              }))
            : [{ page: null, target: measure(root) }]
    if (targets.some(({ target }) => !target.node || target.width === 0))
        throw new Error(i18n.t('export.previewNotFound'))

    const sheet = document.createElement('style')
    sheet.id = PRINT_STYLE_ID
    const printRoot = document.createElement('div')
    printRoot.id = PRINT_ROOT_ID
    let rules = ''
    targets.forEach(({ target, page }, index) => {
        const name = `lantern-page-${index}`
        rules += `@page ${name} { size: ${target.width}px ${target.height}px; margin: 0 }\n`
        const wrapper = document.createElement('div')
        wrapper.setAttribute(PAGE_ATTRIBUTE, String(index))
        wrapper.style.cssText = `page:${name};width:${target.width}px;height:${target.height}px;overflow:hidden`
        const { clone } = isolatePage(root, page)
        wrapper.appendChild(clone)
        printRoot.appendChild(wrapper)
    })
    sheet.textContent = rules
    document.head.appendChild(sheet)
    document.body.appendChild(printRoot)
    document.documentElement.classList.add(PRINTING_CLASS)
    window.addEventListener('afterprint', removePrintArtefacts, { once: true })
    window.print()
}

/**
 * The PDF every template offers: the browser's own printing, one page per sheet page, so the text
 * stays selectable and no library is added. The player picks "Save as PDF" in the dialog.
 */
export function createPdfExportAction(): TemplateExportAction<
    unknown,
    unknown,
    unknown
> {
    return {
        id: 'pdf',
        label: 'export.pdf',
        buttonLabel: 'export.exportPdf',
        description: 'export.pdfDescription',
        run: ({ getPreviewNode, selection }) => {
            const node = getPreviewNode()
            if (!node) {
                toast.error(i18n.t('export.previewNotFound'))
                return
            }
            try {
                printPages(node, selection.pages)
            } catch (error) {
                removePrintArtefacts()
                toast.error(formatError(error, 'errors.exportPdfFailed'))
            }
        },
    }
}
