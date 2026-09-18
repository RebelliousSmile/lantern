import type { TemplateExportAction } from '@/core/templates/types'
import i18n from '@/i18n'
import { formatError } from '@/i18n/formatError'
import type { UiText } from '@/i18n/text'
import { toast } from 'sonner'

/** Saves already-serialised TOML as `<fileStem>.toml` and confirms it. */
export function downloadToml(toml: string, fileStem: string) {
    const blob = new Blob([toml], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${fileStem}.toml`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
    toast.success(i18n.t('export.exportedToml'))
}

/**
 * The TOML export action most templates install. Serialisation is the template's; the download,
 * the toasts and the error wording are the same everywhere.
 */
export function createTomlExportAction<TDoc>(options: {
    exportToml: (doc: TDoc) => string
    description: UiText
}): TemplateExportAction<TDoc, unknown, unknown> {
    return {
        id: 'toml',
        label: 'export.toml',
        buttonLabel: 'export.exportToml',
        description: options.description,
        run: ({ doc, fileStem }: { doc: TDoc; fileStem: string }) => {
            try {
                downloadToml(options.exportToml(doc), fileStem)
            } catch (error) {
                toast.error(formatError(error, 'errors.exportTomlFailed'))
            }
        },
    }
}
