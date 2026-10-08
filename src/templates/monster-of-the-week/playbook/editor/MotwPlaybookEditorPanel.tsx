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
import { useMotwPlaybookStore, useMotwSheetStore } from '../hooks'
import { regionById, type MonsterOfTheWeekPlaybook } from '../model'

type Text = (key: TranslationKey) => string
type Document = Record<string, unknown>

/** Fields with a published collection presentation have the editor of their items. */
const COLLECTIONS = [
    'moves',
    'startingMoves',
    'statChoices',
    'look',
    'introductions',
    'history',
    'improvements',
    'advancements',
    'notes',
]

/**
 * One descriptor per scalar field a region of the presentation contract holds,
 * keyed by the path the contract gives it. A region is edited by walking its
 * `fields`: what the contract places on the sheet is what can be edited.
 */
function descriptors(
    text: Text,
    stats: string[],
    ratings: string[]
): Record<string, EditorDescriptor> {
    const name = (key: string) =>
        text(`pbta:motw.fields.${key}` as TranslationKey)
    const scalar = (
        id: string,
        kind: ScalarKind = 'text'
    ): EditorDescriptor => ({
        id,
        label: name(id),
        kind: 'scalar',
        scalar: kind,
    })
    const numbers = (id: string, keys: string[]): ObjectDescriptor => ({
        id,
        label: name(id),
        kind: 'object',
        fields: keys.map((key) => ({
            id: key,
            label: key,
            kind: 'scalar',
            scalar: 'number',
        })),
    })

    return {
        name: scalar('name'),
        heroName: scalar('heroName'),
        description: scalar('description', 'textarea'),
        stats: numbers('stats', stats),
        ratings: numbers('ratings', ratings),
        luckMax: scalar('luckMax', 'number'),
        luckMarked: scalar('luckMarked', 'number'),
        harmMax: scalar('harmMax', 'number'),
        harmMarked: scalar('harmMarked', 'number'),
        unstable: scalar('unstable', 'boolean'),
        experienceMax: scalar('experienceMax', 'number'),
        experienceMarked: scalar('experienceMarked', 'number'),
        specialWeapon: scalar('specialWeapon', 'textarea'),
    }
}

/** The document as an object holding one described field. */
const root = (descriptor: EditorDescriptor): ObjectDescriptor => ({
    id: 'root',
    label: '',
    kind: 'object',
    fields: [descriptor],
})

export function MotwPlaybookEditorPanel() {
    const text = useUiText() as Text
    const { open, target } = useMotwSheetStore()
    const { playbook, setPlaybook } = useMotwPlaybookStore()
    if (!open || !target)
        return (
            <p className="text-sm text-muted-foreground">
                {text('pbta:motw.editor.hint')}
            </p>
        )
    const region = regionById(target.kind)
    /* Stat and rating names are the keys of the document: the game definition names them. */
    const known = descriptors(
        text,
        Object.keys(playbook.stats),
        Object.keys(playbook.ratings ?? {})
    )
    const document = playbook as Document
    const write = (next: Document) =>
        setPlaybook(next as Partial<MonsterOfTheWeekPlaybook>)

    return (
        <div className="space-y-5">
            {(region?.fields ?? []).map((field) => {
                const descriptor = known[field]
                return (
                    <section key={field} className="space-y-2">
                        {COLLECTIONS.includes(field) ? (
                            <MotwCollection path={field} />
                        ) : descriptor ? (
                            <SchemaEditor
                                schema={root(descriptor)}
                                value={document}
                                onChange={write}
                            />
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                {text('pbta:motw.editor.unknownField')} {field}
                            </p>
                        )}
                    </section>
                )
            })}
        </div>
    )
}

function MotwCollection({ path }: { path: string }) {
    const text = useUiText() as Text
    const { playbook, setPlaybook } = useMotwPlaybookStore()
    const presentation = getPbtaCollectionPresentation(
        'monster-of-the-week-playbook',
        path
    )
    const document = playbook as Document
    const items = presentation && collectionItems(document, presentation)
    if (!presentation || !items)
        return (
            <p className="text-sm text-destructive">
                {text('pbta:motw.editor.invalidCollection')}
            </p>
        )
    return (
        <section className="space-y-2">
            <h3 className="text-sm font-semibold">
                {text(`pbta:motw.fields.${path}` as TranslationKey)}
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
