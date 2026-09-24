import { useAdrenalineDocument } from '../../shared/hooks'
import {
    AdrenalineHeader,
    AdrenalineSection,
    AdrenalineStatGrid,
    currentValue,
} from '../../shared/preview/SheetPrimitives'
import '../../shared/preview/adrenalineTheme.css'
import { blankMonstre } from '../sample'
import {
    monsterStates,
    resolveMonsterProfile,
    type MonsterDocument,
} from '../states'

export function MonstrePreview() {
    const { document, openSection } = useAdrenalineDocument(
        'adrenaline.monstre',
        blankMonstre() as unknown as Record<string, unknown>
    )
    const profile = resolveMonsterProfile(document) as MonsterDocument
    const states = monsterStates(document)
    const activeId = String(document.etatActif ?? 'base')
    const activeState = states.find((state) => state.id === activeId)
    const stats = (profile.caracteristiques ?? {}) as Record<string, unknown>
    const contagion = (profile.contagion ?? {}) as Record<string, unknown>
    const health = (profile.sante ?? {}) as Record<string, unknown>
    const protections = (profile.protections ?? {}) as Record<string, unknown>
    const equipment = (profile.equipement ?? {}) as Record<string, unknown>
    const narrative = (profile.narratif ?? {}) as Record<string, unknown>
    const meta = (profile.meta ?? {}) as Record<string, unknown>
    const list = (value: unknown) => (Array.isArray(value) ? value : [])
    return (
        <article className="adr-doc adr-card mx-auto w-full max-w-[620px] overflow-hidden">
            <AdrenalineHeader
                eyebrow="Système Adrenaline · Monstre"
                title={String(profile.nom ?? 'Monstre sans nom')}
                aside={<span>ND {String(profile.niveauDeDanger ?? '—')}</span>}
            />
            <button
                type="button"
                className="block w-full text-left"
                onClick={() => openSection('basic')}
            >
                <AdrenalineSection title="Corps et instinct">
                    <p className="m-0">
                        {[
                            profile.typeDeCorps,
                            profile.instinct,
                            profile.description,
                        ]
                            .filter(Boolean)
                            .join(' · ') || 'À décrire'}
                    </p>
                </AdrenalineSection>
            </button>
            <button
                type="button"
                className="block w-full text-left"
                onClick={() => openSection('health')}
            >
                <AdrenalineSection title="Santé">
                    <p className="m-0">
                        {Object.keys(health).join(' · ') || 'Non renseignée'}
                    </p>
                </AdrenalineSection>
            </button>
            <button
                type="button"
                className="block w-full text-left"
                onClick={() => openSection('protections')}
            >
                <AdrenalineSection title="Protections">
                    <p className="m-0">
                        {Object.keys(protections).join(' · ') || 'Aucune'}
                    </p>
                </AdrenalineSection>
            </button>
            <button
                type="button"
                className="block w-full text-left"
                onClick={() => openSection('behaviour')}
            >
                <AdrenalineSection title="Comportement et traits">
                    <p className="m-0">
                        {[
                            ...list(profile.comportement),
                            ...list(profile.traitsSpeciaux),
                        ].join(' · ') || 'Aucun trait'}
                    </p>
                </AdrenalineSection>
            </button>
            <button
                type="button"
                className="block w-full text-left"
                onClick={() => openSection('skills')}
            >
                <AdrenalineSection title="Compétences">
                    <p className="m-0">
                        {list(profile.competences)
                            .map((entry) =>
                                String(
                                    (entry as Record<string, unknown>).nom ??
                                        'Compétence'
                                )
                            )
                            .join(' · ') || 'Aucune'}
                    </p>
                </AdrenalineSection>
            </button>
            <button
                type="button"
                className="block w-full text-left"
                onClick={() => openSection('equipment')}
            >
                <AdrenalineSection title="Équipement">
                    <p className="m-0">
                        {list(equipment.possessions).join(' · ') || 'Aucun'}
                    </p>
                </AdrenalineSection>
            </button>
            <button
                type="button"
                className="block w-full text-left"
                onClick={() => openSection('statistics')}
            >
                <AdrenalineSection title="Caractéristiques">
                    <AdrenalineStatGrid
                        values={Object.entries(stats).map(([label, value]) => ({
                            label: label.toUpperCase(),
                            value: currentValue(value),
                        }))}
                    />
                </AdrenalineSection>
            </button>
            <button
                type="button"
                className="block w-full text-left"
                onClick={() => openSection('states')}
            >
                <AdrenalineSection title="États">
                    <p className="m-0">
                        Profil actif : {activeState?.nom ?? 'profil de base'}
                    </p>
                    <p className="m-0">
                        États disponibles :{' '}
                        {states.map((state) => state.nom).join(' · ') || 'aucun'}
                    </p>
                </AdrenalineSection>
            </button>
            {Object.keys(contagion).length ? (
                <button
                    type="button"
                    className="block w-full text-left"
                    onClick={() => openSection('contagion')}
                >
                    <AdrenalineSection title="Contagion">
                        <p className="m-0">
                            {String(contagion.agent ?? 'Agent non précisé')}
                        </p>
                    </AdrenalineSection>
                </button>
            ) : null}
            <button
                type="button"
                className="block w-full text-left"
                onClick={() => openSection('narrative')}
            >
                <AdrenalineSection title="Narratif">
                    <p className="m-0">
                        {[
                            narrative.role,
                            narrative.attitude,
                            narrative.evolutionPossible,
                        ]
                            .filter(Boolean)
                            .join(' · ') || 'Non renseigné'}
                    </p>
                </AdrenalineSection>
            </button>
            <button
                type="button"
                className="block w-full text-left"
                onClick={() => openSection('meta')}
            >
                <AdrenalineSection title="Provenance">
                    <p className="m-0">
                        {[meta.source, meta.page, meta.licence]
                            .filter(Boolean)
                            .join(' · ') || 'Non renseignée'}
                    </p>
                </AdrenalineSection>
            </button>
        </article>
    )
}
