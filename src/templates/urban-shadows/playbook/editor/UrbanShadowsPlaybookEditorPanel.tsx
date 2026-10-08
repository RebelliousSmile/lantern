import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { SchemaEditor } from '@/core/editor-schema/SchemaEditor'
import { inferObject } from '@/core/editor-schema/inferSchema'
import type {
    EditorDescriptor,
    ObjectDescriptor,
    ScalarKind,
} from '@/core/editor-schema/types'
import { useUiText, type TranslationKey } from '@/i18n/text'
import { useGameDefinitionForGame } from '@/templates/pbta/shared/gameDefinition'
import { PublishedCollectionEditor } from '@/templates/pbta/specialized/collectionAdapters'
import {
    collectionItems,
    replaceCollectionItems,
} from '@/templates/pbta/specialized/collectionPolicy'
import { useState, type ReactNode } from 'react'
import { getPbtaCollectionPresentation } from 'schema-pbta'
import {
    useUrbanShadowsPlaybookStore,
    useUrbanShadowsSheetStore,
} from '../hooks'
import { regionById, type UrbanShadowsPlaybook } from '../model'

type Text = (key: TranslationKey) => string
type Document = Record<string, unknown>

const STATS = ['blood', 'heart', 'mind', 'spirit']
const CIRCLES = ['mortalis', 'night', 'power', 'wild']

/**
 * One descriptor per field a region of the presentation contract holds, keyed
 * by the path the contract gives it. A region is edited by walking its
 * `fields`: what the contract places on the sheet is what can be edited.
 */
function descriptors(text: Text): Record<string, EditorDescriptor> {
    const name = (key: string) =>
        text(`pbta:urbanShadows.fields.${key}` as TranslationKey)
    const term = (key: string) =>
        text(`pbta:urbanShadows.terms.${key}` as TranslationKey)
    const scalar = (
        id: string,
        kind: ScalarKind = 'text',
        label = name(id)
    ): EditorDescriptor => ({ id, label, kind: 'scalar', scalar: kind })
    const object = (
        id: string,
        fields: EditorDescriptor[],
        label = name(id)
    ): ObjectDescriptor => ({ id, label, kind: 'object', fields })
    const list = (
        id: string,
        item: EditorDescriptor,
        createEmpty: () => unknown
    ): EditorDescriptor => ({
        id,
        label: name(id),
        kind: 'collection',
        item,
        createEmpty,
        reorderable: true,
    })
    const strings = (id: string, kind: ScalarKind = 'text') =>
        list(id, scalar('item', kind, name('item')), () => '')
    const records = (id: string, fields: EditorDescriptor[]) =>
        list(id, object('item', fields, name('item')), () => ({}))
    const numbers = (
        id: string,
        keys: string[],
        label: (key: string) => string
    ) =>
        object(
            id,
            keys.map((key) => scalar(key, 'number', label(key)))
        )
    const editorial = (id: string) =>
        object('editorial', [
            object(id, [
                scalar('heading'),
                list(
                    'paragraphs',
                    scalar('item', 'textarea', name('paragraph')),
                    () => ''
                ),
            ]),
        ])

    return {
        name: scalar('name'),
        description: scalar('description', 'textarea'),
        playbookImage: scalar('playbookImage'),
        'editorial.opening': editorial('opening'),
        'editorial.identity': editorial('identity'),
        'editorial.progression': editorial('progression'),
        'editorial.playAdvice': editorial('playAdvice'),
        stats: numbers('stats', [...STATS, ...CIRCLES], term),
        statsDetail: scalar('statsDetail', 'textarea'),
        statuses: numbers('statuses', CIRCLES, term),
        startingMoves: strings('startingMoves'),
        advancementCircles: strings('advancementCircles'),
        laterAdvancement: records('laterAdvancement', [
            scalar('label'),
            scalar('checked', 'boolean'),
        ]),
        harm: numbers(
            'harm',
            ['armor', 'faint', 'serious', 'critical'],
            (key) => text(`pbta:urbanShadows.harm.${key}` as TranslationKey)
        ),
        scars: records('scars', [
            scalar('name'),
            scalar('stat'),
            scalar('modifier', 'number'),
        ]),
        letItOut: strings('letItOut', 'textarea'),
        debts: strings('debts'),
        endMove: scalar('endMove', 'textarea'),
        intimacy: scalar('intimacy', 'textarea'),
        creation: records('creation', [
            scalar('label'),
            scalar('attribute'),
            object('selection', [
                scalar('min', 'number'),
                scalar('max', 'number'),
            ]),
            records('options', [scalar('value'), scalar('label')]),
        ]),
        statProfiles: records('statProfiles', [
            scalar('key'),
            scalar('label'),
            numbers('stats', STATS, term),
        ]),
        choiceSets: records('choiceSets', [
            scalar('title'),
            scalar('description', 'textarea'),
            scalar('type'),
            scalar('repeatable', 'boolean'),
            scalar('grantOn'),
            records('choices', [scalar('ref')]),
        ]),
        mortalRelationships: records('mortalRelationships', [
            scalar('key'),
            scalar('label'),
            scalar('description', 'textarea'),
        ]),
        extras: records('extras', [
            scalar('key'),
            scalar('label'),
            scalar('text', 'textarea'),
            strings('items'),
        ]),
        gear: records('gear', [
            scalar('name'),
            scalar('equipmentType'),
            scalar('description', 'textarea'),
            scalar('quantity', 'number'),
            strings('tags'),
        ]),
        corruption: object('corruption', [
            scalar(
                'trigger',
                'textarea',
                text('pbta:urbanShadows.corruption.trigger')
            ),
            scalar(
                'track',
                'number',
                text('pbta:urbanShadows.corruption.track')
            ),
        ]),
    }
}

