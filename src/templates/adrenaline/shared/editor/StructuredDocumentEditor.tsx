import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { documentContracts } from '@/contracts/registry'
import { useActiveTemplateTab } from '@/core/workspace/selectors'
import { useWorkspaceStore } from '@/core/workspace/store'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { cloneValue } from '../model'

export function StructuredDocumentEditor({
    templateId,
    contractKey,
    title,
}: {
    templateId: string
    contractKey: string
    title: string
}) {
    const tab = useActiveTemplateTab<Record<string, unknown>>(templateId)
    const replaceTabDoc = useWorkspaceStore((state) => state.replaceTabDoc)
    const [source, setSource] = useState('')

    useEffect(() => {
        setSource(JSON.stringify(tab?.doc ?? {}, null, 2))
    }, [tab?.doc])

    const apply = () => {
        if (!tab) return
        try {
            const parsed = documentContracts
                .require<Record<string, unknown>>(contractKey)
                .schema.parse(JSON.parse(source))
            replaceTabDoc(tab.id, cloneValue(parsed))
            toast.success(`${title} updated.`)
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : `Unable to update ${title}.`
            )
        }
    }

    return (
        <div className="space-y-3 p-1">
            <div>
                <Label htmlFor={`${templateId}-document`}>Document data</Label>
                <p className="mt-1 text-xs text-muted-foreground">
                    Edit every schema field as structured JSON. Validation runs
                    before the preview is replaced.
                </p>
            </div>
            <Textarea
                className="min-h-96 font-mono text-xs"
                id={`${templateId}-document`}
                onChange={(event) => setSource(event.target.value)}
                spellCheck={false}
                value={source}
            />
            <Button className="w-full" onClick={apply} type="button">
                Apply document
            </Button>
        </div>
    )
}
