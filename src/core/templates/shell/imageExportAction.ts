import type { TemplateExportAction } from '@/core/templates/types'
import i18n from '@/i18n'
import { formatError } from '@/i18n/formatError'
import type { UiText } from '@/i18n/text'
import { snapdom, type CaptureResult } from '@zumer/snapdom'
import type { ReactNode } from 'react'
import { toast } from 'sonner'

type ExportableView = {
    exportPrefs: {
        scale: number
    }
}

/**
 * The one PNG export action every template's `export.actions` installs. Each
 * template supplies its own description and settings panel; the capture,
 * scaling and download logic is otherwise identical across all fourteen.
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
            view,
        }: {
            fileStem: string
            getPreviewNode: () => HTMLElement | null
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
                const snap: CaptureResult = await snapdom(node, {
                    scale: pixelRatio,
                    embedFonts: true,
                })

                await snap.download({
                    type: 'png',
                    filename: `${fileStem}@${pixelRatio}x.png`,
                })

                toast.success(i18n.t('export.exportedPng'))
            } catch (error) {
                toast.error(formatError(error, 'errors.exportPngFailed'))
            } finally {
                node.classList.remove('exporting')
            }
        },
    }
}