/** The document as an object holding one described field. */
const root = (descriptor: EditorDescriptor): ObjectDescriptor => ({
    id: 'root',
    label: '',
    kind: 'object',
    fields: [descriptor],
})

/** A creation option may be a bare string; the editor shows every option as value and label. */
function withLabelledOptions(playbook: UrbanShadowsPlaybook): Document {
    return {
        ...playbook,
        creation: (playbook.creation ?? []).map((question) => ({
            ...question,
            options: question.options.map((option) =>
                typeof option === 'string'
                    ? { value: option, label: option }
                    : option
            ),
        })),
    }
}

export function UrbanShadowsPlaybookEditorPanel() {
    const text = useUiText() as Text
    const { open, target } = useUrbanShadowsSheetStore()
    const { playbook, setPlaybook } = useUrbanShadowsPlaybookStore()
    if (!open || !target)
        return (
            <p className="text-sm text-muted-foreground">
                {text('pbta:urbanShadows.editor.hint')}
            </p>
        )
    const region = regionById(
        target.kind === 'basic' ? 'game-identity' : target.kind
    )
    const known = descriptors(text)
    const document = playbook as Document
    const write = (next: Document) =>
        setPlaybook(next as Partial<UrbanShadowsPlaybook>)

    /* Fields with a published collection presentation, or more than one part, have their own editor. */
    const custom: Record<string, () => ReactNode> = {
        moves: () => <UrbanCollection path="moves" />,
        advancement: () => <UrbanCollection path="advancement" />,
        corruption: () => (
            <>
                <SchemaEditor
                    schema={root(known.corruption)}
                    value={document}
                    onChange={write}
                />
                <UrbanCollection path="corruption.advances" />
                <UrbanCollection path="corruption.moves" />
            </>
        ),
        creation: () => (
            <>
                <UrbanShadowsCreationForm />
                <SchemaEditor
                    schema={root(known.creation)}
                    value={withLabelledOptions(playbook)}
                    onChange={(next) => write({ creation: next.creation })}
                />
            </>
        ),
        /* Attributes are keyed by the game definition: their shape is read from the document. */
        attributes: () => (
            <SchemaEditor
                schema={inferObject('root', {
                    attributes: playbook.attributes ?? {},
                })}
                value={document}
                onChange={write}
            />
        ),
    }

    return (
        <div className="space-y-5">
            {(region?.fields ?? []).map((field) => {
                const key = field.split('.')[0]
                const descriptor = known[field]
                return (
                    <section key={field} className="space-y-2">
                        {custom[field]?.() ??
                            (descriptor ? (
                                <SchemaEditor
                                    schema={root(descriptor)}
                                    value={document}
                                    onChange={write}
                                />
                            ) : (
                                /* A field the contract added since: edited by its shape until it gets a descriptor. */
                                <SchemaEditor
                                    schema={inferObject('root', {
                                        [key]: document[key] ?? '',
                                    })}
                                    value={document}
                                    onChange={write}
                                />
                            ))}
                    </section>
                )
            })}
        </div>
    )
}

