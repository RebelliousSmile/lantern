import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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

    const patchSource = (
        patch: (document: Record<string, unknown>) => void
    ) => {
        try {
            const document = JSON.parse(source) as Record<string, unknown>
            patch(document)
            setSource(JSON.stringify(document, null, 2))
        } catch {
            toast.error('Fix the JSON document before using the quick fields.')
        }
    }

    const document = (() => {
        try {
            return JSON.parse(source) as Record<string, unknown>
        } catch {
            return {}
        }
    })()
    const characteristics = (document.caracteristiques ?? {}) as Record<
        string,
        number
    >

    return (
        <div className="space-y-3 p-1">
            <div className="grid gap-2">
                <Label htmlFor={`${templateId}-name`}>Name</Label>
                <Input
                    id={`${templateId}-name`}
                    onChange={(event) =>
                        patchSource((next) => {
                            next.nom = event.target.value
                        })
                    }
                    value={typeof document.nom === 'string' ? document.nom : ''}
                />
            </div>
            {'description' in document ? (
                <div className="grid gap-2">
                    <Label htmlFor={`${templateId}-description`}>
                        Description
                    </Label>
                    <Textarea
                        id={`${templateId}-description`}
                        onChange={(event) =>
                            patchSource((next) => {
                                next.description = event.target.value
                            })
                        }
                        value={
                            typeof document.description === 'string'
                                ? document.description
                                : ''
                        }
                    />
                </div>
            ) : null}
            <div className="grid grid-cols-2 gap-2">
                {Object.keys(characteristics).map((key) => (
                    <label className="grid gap-1 text-xs font-medium" key={key}>
                        {key.toUpperCase()}
                        <Input
                            min={0}
                            onChange={(event) =>
                                patchSource((next) => {
                                    const nextCharacteristics = {
                                        ...((next.caracteristiques ??
                                            {}) as Record<string, number>),
                                        [key]: Number(event.target.value) || 0,
                                    }
                                    next.caracteristiques = nextCharacteristics
                                })
                            }
                            type="number"
                            value={characteristics[key]}
                        />
                    </label>
                ))}
            </div>
            <div>
                <Label htmlFor={`${templateId}-document`}>Document data</Label>
                <p className="mt-1 text-xs text-muted-foreground">
                    Quick fields cover the header and characteristics. Edit the
                    full structured JSON for every other schema field.
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
