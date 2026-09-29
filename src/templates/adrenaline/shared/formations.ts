import { PersonnageJoueur } from 'schema-adrenaline'

/*
 * The PJ sheet prints one column per published formation type, and the schema closes that set:
 * the columns are read from the enum, never listed here. A column exists before the document has
 * a formation of that type, so both the sheet and the editor show the empty frame to fill.
 */
export const FORMATION_TYPES: readonly string[] =
    PersonnageJoueur.shape.formations.unwrap().element.shape.type.unwrap()
        .options

/** Ruled skill lines printed under each formation column, filled or not. */
export const SKILL_LINES = 5

export function formationTypeLabel(type: string): string {
    const spaced = type.replace(/-/g, ' ')
    return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

type Entry = Record<string, unknown>

/**
 * One column per published type, holding the first formation of that type, then any formation the
 * columns did not take (untyped or repeated), so that nothing the document holds is dropped.
 */
export function formationColumns(formations: readonly Entry[]) {
    const taken = new Set<Entry>()
    const columns: { type: string; formation?: Entry }[] = FORMATION_TYPES.map(
        (type) => {
            const formation = formations.find((entry) => entry.type === type)
            if (formation) taken.add(formation)
            return { type, formation }
        }
    )
    for (const formation of formations)
        if (!taken.has(formation))
            columns.push({
                type: typeof formation.type === 'string' ? formation.type : '',
                formation,
            })
    return columns
}
