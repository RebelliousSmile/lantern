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
import { useSprawlPlaybookStore, useSprawlSheetStore } from '../hooks'
import { regionById, type TheSprawlPlaybook } from '../model'

type Text = (key: TranslationKey) => string
type Document = Record<string, unknown>

/** Fields with a published collection presentation have the editor of their items. */
const COLLECTIONS = [
    'moves',
    'startingMoves',
    'gear',
    'missionGear',
    'cyberware',
    'directives',
    'directiveChoices',
    'advancement',
    'contacts',
]

/**
 * One descriptor per field a region of the presentation contract holds that
 * has no published collection, keyed by the path the contract gives it. A
 * region is edited by walking its `fields`.
 */
function descriptors(
    text: Text,
    stats: string[]
): Record<string, EditorDescriptor> {
    const name = (key: string) =>
        text(`pbta:sprawl.fields.${key}` as TranslationKey)
    const scalar = (
        id: string,
        kind: ScalarKind = 'text'
    ): EditorDescriptor => ({
        id,
        label: name(id),
        kind: 'scalar',
        scalar: kind,
    })
    const labelled = (id: string, valueKind: ScalarKind): EditorDescriptor => ({
        id,
        label: name(id),
        kind: 'collection',
        reorderable: true,
        createEmpty: () => (id === 'links' ? { value: 0 } : { label: '' }),
        item: {
            id: 'item',
            label: name(id),
            kind: 'object',
            fields: id === 'links'
                ? [
                      scalar('linkName'),
                      { ...scalar('value', valueKind), label: name('value') },
                  ]
                : [scalar('label'), scalar('value')],
        },
    })

    return {
        name: scalar('name'),
        characterName: scalar('characterName'),
        description: scalar('description', 'textarea'),
        look: labelled('look', 'text'),
        links: labelled('links', 'number'),
        stats: {
            id: 'stats',
            label: name('stats'),
            kind: 'object',
            fields: stats.map((key) => ({
                id: key,
                label: key,
                kind: 'scalar',
                scalar: 'number',
            })),
        },
        cred: scalar('cred', 'number'),
        xp: scalar('xp', 'number'),
        xpMax: scalar('xpMax', 'number'),
        hoursMarked: scalar('hoursMarked', 'number'),
    }
}

/** The document as an object holding one described field. */
const root = (descriptor: EditorDescriptor): ObjectDescriptor => ({
    id: 'root',
    label: '',
    kind: 'object',
    fields: [descriptor],
})

export function SprawlPlaybookEditorPanel() {
    const text = useUiText() as Text
    const { open, target } = useSprawlSheetStore()
    const { playbook, setPlaybook } = useSprawlPlaybookStore()
    if (!open || !target)
        return (
            <p className="text-sm text-muted-foreground">
                {text('pbta:sprawl.editor.hint')}
            </p>
        )
    const region = regionById(target.kind)
    /* Stat names are the keys of the document: the game definition names them. */
    const known = descriptors(text, Object.keys(playbook.stats))
    const document = playbook as Document
    const write = (next: Document) =>
        setPlaybook(next as Partial<TheSprawlPlaybook>)

    return (
        <div className="space-y-5">
            {(region?.fields ?? []).map((field) => {
                const descriptor = known[field]
                return (
                    <section key={field} className="space-y-2">
                        {COLLECTIONS.includes(field) ? (
                            <SprawlCollection path={field} />
                        ) : descriptor ? (
                            <SchemaEditor
                                schema={root(descriptor)}
                                value={document}
                                onChange={write}
                            />
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                {text('pbta:sprawl.editor.unknownField')} {field}
                            </p>
                        )}
                    </section>
                )
            })}
        </div>
    )
}

function SprawlCollection({ path }: { path: string }) {
    const text = useUiText() as Text
    const { playbook, setPlaybook } = useSprawlPlaybookStore()
    const presentation = getPbtaCollectionPresentation(
        'the-sprawl-playbook',
        path
    )
    const document = playbook as Document
    const items = presentation && collectionItems(document, presentation)
    if (!presentation || !items)
        return (
            <p className="text-sm text-destructive">
                {text('pbta:sprawl.editor.invalidCollection')}
            </p>
        )
    return (
        <section className="space-y-2">
            <h3 className="text-sm font-semibold">
                {text(`pbta:sprawl.fields.${path}` as TranslationKey)}
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
