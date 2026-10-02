import { PersonnageJoueur } from 'schema-adrenaline'

/*
 * The PJ sheet prints one column per published formation type, and the schema closes that set:
 * the columns are read from the enum, never listed here. A column exists before the document has
 * a formation of that type, so both the sheet and the editor show the empty frame to fill.
 */
export const FORMATION_TYPES: readonly string[] =
    PersonnageJoueur.shape.formations.unwrap().element.shape.type.options

const skillCharacteristic = PersonnageJoueur.shape.formations
    .unwrap()
    .element.shape.competences.unwrap().element.shape.caracteristique
/** The characteristics a skill can name, by their published three-letter key. */
export const CHARACTERISTIC_KEYS: readonly string[] = (
    'unwrap' in skillCharacteristic
        ? skillCharacteristic.unwrap()
        : skillCharacteristic
).options

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

/**
 * The three formations of a PJ, one per published type: the editor neither adds nor removes one,
 * only fills it. A formation the document holds outside those columns is kept untouched, unless it
 * carries nothing at all: an untyped, unnamed, skill-less row left by an older editor is dropped.
 */
export function withFormation(
    formations: readonly Entry[],
    type: string,
    formation: Entry
): Entry[] {
    formations = formations.filter(
        (entry) =>
            FORMATION_TYPES.includes(String(entry.type)) ||
            String(entry.nom ?? '') !== '' ||
            (Array.isArray(entry.competences) && entry.competences.length > 0)
    )
    const index = formations.findIndex((entry) => entry.type === type)
    if (index < 0) return [...formations, { ...formation, type }]
    return formations.map((entry, i) =>
        i === index ? { ...formation, type } : entry
    )
}
