import { CHARACTERISTIC_FIELDS, WEAPON_FIELDS } from './schemaFields'

type DocumentRecord = Record<string, unknown>

const isRecord = (value: unknown): value is DocumentRecord =>
    Boolean(value) && typeof value === 'object' && !Array.isArray(value)

const toRange = (value: unknown): unknown =>
    typeof value === 'number'
        ? { minimum: 0, current: value, maximum: value }
        : value

/* The player sheet writes one number where a range was written: the current value is kept. */
const toPlain = (value: unknown): unknown =>
    isRecord(value) && typeof value.current === 'number' ? value.current : value

const upgradeKeys = (
    record: DocumentRecord,
    keys: string[],
    upgrade: (value: unknown) => unknown = toRange
) => {
    for (const key of keys) {
        if (Object.hasOwn(record, key)) record[key] = upgrade(record[key])
    }
}

const upgradeSkills = (value: unknown) => {
    if (!Array.isArray(value)) return
    for (const skill of value) {
        if (!isRecord(skill)) continue
        /* The player sheet prints a skill's name, specialty and percentage, and nothing under it. */
        for (const key of [
            'caracteristique',
            'degats',
            'total',
            'action',
            'avantages',
            'notes',
        ])
            delete skill[key]
        upgradeKeys(skill, ['pourcentage', 'total'], toPlain)
    }
}

const upgradeEquipment = (value: unknown) => {
    if (!isRecord(value)) return
    for (const key of WEAPON_FIELDS.pj) {
        if (!Array.isArray(value[key])) continue
        for (const weapon of value[key]) {
            if (!isRecord(weapon)) continue
            /* The player sheet's weapon line has a damage nature, no type and no note. */
            delete weapon.type
            delete weapon.notes
            upgradeKeys(weapon, ['pourcentage'], toPlain)
        }
    }
}

/**
 * Older player-sheet documents wrote ranges (`minimum`, `current`, `maximum`) and keys the sheet
 * does not print. The current contract types one number for a characteristic, a threshold, a
 * protection, a percentage, and drops the keys the sheet has no zone for: the current value is
 * kept, the rest is removed. The experience points (`px`) and the contagion probability keep the
 * range. A creature or a PNJ accepts the plain number and its own keys, so a document of those
 * targets is left as written. A key the published schema still refuses is then reported by it.
 */
export function upgradeLegacyAdrenalineRanges(
    value: unknown,
    target: string
): unknown {
    if (!isRecord(value)) return value
    if (target !== 'adrenaline/pj') return value
    const document = structuredClone(value)

    if (isRecord(document.caracteristiques)) {
        upgradeKeys(
            document.caracteristiques,
            [...CHARACTERISTIC_FIELDS.pj],
            toPlain
        )
    }

    if (isRecord(document.sante)) {
        for (const kind of ['physique', 'mental']) {
            const health = document.sante[kind]
            if (!isRecord(health)) continue
            for (const level of ['superficiel', 'leger', 'grave', 'profond']) {
                const threshold = health[level]
                if (isRecord(threshold))
                    upgradeKeys(threshold, ['base', 'couvert'], toPlain)
            }
        }
    }

    if (isRecord(document.protections)) {
        for (const kind of ['physiques', 'mentales']) {
            const protection = document.protections[kind]
            if (!isRecord(protection)) continue
            /* The player sheet prints no solidity and no shield, and its armour or
               character trait is one line: the older document's extras are dropped. */
            delete protection.solidite
            delete protection.bouclier
            for (const item of ['armure', 'caractere']) {
                const entry = protection[item]
                if (!isRecord(entry)) continue
                for (const key of [
                    'des',
                    'couverture',
                    'emotions',
                    'proprietes',
                    'reduction',
                ])
                    delete entry[key]
                upgradeKeys(entry, ['points'], toPlain)
            }
        }
    }

    if (Array.isArray(document.formations)) {
        for (const formation of document.formations) {
            if (!isRecord(formation)) continue
            upgradeKeys(formation, ['pourcentage'], toPlain)
            upgradeSkills(formation.competences)
        }
    }
    upgradeSkills(document.competences)
    upgradeEquipment(document.equipement)

    if (
        isRecord(document.etatDePartie) &&
        Array.isArray(document.etatDePartie.etats)
    ) {
        /* The player sheet's « États » zone is one free text, a line per state. */
        document.etatDePartie.etats = document.etatDePartie.etats
            .map((state: unknown) => {
                if (typeof state === 'string') return state
                if (!isRecord(state) || typeof state.nom !== 'string') return ''
                const where =
                    typeof state.localisation === 'string'
                        ? ` (${state.localisation})`
                        : ''
                return `${state.nom}${where}`
            })
            .filter((line: string) => line.length > 0)
            .join('\n')
        if (document.etatDePartie.etats === '')
            delete document.etatDePartie.etats
    }

    if (
        isRecord(document.etatDePartie) &&
        isRecord(document.etatDePartie.malus) &&
        isRecord(document.etatDePartie.malus.choc)
    ) {
        /* The sheet prints the five round circles only. */
        delete document.etatDePartie.malus.choc.heures
    }

    if (isRecord(document.parametresDuJeu)) {
        upgradeKeys(document.parametresDuJeu, ['px'])
    }
    if (
        isRecord(document.contagion) &&
        Array.isArray(document.contagion.vecteurs)
    ) {
        for (const vector of document.contagion.vecteurs) {
            if (isRecord(vector)) upgradeKeys(vector, ['probabilite'])
        }
    }
    if (
        isRecord(document.etatAlternatif) &&
        isRecord(document.etatAlternatif.caracteristiques)
    ) {
        upgradeKeys(document.etatAlternatif.caracteristiques, [
            ...CHARACTERISTIC_FIELDS.monstreEtat,
        ])
    }

    return document
}
