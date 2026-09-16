import {
    NumberField,
    StringRows,
    TextField,
} from '../../shared/editor/FieldPrimitives'
import { useAdrenalineDocument } from '../../shared/hooks'
import { blankPj } from '../sample'

const characteristics = ['for', 'con', 'dex', 'rap', 'log', 'vol', 'per', 'cha']

export function PjEditorPanel() {
    const { document, update } = useAdrenalineDocument(
        'adrenaline.pj',
        blankPj() as unknown as Record<string, unknown>
    )
    const identity = (document.identite ?? {}) as Record<string, unknown>
    const stats = (document.caracteristiques ?? {}) as Record<string, number>
    const equipment = (document.equipement ?? {}) as Record<string, unknown>

    return (
        <div className="space-y-6 p-1">
            <section className="grid gap-3">
                <h3 className="font-semibold">Personnage</h3>
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
                    label="Joueur"
                    value={String(
                        (
                            (document.parametresDuJeu ?? {}) as Record<
                                string,
                                unknown
                            >
                        ).joueur ?? ''
                    )}
                    onChange={(joueur) =>
                        update((next) => {
                            next.parametresDuJeu = {
                                ...((next.parametresDuJeu ?? {}) as Record<
                                    string,
                                    unknown
                                >),
                                joueur,
                            }
                        })
                    }
                />
            </section>
            <section className="grid gap-3">
                <h3 className="font-semibold">Identité</h3>
                <div className="grid grid-cols-2 gap-2">
                    <TextField
                        label="Nationalité"
                        value={String(identity.nationalite ?? '')}
                        onChange={(nationalite) =>
                            update((next) => {
                                next.identite = {
                                    ...((next.identite ?? {}) as Record<
                                        string,
                                        unknown
                                    >),
                                    nationalite,
                                }
                            })
                        }
                    />
                    <TextField
                        label="Genre"
                        value={String(identity.genre ?? '')}
                        onChange={(genre) =>
                            update((next) => {
                                next.identite = {
                                    ...((next.identite ?? {}) as Record<
                                        string,
                                        unknown
                                    >),
                                    genre,
                                }
                            })
                        }
                    />
                    <NumberField
                        label="Âge"
                        value={Number(identity.age ?? 0)}
                        onChange={(age) =>
                            update((next) => {
                                next.identite = {
                                    ...((next.identite ?? {}) as Record<
                                        string,
                                        unknown
                                    >),
                                    age,
                                }
                            })
                        }
                    />
                    <TextField
                        label="Taille"
                        value={String(identity.taille ?? '')}
                        onChange={(taille) =>
                            update((next) => {
                                next.identite = {
                                    ...((next.identite ?? {}) as Record<
                                        string,
                                        unknown
                                    >),
                                    taille,
                                }
                            })
                        }
                    />
                </div>
            </section>
            <section className="grid gap-3">
                <h3 className="font-semibold">Caractéristiques</h3>
                <div className="grid grid-cols-2 gap-2">
                    {characteristics.map((key) => (
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
            <section className="grid gap-3">
                <h3 className="font-semibold">Équipement</h3>
                <StringRows
                    label="Possessions"
                    values={
                        Array.isArray(equipment.possessions)
                            ? equipment.possessions.filter(
                                  (value): value is string =>
                                      typeof value === 'string'
                              )
                            : []
                    }
                    onChange={(possessions) =>
                        update((next) => {
                            next.equipement = {
                                ...((next.equipement ?? {}) as Record<
                                    string,
                                    unknown
                                >),
                                possessions: possessions.filter(Boolean),
                            }
                        })
                    }
                />
            </section>
        </div>
    )
}
