import { SchemaEditor } from '@/core/editor-schema/SchemaEditor'
import type { TemplateEditorSchema } from '@/core/editor-schema/types'
import { useUiText } from '@/i18n/text'
import { useMemo } from 'react'
import { playbookEditorSchema } from '../../editorSchema'
import { usePlaybookStore } from '../../hooks'

export default function BasicForm() {
    const { playbook, setPlaybook } = usePlaybookStore()
    const text = useUiText()
    const schema = useMemo(
        (): TemplateEditorSchema => ({
            ...playbookEditorSchema,
            label: text('pbta:forms.playbook.basic.title'),
            fields: playbookEditorSchema.fields.map((field) => ({
                ...field,
                label: text(
                    (
                        {
                            name: 'pbta:forms.playbook.basic.name',
                            slug: 'pbta:forms.playbook.basic.slug',
                            game: 'pbta:forms.playbook.basic.game',
                            description: 'fields.description',
                        } as const
                    )[field.id as 'name' | 'slug' | 'game' | 'description']
                ),
            })),
        }),
        [text]
    )
    return (
        <SchemaEditor schema={schema} value={playbook} onChange={setPlaybook} />
    )
}
