import {
    LongTextField,
    NumberField,
    StringRows,
    TextField,
} from '../../shared/editor/FieldPrimitives'
import { useAdrenalineDocument } from '../../shared/hooks'
import { blankPnj } from '../sample'

export function PnjEditorPanel() {
    const { document, update } = useAdrenalineDocument(
        'adrenaline.pnj',
        blankPnj() as unknown as Record<string, unknown>
    )
    const stats = (document.caracteristiques ?? {}) as Record<string, number>
    const narrative = (document.narratif ?? {}) as Record<string, unknown>
    return (
        <div className="space-y-5 p-1">
            <section className="grid gap-2">
                <h3 className="font-semibold">En-tête</h3>
                <TextField
                    label="Nom"
                    value={String(document.nom ?? '')}
                    onChange={(nom) =>
                        update((next) => {
                            next.nom = nom
                        })
                    }
                />
                <NumberField
                    label="Niveau de danger"
                    value={Number(document.niveauDeDanger ?? 0)}
                    onChange={(niveauDeDanger) =>
                        update((next) => {
                            next.niveauDeDanger = niveauDeDanger
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
                <h3 className="font-semibold">Narratif</h3>
                <LongTextField
                    label="Rôle"
                    value={String(narrative.role ?? '')}
                    onChange={(role) =>
                        update((next) => {
                            next.narratif = {
                                ...((next.narratif ?? {}) as Record<
                                    string,
                                    unknown
                                >),
                                role,
                            }
                        })
                    }
                />
                <StringRows
                    label="Personnalité"
                    values={
                        Array.isArray(narrative.personnalite)
                            ? narrative.personnalite.filter(
                                  (value): value is string =>
                                      typeof value === 'string'
                              )
                            : []
                    }
                    onChange={(personnalite) =>
                        update((next) => {
                            next.narratif = {
                                ...((next.narratif ?? {}) as Record<
                                    string,
                                    unknown
                                >),
                                personnalite: personnalite.filter(Boolean),
                            }
                        })
                    }
                />
            </section>
        </div>
    )
}
