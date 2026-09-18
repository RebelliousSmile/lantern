import { useAdrenalineDocument } from '../../shared/hooks'
import {
    AdrenalineHeader,
    AdrenalineSection,
    AdrenalineStatGrid,
    currentValue,
} from '../../shared/preview/SheetPrimitives'
import '../../shared/preview/adrenalineTheme.css'
import { blankPj } from '../sample'

const labels = ['FOR', 'CON', 'DEX', 'RAP', 'LOG', 'VOL', 'PER', 'CHA']
const keys = ['for', 'con', 'dex', 'rap', 'log', 'vol', 'per', 'cha']

export function PjPreview() {
    const { document, openSection } = useAdrenalineDocument(
        'adrenaline.pj',
        blankPj() as unknown as Record<string, unknown>
    )
    const stats = (document.caracteristiques ?? {}) as Record<string, unknown>
    const identity = (document.identite ?? {}) as Record<string, unknown>
    const health = (document.sante ?? {}) as Record<
        string,
        Record<string, Record<string, number>>
    >
    const possessions = ((
        (document.equipement ?? {}) as Record<string, unknown>
    ).possessions ?? []) as string[]
    const parameters = (document.parametresDuJeu ?? {}) as Record<
        string,
        unknown
    >
    const protections = (document.protections ?? {}) as Record<string, unknown>
    const equipment = (document.equipement ?? {}) as Record<string, unknown>
    const formations = Array.isArray(document.formations)
        ? (document.formations as Record<string, unknown>[])
        : []
    const meta = (document.meta ?? {}) as Record<string, unknown>
    return (
        <article className="adr-doc adr-sheet mx-auto w-full max-w-[820px] overflow-hidden">
            <AdrenalineHeader
                eyebrow="Système Adrenaline · Personnage joueur"
                title={String(document.nom ?? 'Personnage sans nom')}
            />
            <button
                className="block w-full text-left"
                type="button"
                onClick={() => openSection('parameters')}
            >
                <AdrenalineSection title="Paramètres de jeu">
                    <p className="m-0">
                        {[
                            parameters.joueur,
                            parameters.typeDeCreation,
                            parameters.typeDeScenario,
                            parameters.declinaisonDeCampagne,
                            currentValue(parameters.px),
                        ]
                            .filter(
                                (value) => value !== undefined && value !== ''
                            )
                            .join(' · ') || 'À compléter'}
                    </p>
                </AdrenalineSection>
            </button>
            <div className="grid md:grid-cols-[1fr_1.2fr]">
                <button
                    className="text-left"
                    type="button"
                    onClick={() => openSection('identity')}
                >
                    <AdrenalineSection title="Identité">
                        <p className="m-0">
                            {Object.values(identity)
                                .filter(
                                    (value) =>
                                        typeof value === 'string' ||
                                        typeof value === 'number'
                                )
                                .join(' · ') || 'À compléter'}
                        </p>
                    </AdrenalineSection>
                </button>
                <button
                    className="text-left"
                    type="button"
                    onClick={() => openSection('characteristics')}
                >
                    <AdrenalineSection title="Caractéristiques">
                        <AdrenalineStatGrid
                            values={keys.map((key, index) => ({
                                label: labels[index],
                                value: currentValue(stats[key]),
                            }))}
                        />
                    </AdrenalineSection>
                </button>
            </div>
            <button
                className="block w-full text-left"
                type="button"
                onClick={() => openSection('health')}
            >
                <AdrenalineSection title="Santé">
                    <div className="grid grid-cols-4 gap-2 text-sm">
                        {['superficiel', 'leger', 'grave', 'profond'].map(
                            (key) => (
                                <div key={key}>
                                    <strong className="block capitalize">
                                        {key}
                                    </strong>
                                    {currentValue(
                                        health.physique?.[key]?.base
                                    ) ?? '—'}{' '}
                                    physique /{' '}
                                    {currentValue(health.mental?.[key]?.base) ??
                                        '—'}{' '}
                                    mental
                                </div>
                            )
                        )}
                    </div>
                </AdrenalineSection>
            </button>
            <button
                className="block w-full text-left"
                type="button"
                onClick={() => openSection('protections')}
            >
                <AdrenalineSection title="Protections">
                    <p className="m-0">
                        Physique{' '}
                        {currentValue(
                            (
                                protections.physiques as
                                    | Record<string, unknown>
                                    | undefined
                            )?.solidite
                        ) ?? '—'}{' '}
                        · Mentale{' '}
                        {currentValue(
                            (
                                protections.mentales as
                                    | Record<string, unknown>
                                    | undefined
                            )?.solidite
                        ) ?? '—'}
                    </p>
                </AdrenalineSection>
            </button>
            <button
                className="block w-full text-left"
                type="button"
                onClick={() => openSection('formations')}
            >
                <AdrenalineSection title="Formations et compétences">
                    <p className="m-0">
                        {formations
                            .map(
                                (formation) =>
                                    `${String(formation.nom ?? 'Formation')} ${String(currentValue(formation.pourcentage) ?? '')}%`
                            )
                            .join(' · ') || 'Aucune formation'}
                    </p>
                </AdrenalineSection>
            </button>
            <button
                className="block w-full text-left"
                type="button"
                onClick={() => openSection('equipment')}
            >
                <AdrenalineSection title="Équipement">
                    <p className="m-0">
                        {possessions.filter(Boolean).join(' · ') ||
                            'Aucune possession'}
                    </p>
                    <p className="mb-0">
                        {String(equipment.equipementFavori ?? '')}
                    </p>
                </AdrenalineSection>
            </button>
            <button
                className="block w-full text-left"
                type="button"
                onClick={() => openSection('meta')}
            >
                <AdrenalineSection title="Provenance">
                    <p className="m-0">
                        {[
                            meta.typeDePublication,
                            meta.source,
                            meta.page,
                            meta.licence,
                        ]
                            .filter(
                                (value) => value !== undefined && value !== ''
                            )
                            .join(' · ') || 'Non renseignée'}
                    </p>
                </AdrenalineSection>
            </button>
            <div className="adr-block grid grid-cols-4 gap-2 text-center text-xs text-[var(--adr-burgundy)]">
                <span>Adrénaline</span>
                <span>Panique</span>
                <span>Malus</span>
                <span>États</span>
            </div>
        </article>
    )
}
