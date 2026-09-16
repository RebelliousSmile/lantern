import {
    LongTextField,
    NumberField,
    StringRows,
    TextField,
} from '../../shared/editor/FieldPrimitives'
import { useAdrenalineDocument } from '../../shared/hooks'
import { blankMonstre } from '../sample'

export function MonstreEditorPanel() {
    const { document, update } = useAdrenalineDocument(
        'adrenaline.monstre',
        blankMonstre() as unknown as Record<string, unknown>
    )
    const stats = (document.caracteristiques ?? {}) as Record<string, number>
    const alternate = (document.etatAlternatif ?? {}) as Record<string, unknown>
    return (
        <div className="space-y-5 p-1">
            <section className="grid gap-2">
                <h3 className="font-semibold">Créature</h3>
                <TextField
                    label="Nom"
                    value={String(document.nom ?? '')}
                    onChange={(nom) =>
                        update((next) => {
                            next.nom = nom
                        })
                    }
                />
                <TextField
                    label="Type de corps"
                    value={String(document.typeDeCorps ?? '')}
                    onChange={(typeDeCorps) =>
                        update((next) => {
                            next.typeDeCorps = typeDeCorps
                        })
                    }
                />
                <TextField
                    label="Instinct"
                    value={String(document.instinct ?? '')}
                    onChange={(instinct) =>
                        update((next) => {
                            next.instinct = instinct
                        })
                    }
                />
                <LongTextField
                    label="Description"
                    value={String(document.description ?? '')}
                    onChange={(description) =>
                        update((next) => {
                            next.description = description
                        })
                    }
                />
            </section>
            <section className="grid gap-2">
                <h3 className="font-semibold">Caractéristiques</h3>
                <div className="grid grid-cols-2 gap-2">
                    {[
                        'for',
                        'con',
                        'dex',
                        'rap',
                        'log',
                        'vol',
                        'per',
                        'cha',
                    ].map((key) => (
                        <NumberField
                            key={key}
                            label={key.toUpperCase()}
                            value={stats[key] ?? 0}
                            onChange={(value) =>
                                update((next) => {
                                    next.caracteristiques = {
                                        ...((next.caracteristiques ??
                                            {}) as Record<string, number>),
                                        [key]: value,
                                    }
                                })
                            }
                        />
                    ))}
                </div>
            </section>
            <section className="grid gap-2">
                <h3 className="font-semibold">État alternatif</h3>
                <TextField
                    label="Nom de l'état"
                    value={String(alternate.nom ?? '')}
                    onChange={(nom) =>
                        update((next) => {
                            next.etatAlternatif = {
                                ...((next.etatAlternatif ?? {}) as Record<
                                    string,
                                    unknown
                                >),
                                nom,
                            }
                        })
                    }
                />
                <StringRows
                    label="Déclencheurs"
                    values={
                        Array.isArray(alternate.declencheurs)
                            ? alternate.declencheurs.filter(
                                  (value): value is string =>
                                      typeof value === 'string'
                              )
                            : []
                    }
                    onChange={(declencheurs) =>
                        update((next) => {
                            next.etatAlternatif = {
                                ...((next.etatAlternatif ?? {}) as Record<
                                    string,
                                    unknown
                                >),
                                declencheurs: declencheurs.filter(Boolean),
                            }
                        })
                    }
                />
            </section>
        </div>
    )
}
