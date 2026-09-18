import type { EditorDescriptor, ObjectDescriptor } from './types'

const labelFor = (key: string) =>
    key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (letter) => letter.toUpperCase())

function inferField(id: string, value: unknown): EditorDescriptor {
    if (typeof value === 'boolean')
        return { id, label: labelFor(id), kind: 'scalar', scalar: 'boolean' }
    if (typeof value === 'number')
        return { id, label: labelFor(id), kind: 'scalar', scalar: 'number' }
    if (typeof value === 'string' || value == null)
        return { id, label: labelFor(id), kind: 'scalar', scalar: 'text' }
    if (Array.isArray(value)) {
        const first = value[0]
        const item = inferField('item', first ?? '')
        return {
            id,
            label: labelFor(id),
            kind: 'collection',
            item,
            createEmpty: () => {
                if (item.kind === 'scalar')
                    return item.scalar === 'boolean'
                        ? false
                        : item.scalar === 'number'
                          ? 0
                          : ''
                if (item.kind === 'object')
                    return Object.fromEntries(
                        item.fields.map((field) => [field.id, ''])
                    )
                return {}
            },
        }
    }
    return inferObject(id, value as Record<string, unknown>)
}

export function inferObject(
    id: string,
    value: Record<string, unknown>
): ObjectDescriptor {
    return {
        id,
        label: labelFor(id),
        kind: 'object',
        fields: Object.entries(value).map(([key, entry]) =>
            inferField(key, entry)
        ),
    }
}
