import {
    LongTextField,
    RecordRows,
    TextField,
    ValueField,
} from '../../../shared/editor/FieldPrimitives'
import { records } from '../fieldHelpers'
import { useMonstreEdit } from '../useMonstreEdit'

export function ContagionForm() {
    const {
        shows,
        text,
        contagionSource,
        contagion,
        profileLine,
        ownership,
        errorLine,
    } = useMonstreEdit()
    /* Only the zone that was clicked: this panel is that one key. */
    if (!shows('contagion')) return null
    return (
        <>
            <section className="grid gap-2">
                <h3 className="font-semibold">
                    {text('adrenaline:monstre.form.contagionHeading')}
                </h3>
                {profileLine()}
                {ownership([
                    [
                        text('adrenaline:monstre.form.contagionHeading'),
                        contagionSource,
                    ],
                ])}
                <TextField
                    label={text('adrenaline:monstre.form.agent')}
                    value={String(contagion.agent ?? '')}
                    onChange={(agent) =>
                        contagionSource.write({ ...contagion, agent })
                    }
                />
                <TextField
                    label={text('adrenaline:monstre.form.onsetDelay')}
                    value={String(contagion.delaiAvantEffet ?? '')}
                    onChange={(delaiAvantEffet) =>
                        contagionSource.write({
                            ...contagion,
                            delaiAvantEffet,
                        })
                    }
                />
                <LongTextField
                    label={text('adrenaline:monstre.form.outcome')}
                    value={String(contagion.issue ?? '')}
                    onChange={(issue) =>
                        contagionSource.write({ ...contagion, issue })
                    }
                />
                <RecordRows
                    at={`${contagionSource.owner ? '/etats[]/delta/contagion' : '/contagion'}/vecteurs[]`}
                    label={text('adrenaline:monstre.form.vectors')}
                    values={records(contagion.vecteurs)}
                    create={() => ({}) as Record<string, unknown>}
                    onChange={(vecteurs) =>
                        contagionSource.write({ ...contagion, vecteurs })
                    }
                >
                    {(entry, _, replace) => (
                        <div className="grid grid-cols-2 gap-2">
                            <TextField
                                label={text('fields.name')}
                                value={String(entry.nom ?? '')}
                                onChange={(nom) => replace({ ...entry, nom })}
                            />
                            <ValueField
                                form="number"
                                label={text(
                                    'adrenaline:monstre.form.probability'
                                )}
                                value={entry.probabilite}
                                onChange={(probabilite) =>
                                    replace({ ...entry, probabilite })
                                }
                            />
                            <LongTextField
                                label={text('fields.notes')}
                                value={String(entry.notes ?? '')}
                                onChange={(notes) =>
                                    replace({ ...entry, notes })
                                }
                            />
                        </div>
                    )}
                </RecordRows>
                <RecordRows
                    at={`${contagionSource.owner ? '/etats[]/delta/contagion' : '/contagion'}/modulations[]`}
                    label={text('adrenaline:monstre.form.modifiers')}
                    values={records(contagion.modulations)}
                    create={() => ({
                        profil: '',
                        delaiAvantEffet: '',
                        issue: '',
                    })}
                    onChange={(modulations) =>
                        contagionSource.write({ ...contagion, modulations })
                    }
                >
                    {(entry, _, replace) => (
                        <div className="grid grid-cols-2 gap-2">
                            <TextField
                                label={text('adrenaline:monstre.form.profile')}
                                value={String(entry.profil ?? '')}
                                onChange={(profil) =>
                                    replace({ ...entry, profil })
                                }
                            />
                            <TextField
                                label={text(
                                    'adrenaline:monstre.form.onsetDelay'
                                )}
                                value={String(entry.delaiAvantEffet ?? '')}
                                onChange={(delaiAvantEffet) =>
                                    replace({ ...entry, delaiAvantEffet })
                                }
                            />
                            <LongTextField
                                label={text('adrenaline:monstre.form.outcome')}
                                value={String(entry.issue ?? '')}
                                onChange={(issue) =>
                                    replace({ ...entry, issue })
                                }
                            />
                        </div>
                    )}
                </RecordRows>
            </section>
            {errorLine()}
        </>
    )
}
