import { SchemaEditor } from '@/core/editor-schema/SchemaEditor'
import { playbookEditorSchema } from '../../editorSchema'
import { usePlaybookStore } from '../../hooks'

export default function BasicForm() {
    const { playbook, setPlaybook } = usePlaybookStore()
    return (
        <SchemaEditor
            schema={playbookEditorSchema}
            value={playbook}
            onChange={setPlaybook}
        />
    )
}
