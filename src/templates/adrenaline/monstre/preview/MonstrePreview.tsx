import { useAdrenalineDocument } from '../../shared/hooks'
import {
    AdrenalineHeader,
    AdrenalineSection,
    AdrenalineStatGrid,
} from '../../shared/preview/SheetPrimitives'
import '../../shared/preview/adrenalineTheme.css'
import { blankMonstre } from '../sample'

export function MonstrePreview() {
    const { document, openSection } = useAdrenalineDocument(
        'adrenaline.monstre',
        blankMonstre() as unknown as Record<string, unknown>
    )
    const stats = (document.caracteristiques ?? {}) as Record<string, number>
    const alternate = (document.etatAlternatif ?? {}) as Record<string, unknown>
    const contagion = (document.contagion ?? {}) as Record<string, unknown>
    const health = (document.sante ?? {}) as Record<string, unknown>
    const protections = (document.protections ?? {}) as Record<string, unknown>
    const equipment = (document.equipement ?? {}) as Record<string, unknown>
    const narrative = (document.narratif ?? {}) as Record<string, unknown>
    const meta = (document.meta ?? {}) as Record<string, unknown>
    const list = (value: unknown) => Array.isArray(value) ? value : []
    return (
        <article className="adr-doc adr-card mx-auto w-full max-w-[620px] overflow-hidden">
            <AdrenalineHeader
                eyebrow="Système Adrenaline · Monstre"
                title={String(document.nom ?? 'Monstre sans nom')}
                aside={<span>ND {String(document.niveauDeDanger ?? '—')}</span>}
            />
            <button
                type="button"
                className="block w-full text-left"
                onClick={() => openSection('basic')}
            >
                <AdrenalineSection title="Corps et instinct">
                    <p className="m-0">
                        {[
                            document.typeDeCorps,
                            document.instinct,
                            document.description,
                        ]
                            .filter(Boolean)
                            .join(' · ') || 'À décrire'}
                    </p>
                </AdrenalineSection>
            </button>
            <button type="button" className="block w-full text-left" onClick={() => openSection('health')}><AdrenalineSection title="Santé"><p className="m-0">{Object.keys(health).join(' · ') || 'Non renseignée'}</p></AdrenalineSection></button>
            <button type="button" className="block w-full text-left" onClick={() => openSection('protections')}><AdrenalineSection title="Protections"><p className="m-0">{Object.keys(protections).join(' · ') || 'Aucune'}</p></AdrenalineSection></button>
            <button type="button" className="block w-full text-left" onClick={() => openSection('behaviour')}><AdrenalineSection title="Comportement et traits"><p className="m-0">{[...list(document.comportement), ...list(document.traitsSpeciaux)].join(' · ') || 'Aucun trait'}</p></AdrenalineSection></button>
            <button type="button" className="block w-full text-left" onClick={() => openSection('skills')}><AdrenalineSection title="Compétences"><p className="m-0">{list(document.competences).map((entry) => String((entry as Record<string, unknown>).nom ?? 'Compétence')).join(' · ') || 'Aucune'}</p></AdrenalineSection></button>
            <button type="button" className="block w-full text-left" onClick={() => openSection('equipment')}><AdrenalineSection title="Équipement"><p className="m-0">{list(equipment.possessions).join(' · ') || 'Aucun'}</p></AdrenalineSection></button>
            <button
                type="button"
                className="block w-full text-left"
                onClick={() => openSection('statistics')}
            >
                <AdrenalineSection title="Caractéristiques">
                    <AdrenalineStatGrid
                        values={Object.entries(stats).map(([label, value]) => ({
                            label: label.toUpperCase(),
                            value,
                        }))}
                    />
                </AdrenalineSection>
            </button>
            <button
                type="button"
                className="block w-full text-left"
                onClick={() => openSection('alternate')}
            >
                <AdrenalineSection title="État alternatif">
                    <p className="m-0">
                        {String(alternate.nom ?? 'Aucun état alternatif')}
                    </p>
                </AdrenalineSection>
            </button>
            {Object.keys(contagion).length ? (
                <button type="button" className="block w-full text-left" onClick={() => openSection('contagion')}><AdrenalineSection title="Contagion">
                    <p className="m-0">
                        {String(contagion.agent ?? 'Agent non précisé')}
                    </p>
                </AdrenalineSection></button>
            ) : null}
            <button type="button" className="block w-full text-left" onClick={() => openSection('narrative')}><AdrenalineSection title="Narratif"><p className="m-0">{[narrative.role, narrative.attitude, narrative.evolutionPossible].filter(Boolean).join(' · ') || 'Non renseigné'}</p></AdrenalineSection></button>
            <button type="button" className="block w-full text-left" onClick={() => openSection('meta')}><AdrenalineSection title="Provenance"><p className="m-0">{[meta.source, meta.page, meta.licence].filter(Boolean).join(' · ') || 'Non renseignée'}</p></AdrenalineSection></button>
        </article>
    )
}
