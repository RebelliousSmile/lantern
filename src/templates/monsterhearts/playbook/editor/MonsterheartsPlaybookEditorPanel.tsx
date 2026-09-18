import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SchemaEditor } from '@/core/editor-schema/SchemaEditor'
import { inferObject } from '@/core/editor-schema/inferSchema'
import { useMonsterheartsSheet, useMonsterheartsStore } from '../hooks'
import type { MonsterheartsEditorial } from '../model'

export function MonsterheartsPlaybookEditorPanel() {
    const { sheet } = useMonsterheartsSheet()
    const { playbook, setPlaybook } = useMonsterheartsStore()
    if (!sheet.open || !sheet.target)
        return (
            <p className="text-sm text-muted-foreground">
                Click a skin section to edit it.
            </p>
        )
    if (sheet.target === 'basic')
        return (
            <div className="space-y-3">
                <Label>
                    Name
                    <Input
                        value={playbook.name}
                        onChange={(event) =>
                            setPlaybook({ name: event.target.value })
                        }
                    />
                </Label>
                <Label>
                    Description
                    <Textarea
                        value={playbook.description}
                        onChange={(event) =>
                            setPlaybook({ description: event.target.value })
                        }
                    />
                </Label>
            </div>
        )
    if (sheet.target === 'editorial') {
        const updateBlock = (
            key: keyof MonsterheartsEditorial,
            patch: Partial<MonsterheartsEditorial[keyof MonsterheartsEditorial]>
        ) =>
            setPlaybook({
                editorial: {
                    ...playbook.editorial,
                    [key]: { ...playbook.editorial[key], ...patch },
                },
            })

        return (
            <div className="space-y-5">
                {Object.entries(playbook.editorial).map(([key, block]) => (
                    <fieldset key={key} className="space-y-2">
                        <legend className="font-semibold">
                            {block.heading}
                        </legend>
                        <Label>
                            Title
                            <Input
                                value={block.heading}
                                onChange={(event) =>
                                    updateBlock(
                                        key as keyof MonsterheartsEditorial,
                                        { heading: event.target.value }
                                    )
                                }
                            />
                        </Label>
                        <Label>
                            Text
                            <Textarea
                                value={block.paragraphs.join('\n\n')}
                                onChange={(event) =>
                                    updateBlock(
                                        key as keyof MonsterheartsEditorial,
                                        {
                                            paragraphs: event.target.value
                                                .split(/\n\s*\n/)
                                                .filter(Boolean),
                                        }
                                    )
                                }
                            />
                        </Label>
                    </fieldset>
                ))}
            </div>
        )
    }
    const key = sheet.target
    const value = (playbook as Record<string, unknown>)[key]
    return (
        <SchemaEditor
            schema={inferObject(key, value as Record<string, unknown>)}
            value={(value as Record<string, unknown>) ?? {}}
            onChange={(next) =>
                setPlaybook({ [key]: next } as Partial<typeof playbook>)
            }
        />
    )
}
