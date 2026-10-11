import {
    DeltaEtatDeCreature,
    Monstre,
    PersonnageJoueur,
    PersonnageNonJoue,
} from 'schema-adrenaline'

/*
 * What a form offers is read from the published schema, never listed here: a field the schema
 * declares is offered, and one it no longer declares is not. Each helper walks the Zod nodes the
 * package exports, through the optional wrappers around them.
 */
function objectShape(node: unknown): Record<string, unknown> | undefined {
    let current = node as
        | { shape?: Record<string, unknown>; unwrap?: () => unknown }
        | undefined
    for (let depth = 0; current && depth < 4; depth += 1) {
        if (current.shape) return current.shape
        current = current.unwrap?.() as typeof current
    }
    return undefined
}

function keysOf(node: unknown): string[] {
    return Object.keys(objectShape(node) ?? {})
}

/** The characteristics each document declares, in schema order. */
export const CHARACTERISTIC_FIELDS = {
    monstre: keysOf(Monstre.shape.caracteristiques),
    monstreEtat: keysOf(DeltaEtatDeCreature.shape.caracteristiques),
    pnj: keysOf(PersonnageNonJoue.shape.caracteristiques),
    pj: keysOf(PersonnageJoueur.shape.caracteristiques),
} as const

/** The weapon lists each document's equipment declares: every key of the block that starts with `armes`. */
function weaponKeys(node: unknown): string[] {
    return keysOf(objectShape(node)?.equipement).filter((key) =>
        key.startsWith('armes')
    )
}

export const WEAPON_FIELDS = {
    monstre: weaponKeys(Monstre),
    pnj: weaponKeys(PersonnageNonJoue),
    pj: weaponKeys(PersonnageJoueur),
} as const

/** The most states a creature may enter, as the schema bounds `etats`; undefined when it sets no bound. */
export function maximumStates(): number | undefined {
    const states = objectShape(Monstre)?.etats as
        | { unwrap?: () => unknown; def?: unknown }
        | undefined
    const list = (states?.unwrap?.() ?? states) as
        | {
              def?: {
                  checks?: readonly {
                      _zod: { def: { check?: string; maximum?: number } }
                  }[]
              }
          }
        | undefined
    for (const check of list?.def?.checks ?? [])
        if (
            check._zod.def.check === 'max_length' &&
            typeof check._zod.def.maximum === 'number'
        )
            return check._zod.def.maximum
    return undefined
}
