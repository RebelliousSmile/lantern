import type { MonstreSection } from '../shared/sections'

/**
 * The document keys each edit panel of the creature sheet carries, in the order a click looks for one.
 * The panel a block opens is the first that carries every key the block prints, so clicking a zone
 * never leaves a printed value out of reach; the coverage guard checks that each panel does name the
 * keys listed here.
 */
export const PANEL_KEYS: ReadonlyArray<readonly [MonstreSection, string[]]> = [
    [
        'basic',
        [
            'nom',
            'categorie',
            'niveauDeDanger',
            'niveauDeDangerAlternatif',
            'niveauDeDangerNote',
            'instinct',
            'typeDeCorps',
            'typeInfecte',
            'description',
            'zoneDeDetection',
            'deplacement',
            'actionsParRound',
            'defense',
        ],
    ],
    ['statistics', ['caracteristiques', 'zoneDeDetection', 'deplacement']],
    ['health', ['sante', 'etatsPermanents', 'malusAvantHs']],
    ['protections', ['protections']],
    ['behaviour', ['comportement', 'traitsSpeciaux', 'actions']],
    ['skills', ['competences']],
    ['equipment', ['equipement']],
    ['states', ['etatActif', 'etats']],
    ['contagion', ['contagion']],
    ['narrative', ['narratif']],
]

/** The root keys of the document pointers a block prints (`/zoneDeDetection` gives `zoneDeDetection`). */
export function rootKeys(paths: readonly string[]): string[] {
    return paths.reduce<string[]>((keys, path) => {
        const key = path.split('/')[1]
        if (key && keys.indexOf(key) < 0) keys.push(key)
        return keys
    }, [])
}

/**
 * The panel a block opens: the one that carries the most of the keys it prints (the first on a tie),
 * `meta` when none carries any. A key no panel carries yet is a debt the coverage guard names.
 */
export function panelFor(paths: readonly string[]): MonstreSection {
    const keys = rootKeys(paths)
    let best: MonstreSection = 'meta'
    let bestScore = 0
    for (const [panel, carried] of PANEL_KEYS) {
        const score = keys.filter((key) => carried.indexOf(key) >= 0).length
        if (score > bestScore) {
            best = panel
            bestScore = score
        }
    }
    return best
}

/**
 * Whether a panel shows a field of one of `keys` when it was opened from a block printing `sheetKeys`:
 * the fields of that block only, every field when the panel was opened from the section list.
 * Every form asks this, so the fields a panel renders are the ones this function lets through.
 */
export function showsKey(
    sheetKeys: readonly string[] | undefined,
    ...keys: string[]
): boolean {
    return !sheetKeys || keys.some((key) => sheetKeys.indexOf(key) >= 0)
}

/** The root keys a panel renders a field for, once opened from a block printing `sheetKeys`. */
export function shownKeys(
    panel: MonstreSection,
    sheetKeys: readonly string[] | undefined
): string[] {
    const entry = PANEL_KEYS.filter(([name]) => name === panel)[0]
    return entry ? entry[1].filter((key) => showsKey(sheetKeys, key)) : []
}
