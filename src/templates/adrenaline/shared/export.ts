import { toast } from 'sonner'

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
    toast.success('Exported TOML.')
}
