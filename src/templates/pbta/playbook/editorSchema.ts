import type { TemplateEditorSchema } from '@/core/editor-schema/types'

export const playbookEditorSchema: TemplateEditorSchema = {
    id: 'playbook',
    label: 'Playbook',
    kind: 'object',
    fields: [
        { id: 'name', label: 'Playbook name', kind: 'scalar', scalar: 'text' },
        { id: 'slug', label: 'Slug', kind: 'scalar', scalar: 'text' },
        { id: 'game', label: 'Game id', kind: 'scalar', scalar: 'text' },
        {
            id: 'description',
            label: 'Description',
            kind: 'scalar',
            scalar: 'textarea',
        },
    ],
}
