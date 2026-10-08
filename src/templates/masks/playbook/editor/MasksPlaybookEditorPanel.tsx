import { SchemaEditor } from '@/core/editor-schema/SchemaEditor'
import type {
    EditorDescriptor,
    ObjectDescriptor,
    ScalarKind,
} from '@/core/editor-schema/types'
import { useUiText, type TranslationKey } from '@/i18n/text'
import { PublishedCollectionEditor } from '@/templates/pbta/specialized/collectionAdapters'
import {
    collectionItems,
    replaceCollectionItems,
} from '@/templates/pbta/specialized/collectionPolicy'
import { getPbtaCollectionPresentation } from 'schema-pbta'
import { useMasksPlaybookStore, useMasksSheetStore } from '../hooks'
import { regionById, type MasksPlaybook } from '../model'

type Text = (key: TranslationKey) => string
type Document = Record<string, unknown>

/** Fields with a published collection presentation have the editor of their items. */
const COLLECTIONS = [
    'backstory',
    'relationships',
    'influence',
    'influenceOptions',
    'conditions',
    'moves',
    'advancement',
    'drives.intro',
    'drives.options',
]

/**
 * One descriptor per scalar field a region of the presentation contract holds,
 * keyed by the path the contract gives it. A region is edited by walking its
 * `fields`: what the contract places on the sheet is what can be edited.
 */
function descriptors(
    text: Text,
    labels: string[]
): Record<string, EditorDescriptor> {
    const name = (key: string) =>
        text(`pbta:masks.fields.${key}` as TranslationKey)
    const scalar = (id: string, kind: ScalarKind = 'text'): EditorDescriptor => ({
        id,
        label: name(id),
        kind: 'scalar',
        scalar: kind,
    })
    const object = (
        id: string,
        fields: EditorDescriptor[],
        label = name(id)
    ): ObjectDescriptor => ({ id, label, kind: 'object', fields })
    const byLabel = (id: string, fields: (key: string) => EditorDescriptor[]) =>
        object(
            id,
            labels.map((key) => object(key, fields(key), key))
        )

    return {
        name: scalar('name'),
        heroName: scalar('heroName'),
        description: scalar('description', 'textarea'),
        realName: scalar('realName'),
        abilities: scalar('abilities', 'textarea'),
        demeanor: scalar('demeanor'),
        playbookImage: scalar('playbookImage'),
        stats: object(
            'stats',
            labels.map((key) => ({
                id: key,
                label: key,
                kind: 'scalar',
                scalar: 'number',
            }))
        ),
        statRanges: byLabel('statRanges', () => [
            scalar('min', 'number'),
            scalar('max', 'number'),
        ]),
        momentOfTruth: scalar('momentOfTruth', 'textarea'),
        momentUnlocked: scalar('momentUnlocked', 'boolean'),
        potential: scalar('potential', 'number'),
        potentialMax: scalar('potentialMax', 'number'),
    }
}

/** The document as an object holding one described field. */
const root = (descriptor: EditorDescriptor): ObjectDescriptor => ({
    id: 'root',
    label: '',
    kind: 'object',
    fields: [descriptor],
})

export function MasksPlaybookEditorPanel() {
    const text = useUiText() as Text
    const { open, target } = useMasksSheetStore()
    const { playbook, setPlaybook } = useMasksPlaybookStore()
    if (!open || !target)
        return (
            <p className="text-sm text-muted-foreground">
                {text('pbta:masks.editor.hint')}
            </p>
        )
    const region = regionById(target.kind)
    /* Labels are the keys of the document: the game definition names them. */
    const known = descriptors(text, Object.keys(playbook.stats))
    const document = playbook as Document
    const write = (next: Document) =>
        setPlaybook(next as Partial<MasksPlaybook>)

    return (
        <div className="space-y-5">
            {(region?.fields ?? []).map((field) => {
                const descriptor = known[field]
                return (
                    <section key={field} className="space-y-2">
                        {COLLECTIONS.includes(field) ? (
                            <MasksCollection path={field} />
                        ) : descriptor ? (
                            <SchemaEditor
                                schema={root(descriptor)}
                                value={document}
                                onChange={write}
                            />
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                {text('pbta:masks.editor.unknownField')} {field}
                            </p>
                        )}
                    </section>
                )
            })}
        </div>
    )
}

function MasksCollection({ path }: { path: string }) {
    const text = useUiText() as Text
    const { playbook, setPlaybook } = useMasksPlaybookStore()
    const presentation = getPbtaCollectionPresentation('masks-playbook', path)
    const document = playbook as Document
    const items = presentation && collectionItems(document, presentation)
    if (!presentation || !items)
        return (
            <p className="text-sm text-destructive">
                {text('pbta:masks.editor.invalidCollection')}
            </p>
        )
    return (
        <section className="space-y-2">
            <h3 className="text-sm font-semibold">
                {text(
                    `pbta:masks.fields.${path.replace('.', '_')}` as TranslationKey
                )}
            </h3>
            <PublishedCollectionEditor
                presentation={presentation}
                items={items}
                onChange={(next) =>
                    setPlaybook(
                        replaceCollectionItems(
                            document,
                            presentation,
                            next
                        ) as Partial<typeof playbook>
                    )
                }
            />
        </section>
    )
}
