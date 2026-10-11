import { PersonnageJoueur } from 'schema-adrenaline'
import { CHARACTERISTIC_FIELDS, WEAPON_FIELDS } from './schemaFields'

type DocumentRecord = Record<string, unknown>

/*
 * A PJ characteristic leaves creation at its creation value, which is both its floor and its current
 * value, and may only grow up to the sheet's ceiling. The ceiling is read from the published schema.
 */
const PJ_CHARACTERISTIC_CEILING =
    PersonnageJoueur.shape.caracteristiques.shape.for.shape.maximum.maxValue ??
    Number.POSITIVE_INFINITY

const isRecord = (value: unknown): value is DocumentRecord =>
    Boolean(value) && typeof value === 'object' && !Array.isArray(value)

const toRange = (value: unknown): unknown =>
    typeof value === 'number'
        ? { minimum: 0, current: value, maximum: value }
        : value

const toCharacteristic = (value: unknown): unknown =>
    typeof value === 'number'
        ? {
              minimum: value,
              current: value,
              maximum: Math.max(value, PJ_CHARACTERISTIC_CEILING),
          }
        : value

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
        if (isRecord(skill)) upgradeKeys(skill, ['pourcentage', 'total'])
    }
}

/*
 * The lists a document of this target declares come from its published schema: a list the schema
 * no longer declares is not upgraded, and the schema then reports it. Without a target, every
 * list any of the documents declares is upgraded.
 */
const uniq = (keys: readonly string[]) =>
    keys.filter((key, index) => keys.indexOf(key) === index)

const weaponKeysOf = (target?: string): readonly string[] =>
    target === 'adrenaline/pj'
        ? WEAPON_FIELDS.pj
        : target === 'adrenaline/pnj'
          ? WEAPON_FIELDS.pnj
          : target === 'adrenaline/monstre'
            ? WEAPON_FIELDS.monstre
            : uniq([
                  ...WEAPON_FIELDS.pj,
                  ...WEAPON_FIELDS.pnj,
                  ...WEAPON_FIELDS.monstre,
              ])

const characteristicKeysOf = (target?: string): readonly string[] =>
    target === 'adrenaline/pj'
        ? CHARACTERISTIC_FIELDS.pj
        : target === 'adrenaline/pnj'
          ? CHARACTERISTIC_FIELDS.pnj
          : target === 'adrenaline/monstre'
            ? CHARACTERISTIC_FIELDS.monstre
            : uniq([
                  ...CHARACTERISTIC_FIELDS.pj,
                  ...CHARACTERISTIC_FIELDS.pnj,
                  ...CHARACTERISTIC_FIELDS.monstre,
              ])

const upgradeEquipment = (value: unknown, target?: string) => {
    if (!isRecord(value)) return
    for (const key of weaponKeysOf(target)) {
        if (!Array.isArray(value[key])) continue
        for (const weapon of value[key]) {
            if (isRecord(weapon)) upgradeKeys(weapon, ['pourcentage'])
        }
    }
}

/**
 * v1 exported the playable value as a scalar. v2 exports its lower bound,
 * current value and upper bound. A legacy scalar has no stated headroom, so
 * migration keeps it truthful: 0 ≤ n ≤ n — except a PJ characteristic, whose
 * scalar is its creation value: n ≤ n ≤ the published ceiling.
 */
export function upgradeLegacyAdrenalineRanges(
    value: unknown,
    target?: string
): unknown {
    if (!isRecord(value)) return value
    const document = structuredClone(value)

    if (isRecord(document.caracteristiques)) {
        upgradeKeys(
            document.caracteristiques,
            [...characteristicKeysOf(target)],
            target === 'adrenaline/pj' ? toCharacteristic : toRange
        )
    }

    if (isRecord(document.sante)) {
        for (const kind of ['physique', 'mental']) {
            const health = document.sante[kind]
            if (!isRecord(health)) continue
            for (const level of ['superficiel', 'leger', 'grave', 'profond']) {
                const threshold = health[level]
                if (isRecord(threshold))
                    upgradeKeys(threshold, ['base', 'couvert'])
            }
        }
    }

    if (isRecord(document.protections)) {
        for (const kind of ['physiques', 'mentales']) {
            const protection = document.protections[kind]
            if (!isRecord(protection)) continue
            upgradeKeys(protection, ['solidite'])
            for (const item of ['armure', 'caractere']) {
                if (isRecord(protection[item]))
                    upgradeKeys(protection[item], ['points'])
            }
        }
    }

    if (Array.isArray(document.formations)) {
        for (const formation of document.formations) {
            if (!isRecord(formation)) continue
            upgradeKeys(formation, ['pourcentage'])
            upgradeSkills(formation.competences)
        }
    }
    upgradeSkills(document.competences)
    upgradeEquipment(document.equipement, target)

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
