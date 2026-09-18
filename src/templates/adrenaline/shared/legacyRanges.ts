type DocumentRecord = Record<string, unknown>

const isRecord = (value: unknown): value is DocumentRecord =>
    Boolean(value) && typeof value === 'object' && !Array.isArray(value)

const toRange = (value: unknown): unknown =>
    typeof value === 'number'
        ? { minimum: 0, current: value, maximum: value }
        : value

const upgradeKeys = (record: DocumentRecord, keys: string[]) => {
    for (const key of keys) record[key] = toRange(record[key])
}

const upgradeSkills = (value: unknown) => {
    if (!Array.isArray(value)) return
    for (const skill of value) {
        if (isRecord(skill)) upgradeKeys(skill, ['pourcentage', 'total'])
    }
}

const upgradeEquipment = (value: unknown) => {
    if (!isRecord(value)) return
    for (const key of ['armesPhysiques', 'armesMentales']) {
        if (!Array.isArray(value[key])) continue
        for (const weapon of value[key]) {
            if (isRecord(weapon)) upgradeKeys(weapon, ['pourcentage'])
        }
    }
}

/**
 * v1 exported the playable value as a scalar. v2 exports its lower bound,
 * current value and upper bound. A legacy scalar has no stated headroom, so
 * migration keeps it truthful: 0 ≤ n ≤ n.
 */
export function upgradeLegacyAdrenalineRanges(value: unknown): unknown {
    if (!isRecord(value)) return value
    const document = structuredClone(value)

    if (isRecord(document.caracteristiques)) {
        upgradeKeys(document.caracteristiques, [
            'for',
            'con',
            'dex',
            'rap',
            'log',
            'vol',
            'per',
            'cha',
        ])
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
    upgradeEquipment(document.equipement)

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
            'for',
            'con',
            'dex',
            'rap',
            'log',
            'vol',
            'per',
            'cha',
        ])
    }

    return document
}
