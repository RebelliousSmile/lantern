import type { TemplateExportAction } from '@/core/templates/types'
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
    description: string
    renderSettings: () => ReactNode
}): TemplateExportAction<unknown, TView, unknown> {
    return {
        id: 'png',
        label: 'PNG',
        buttonLabel: 'Export PNG',
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
                toast.error(
                    'Preview not found. Make sure the preview is visible.'
                )
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

                toast.success('Exported PNG.')
            } catch (errorAny: any) {
                toast.error(errorAny?.message || 'Failed to export PNG.')
            } finally {
                node.classList.remove('exporting')
            }
        },
    }
}
