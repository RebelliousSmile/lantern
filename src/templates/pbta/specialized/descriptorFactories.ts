import type {
    EditorDescriptor,
    ObjectDescriptor,
    ScalarKind,
} from '@/core/editor-schema/types'

export interface DescriptorFactoryLabels {
    /** Label of a field or list, by the key the contract gives it. */
    name: (key: string) => string
    /**
     * Label of one entry of a list, by the key of the list. A list with no
     * entry of its own falls back to the generic `item` label.
     */
    itemName?: (listId: string) => string | undefined
}

/**
 * The descriptor factories the playbook editors share. A region of the
 * presentation contract is edited by walking its `fields`; each field becomes
 * one of these descriptors, labelled from the game's own `fields` resources.
 */
export function createDescriptorFactories({
    name,
    itemName,
}: DescriptorFactoryLabels) {
    const itemLabel = (listId: string) => itemName?.(listId) ?? name('item')
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
        list(id, scalar('item', kind, itemLabel(id)), () => '')
    const records = (id: string, fields: EditorDescriptor[]) =>
        list(id, object('item', fields, itemLabel(id)), () => ({}))
    return { scalar, object, list, strings, records }
}
