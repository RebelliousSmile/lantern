import type { Attribute } from '../../../shared/attributeField'

/* The character/npc attribute blocks show what a stat *is* (label, type,
   bounds, options) rather than a bound value — the value-editing AttributeField
   in shared/attributeField.tsx does not apply here. */
function formatAttributeDetail(attribute: Attribute): string {
    switch (attribute.type) {
        case 'Resource':
        case 'Clock':
        case 'Xp': {
            const parts: string[] = []
            if (attribute.max !== undefined) parts.push(`max ${attribute.max}`)
            if (attribute.default !== undefined)
                parts.push(`default ${attribute.default}`)
            return parts.join(', ')
        }
        case 'Checkbox':
            return attribute.checkboxLabel
                ? `label: ${attribute.checkboxLabel}`
                : ''
        case 'ListOne':
            return `options: ${attribute.options.join(', ')}`
        case 'ListMany':
            return attribute.options?.length
                ? `options: ${attribute.options.join(', ')}`
                : ''
        case 'Number':
        case 'Text':
        case 'LongText':
        case 'Roll':
            return attribute.default !== undefined
                ? `default: ${attribute.default}`
                : ''
        case 'Track':
            return ''
        default: {
            const unknownType: never = attribute
            throw new Error(
                `Unknown PbtA attribute type: ${(unknownType as Attribute).type}`
            )
        }
    }
}

export function AttributeDefinitionList({
    attributes,
}: {
    attributes?: Record<string, Attribute>
}) {
    const entries = Object.entries(attributes ?? {})

    if (entries.length === 0) {
        return <p className="pbta-def-empty-row">No attributes defined.</p>
    }

    return (
        <ul className="pbta-def-list">
            {entries.map(([id, attribute]) => {
                const detail = formatAttributeDetail(attribute)
                return (
                    <li key={id} className="pbta-def-list-item">
                        <span className="pbta-def-list-item__key">
                            {attribute.label || id}
                        </span>
                        <span>
                            {attribute.type}
                            {detail ? ` — ${detail}` : ''}
                        </span>
                        {attribute.description ? (
                            <p className="pbta-def-list-item__desc">
                                {attribute.description}
                            </p>
                        ) : null}
                    </li>
                )
            })}
        </ul>
    )
}

export function RecordDefinitionList({
    record,
}: {
    record?: Record<string, string>
}) {
    const entries = Object.entries(record ?? {})

    if (entries.length === 0) {
        return <p className="pbta-def-empty-row">None defined.</p>
    }

    return (
        <ul className="pbta-def-list">
            {entries.map(([key, value]) => (
                <li key={key} className="pbta-def-list-item">
                    <span className="pbta-def-list-item__key">{key}</span>
                    <span>{value}</span>
                </li>
            ))}
        </ul>
    )
}
