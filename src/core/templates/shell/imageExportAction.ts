import type {
    TemplateExportAction,
    TemplateExportSelection,
} from '@/core/templates/types'
import i18n from '@/i18n'
import { formatError } from '@/i18n/formatError'
import type { UiText } from '@/i18n/text'
import { snapdom, type CaptureResult } from '@zumer/snapdom'
import type { ReactNode } from 'react'
import { toast } from 'sonner'
import { createZip, downloadBlob } from './archiveExport'
import { findPageNode, numberedPageSlug, pageSlug } from './exportPages'

type ExportableView = {
    exportPrefs: {
        scale: number
    }
}

/**
 * The one PNG export action every template's `export.actions` installs. Each
 * template supplies its own description and settings panel; the capture,
 * scaling and download logic is otherwise identical across every template.
 */
export function createImageExportAction<TView extends ExportableView>(options: {
    description: UiText
    renderSettings: () => ReactNode
}): TemplateExportAction<unknown, TView, unknown> {
    return {
        id: 'png',
        label: 'export.png',
        buttonLabel: 'export.exportPng',
        description: options.description,
        renderSettings: options.renderSettings,
        run: async ({
            fileStem,
            getPreviewNode,
            selection,
            view,
        }: {
            fileStem: string
            getPreviewNode: () => HTMLElement | null
            selection: TemplateExportSelection
            view: TView
        }) => {
            const node = getPreviewNode()
            if (!node) {
                toast.error(i18n.t('export.previewNotFound'))
                return
            }

            node.classList.add('exporting')
            try {
                const pixelRatio = Number(view.exportPrefs.scale) || 1
                const capture = (target: HTMLElement) =>
                    snapdom(target, { scale: pixelRatio, embedFonts: true })

                /* A template without pages is one image of the whole preview. */
                if (selection.pages.length === 0) {
                    const snap: CaptureResult = await capture(node)
                    await snap.download({
                        type: 'png',
                        filename: `${fileStem}@${pixelRatio}x.png`,
                    })
                    toast.success(i18n.t('export.exportedPng'))
                    return
                }

                const targets = selection.pages.map((page, index) => ({
                    page,
                    index,
                    node: findPageNode(node, page),
                }))
                const missing = targets.find((target) => !target.node)
                if (missing) {
                    toast.error(i18n.t('export.previewNotFound'))
                    return
                }

                if (!selection.archive) {
                    const [{ page, node: pageNode }] = targets
                    const snap = await capture(pageNode as HTMLElement)
                    await snap.download({
                        type: 'png',
                        filename: `${fileStem}-${pageSlug(page)}@${pixelRatio}x.png`,
                    })
                    toast.success(i18n.t('export.exportedPng'))
                    return
                }

                const entries = []
                for (const { page, index, node: pageNode } of targets) {
                    const snap = await capture(pageNode as HTMLElement)
                    const blob = await snap.toBlob({ type: 'png' })
                    entries.push({
                        name: `${fileStem}-${numberedPageSlug(page, index)}.png`,
                        data: new Uint8Array(await blob.arrayBuffer()),
                    })
                }
                downloadBlob(
                    new Blob([createZip(entries)], { type: 'application/zip' }),
                    `${fileStem}@${pixelRatio}x.zip`
                )
                toast.success(i18n.t('export.exportedArchive'))
            } catch (error) {
                toast.error(formatError(error, 'errors.exportPngFailed'))
            } finally {
                node.classList.remove('exporting')
            }
        },
    }
}
