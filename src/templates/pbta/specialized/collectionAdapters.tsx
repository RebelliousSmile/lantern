import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { SchemaEditor } from '@/core/editor-schema/SchemaEditor'
import { inferObject } from '@/core/editor-schema/inferSchema'
import { ChevronDown, ChevronUp, X } from 'lucide-react'
import {
    PBTA_COLLECTION_ITEM_EDITORS,
    getPbtaCollectionPresentation,
    type PbtaCollectionItemEditor,
    type PbtaCollectionPresentation,
} from 'schema-pbta'
import { ChoiceSetsEditor } from '../playbook/editor/ChoiceSetsEditor'
import { MovesEditor } from '../playbook/editor/MovesEditor'
import type { ChoiceSet, MoveEntry } from '../playbook/model'

export type CollectionAdapterProps = {
    presentation: PbtaCollectionPresentation
    items: unknown[]
    onChange: (items: unknown[]) => void
}

function blankItem(editor: PbtaCollectionItemEditor, items: unknown[]): unknown {
    switch (editor) {
        case 'pbta-move':
            if (
                items.some(
                    (item) =>
                        item &&
                        typeof item === 'object' &&
                        !('kind' in item)
                )
            )
                return {
                    name: 'New Move',
                    moveType: 'move',
                    description: 'Describe this move.',
                }
            return { kind: 'inline', name: 'New Move', moveType: 'move', description: 'Describe this move.' }
        case 'pbta-choice-set':
            return { title: 'New Choice Set', type: 'single', choices: [] }
        case 'pbta-advancement':
            return { label: 'New advancement' }
        case 'pbta-ascendant':
            return { name: 'New Ascendant', value: 0 }
        case 'pbta-condition':
            return { name: 'New Condition' }
        case 'pbta-creation-question':
            return { label: 'New question', options: [] }
        case 'pbta-gear':
            return { name: 'New gear' }
        case 'pbta-relationship':
            return { key: 'new-relationship', label: 'New relationship' }
        case 'pbta-scar':
            return { name: 'New scar' }
        case 'pbta-stat-profile':
            return { key: 'new-profile', label: 'New profile', stats: {} }
        case 'pbta-text':
            return ''
        default:
            return {}
    }
}

function GenericCollectionAdapter({ presentation, items, onChange }: CollectionAdapterProps) {
    const mutable = presentation.cardinality === 'mutable'
    const checked = presentation.itemCapabilities?.includes('checked') === true
    const update = (index: number, item: unknown) => onChange(items.map((current, currentIndex) => currentIndex === index ? item : current))
    const move = (index: number, offset: number) => {
        const target = index + offset
        if (!presentation.reorder || target < 0 || target >= items.length) return
        const next = [...items]
        const [item] = next.splice(index, 1)
        next.splice(target, 0, item)
        onChange(next)
    }
    return <div className="space-y-2">
        {items.map((item, index) => <div key={index} className="space-y-2 rounded-md border p-2">
            <div className="flex items-center gap-1">
                {checked && typeof item === 'object' && item !== null && !Array.isArray(item) && <Checkbox checked={(item as { checked?: boolean }).checked === true} aria-label={`${presentation.label} acquired`} onCheckedChange={(value) => {
                    const next = { ...(item as Record<string, unknown>) }
                    if (value === true) next.checked = true
                    else delete next.checked
                    update(index, next)
                }} />}
                <div className="flex-1" />
                {presentation.reorder && <><Button type="button" variant="ghost" size="icon-sm" aria-label="Move up" onClick={() => move(index, -1)}><ChevronUp className="h-3.5 w-3.5" /></Button><Button type="button" variant="ghost" size="icon-sm" aria-label="Move down" onClick={() => move(index, 1)}><ChevronDown className="h-3.5 w-3.5" /></Button></>}
                {mutable && <Button type="button" variant="ghost" size="icon-sm" aria-label={`Remove ${presentation.label}`} onClick={() => onChange(items.filter((_, currentIndex) => currentIndex !== index))}><X className="h-3.5 w-3.5" /></Button>}
            </div>
            {typeof item === 'string' ? <Input value={item} onChange={(event) => update(index, event.target.value)} /> : item && typeof item === 'object' && !Array.isArray(item) ? <SchemaEditor schema={inferObject(presentation.label, item as Record<string, unknown>)} value={item as Record<string, unknown>} onChange={(next) => update(index, next)} /> : <p className="text-sm text-destructive">Unsupported published collection item.</p>}
        </div>)}
        {mutable && <Button type="button" variant="secondary" size="sm" onClick={() => onChange([...items, blankItem(presentation.itemEditor, items)])}>Add {presentation.label}</Button>}
    </div>
}

function MovesAdapter(props: CollectionAdapterProps) {
    if (props.items.some((item) => !item || typeof item !== 'object' || !('kind' in item)))
        return <GenericCollectionAdapter {...props} />
    return <MovesEditor value={props.items as MoveEntry[]} onChange={(items) => props.onChange(items)} allowAddRemove={props.presentation.cardinality === 'mutable'} allowReorder={props.presentation.reorder} allowChecked={props.presentation.itemCapabilities?.includes('checked') === true} />
}

function ChoiceSetsAdapter(props: CollectionAdapterProps) {
    const choices = getPbtaCollectionPresentation(
        props.presentation.target,
        'choiceSets[].choices'
    )
    if (!choices)
        return <p className="text-sm text-destructive">Missing published choice collection configuration.</p>
    return <ChoiceSetsEditor value={props.items as ChoiceSet[]} onChange={(items) => props.onChange(items)} allowAddRemove={props.presentation.cardinality === 'mutable'} allowReorder={props.presentation.reorder} allowChoiceAddRemove={choices.cardinality === 'mutable'} allowChoiceReorder={choices.reorder} />
}

const generic = (props: CollectionAdapterProps) => <GenericCollectionAdapter {...props} />

export const PBTA_COLLECTION_ADAPTERS = {
    'pbta-ascendant': generic,
    'pbta-advancement': generic,
    'pbta-choice-move': generic,
    'pbta-choice-set': ChoiceSetsAdapter,
    'pbta-condition': generic,
    'pbta-creation-option': generic,
    'pbta-creation-question': generic,
    'pbta-gear': generic,
    'pbta-move': MovesAdapter,
    'pbta-relationship': generic,
    'pbta-scar': generic,
    'pbta-stat-profile': generic,
    'pbta-text': generic,
} satisfies Record<PbtaCollectionItemEditor, (props: CollectionAdapterProps) => React.JSX.Element>

export function collectionAdapterFor(itemEditor: string) {
    if (!(PBTA_COLLECTION_ITEM_EDITORS as readonly string[]).includes(itemEditor)) return null
    return PBTA_COLLECTION_ADAPTERS[itemEditor as PbtaCollectionItemEditor]
}

export function PublishedCollectionEditor(props: CollectionAdapterProps) {
    const Adapter = collectionAdapterFor(props.presentation.itemEditor)
    if (!Adapter)
        return <p className="text-sm text-destructive">Unknown published collection adapter: {props.presentation.itemEditor}.</p>
    return <Adapter {...props} />
}