function UrbanCollection({ path }: { path: string }) {
    const text = useUiText() as Text
    const { playbook, setPlaybook } = useUrbanShadowsPlaybookStore()
    const presentation = getPbtaCollectionPresentation(
        'urban-shadows-playbook',
        path
    )
    const document = playbook as Document
    const items = presentation && collectionItems(document, presentation)
    if (!presentation || !items)
        return (
            <p className="text-sm text-destructive">
                {text('pbta:urbanShadows.editor.invalidCollection')}
            </p>
        )
    const heading: Record<string, TranslationKey> = {
        moves: 'pbta:urbanShadows.fields.moves',
        advancement: 'pbta:urbanShadows.fields.advancement',
        'corruption.advances': 'pbta:urbanShadows.corruption.advances',
        'corruption.moves': 'pbta:urbanShadows.corruption.moves',
    }
    return (
        <section className="space-y-2">
            <h3 className="text-sm font-semibold">{text(heading[path])}</h3>
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

/** Answers a creation question into the attribute it targets. */
function UrbanShadowsCreationForm() {
    const text = useUiText() as Text
    const { playbook, setPlaybook } = useUrbanShadowsPlaybookStore()
    const game = useGameDefinitionForGame(playbook.game)
    const [answers, setAnswers] = useState<Record<number, string[]>>({})
    const questions = playbook.creation ?? []
    if (!questions.length) return null
    if (!game)
        return (
            <p className="text-sm text-muted-foreground">
                {text('pbta:urbanShadows.editor.gameRequired')}
            </p>
        )

    return (
        <div className="space-y-4">
            {questions.map((question, index) => {
                const selected = answers[index] ?? []
                const min = question.selection?.min ?? 1
                const max = question.selection?.max ?? 1
                const target = question.attribute
                    ? game.character.attributes?.[question.attribute]
                    : undefined
                const validDestination = max > 1 && target?.type === 'ListMany'
                const selectedWithinBounds =
                    selected.length >= min && selected.length <= max
                const choose = (next: string[]) =>
                    setAnswers({ ...answers, [index]: next })
                const apply = () => {
                    if (
                        !question.attribute ||
                        !validDestination ||
                        !selectedWithinBounds
                    )
                        return
                    setPlaybook({
                        attributes: {
                            ...playbook.attributes,
                            [question.attribute]: selected,
                        },
                    })
                }

                return (
                    <fieldset
                        key={index}
                        className="space-y-2 rounded-md border p-3"
                    >
                        <legend className="px-1 text-sm font-medium">
                            {question.label}
                        </legend>
                        {question.options.map((option) => {
                            const value =
                                typeof option === 'string'
                                    ? option
                                    : option.value
                            const label =
                                typeof option === 'string'
                                    ? option
                                    : option.label
                            const relationship = (
                                playbook.mortalRelationships ?? []
                            ).find((entry) => entry.key === value)
                            return (
                                <div key={value} className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            checked={selected.includes(value)}
                                            onCheckedChange={(next) => {
                                                if (next !== true)
                                                    return choose(
                                                        selected.filter(
                                                            (item) =>
                                                                item !== value
                                                        )
                                                    )
                                                if (selected.length < max)
                                                    choose([...selected, value])
                                            }}
                                        />
                                        <Label>{label}</Label>
                                    </div>
                                    {relationship?.description && (
                                        <p className="pl-6 text-sm text-muted-foreground">
                                            {relationship.description}
                                        </p>
                                    )}
                                </div>
                            )
                        })}
                        {question.attribute && !validDestination ? (
                            <p className="text-sm text-destructive">
                                {text(
                                    'pbta:urbanShadows.editor.invalidDestination'
                                )}
                            </p>
                        ) : null}
                        {question.attribute ? (
                            <Button
                                type="button"
                                size="sm"
                                disabled={
                                    !validDestination || !selectedWithinBounds
                                }
                                onClick={apply}
                            >
                                {text('pbta:urbanShadows.editor.apply')}
                            </Button>
                        ) : null}
                    </fieldset>
                )
            })}
        </div>
    )
}
