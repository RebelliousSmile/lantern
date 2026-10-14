import monstreSchema from 'schema-adrenaline/schemas/monstre.schema.json'
import pjSchema from 'schema-adrenaline/schemas/pj.schema.json'
import pnjSchema from 'schema-adrenaline/schemas/pnj.schema.json'

/*
 * The published JSON schemas of the three documents, read by pointer: what a field is bounded by,
 * what it may hold. Nothing here restates a value the contract publishes. Arrays are written `[]`
 * in a pointer: `/formations[]/competences[]/total`.
 */
export type SchemaName = 'pj' | 'pnj' | 'monstre'

type Shape = {
    type?: string
    minimum?: number
    maximum?: number
    enum?: readonly string[]
    required?: readonly string[]
    properties?: Record<string, Shape>
    items?: Shape
    oneOf?: readonly Shape[]
    anyOf?: readonly Shape[]
}

const roots: Record<SchemaName, Shape> = {
    pj: pjSchema as unknown as Shape,
    pnj: pnjSchema as unknown as Shape,
    monstre: monstreSchema as unknown as Shape,
}

/** The node a pointer names, or undefined when the schema declares nothing there. */
export function shapeAt(name: SchemaName, pointer: string): Shape | undefined {
    const steps = pointer
        .split('/')
        .filter(Boolean)
        .reduce<string[]>((all, part) => {
            const bare = part.replace(/\[\]/g, '')
            const arrays = (part.length - bare.length) / 2
            return all.concat(bare, ...Array<string>(arrays).fill('[]'))
        }, [])
    const child = (
        node: Shape | undefined,
        step: string
    ): Shape | undefined => {
        if (!node) return undefined
        const direct = step === '[]' ? node.items : node.properties?.[step]
        if (direct) return direct
        /* A choice between variants: the step is taken in the first variant that has it. */
        const variants = (node.anyOf ?? []).concat(node.oneOf ?? [])
        return variants.reduce<Shape | undefined>(
            (found, variant) => found ?? child(variant, step),
            undefined
        )
    }
    return steps.reduce<Shape | undefined>(child, roots[name])
}

/** The values the schema allows at `pointer` (of the value itself, or of each item of a list); none when it lists none. */
export function enumAt(name: SchemaName, pointer: string): readonly string[] {
    const shape = shapeAt(name, pointer)
    return shape?.enum ?? shape?.items?.enum ?? []
}

/** The keys the schema requires of the object at `pointer`; none when it requires none. */
export function requiredAt(
    name: SchemaName,
    pointer: string
): readonly string[] {
    const shape = shapeAt(name, pointer)
    if (shape?.required) return shape.required
    /* A choice between variants requires what every variant requires. */
    const variants = shape?.oneOf ?? []
    if (variants.length === 0) return []
    return (variants[0].required ?? []).filter((key) =>
        variants.every((variant) => (variant.required ?? []).includes(key))
    )
}

/** The sides a game state may be on, read from the variants of the published PJ schema. */
export const STATE_SIDES: readonly string[] = (
    (
        pjSchema as unknown as {
            properties: {
                etatDePartie?: {
                    properties?: {
                        etats?: {
                            items?: {
                                oneOf?: readonly {
                                    properties?: {
                                        versant?: { const?: string }
                                    }
                                }[]
                            }
                        }
                    }
                }
            }
        }
    ).properties.etatDePartie?.properties?.etats?.items?.oneOf ?? []
).reduce<string[]>((all, option) => {
    const side = option.properties?.versant?.const
    return side ? all.concat(side) : all
}, [])
