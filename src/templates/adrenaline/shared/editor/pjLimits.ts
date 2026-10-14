import type { Limit } from './FieldPrimitives'
import { shapeAt, type SchemaName } from './schemaShapes'

/*
 * The numeric bounds of the player sheet, read from the schema the package publishes: nothing
 * here restates one. A pointer names a number or a triplet (whose bounds are those of its
 * `current`), arrays being written `[]`: `/formations[]/competences[]/total`.
 */

/** The bounds the schema `name` gives the number (or triplet) at `pointer`; none when it gives none. */
export function limitAt(name: SchemaName, pointer: string): Limit | undefined {
    const shape = shapeAt(name, pointer)
    if (!shape) return undefined
    /* A figure published as a number or as a triplet is bounded by the number, or by the `current` of the triplet. */
    const candidates = [shape].concat(shape.anyOf ?? [], shape.oneOf ?? [])
    for (const candidate of candidates) {
        const number = candidate.properties?.current ?? candidate
        if (number.minimum !== undefined || number.maximum !== undefined)
            return { min: number.minimum, max: number.maximum }
    }
    return undefined
}

/** The bounds of the player sheet. */
export const pjLimit = (pointer: string): Limit | undefined =>
    limitAt('pj', pointer)
