import { useAdrenalineDocument } from '../../shared/hooks'
import {
    AdrenalineHeader,
    AdrenalineSection,
    AdrenalineStatGrid,
} from '../../shared/preview/SheetPrimitives'
import '../../shared/preview/adrenalineTheme.css'
import { blankPnj } from '../sample'

export function PnjPreview() {
    const { document, openSection } = useAdrenalineDocument(
        'adrenaline.pnj',
        blankPnj() as unknown as Record<string, unknown>
    )
    const stats = (document.caracteristiques ?? {}) as Record<string, number>
    const narrative = (document.narratif ?? {}) as Record<string, unknown>
    const identity = (document.identite ?? {}) as Record<string, unknown>
    const health = (document.sante ?? {}) as Record<string, unknown>
    const protections = (document.protections ?? {}) as Record<string, unknown>
    const equipment = (document.equipement ?? {}) as Record<string, unknown>
    const formations = Array.isArray(document.formations) ? document.formations as Record<string, unknown>[] : []
    const skills = Array.isArray(document.competences) ? document.competences as Record<string, unknown>[] : []
    const meta = (document.meta ?? {}) as Record<string, unknown>
    return (
        <article className="adr-doc adr-card mx-auto w-full max-w-[620px] overflow-hidden">
            <AdrenalineHeader
                eyebrow="Système Adrenaline · PNJ"
                title={String(document.nom ?? 'PNJ sans nom')}
                aside={<span>ND {String(document.niveauDeDanger ?? '—')}</span>}
            />
            <button
                className="block w-full text-left"
                onClick={() => openSection('basic')}
                type="button"
            >
                <AdrenalineSection title="Présentation">
                    <p className="m-0">
                        {String(document.description ?? 'À décrire')}
                    </p>
                </AdrenalineSection>
            </button>
            <button className="block w-full text-left" type="button" onClick={() => openSection('identity')}><AdrenalineSection title="Identité"><p className="m-0">{Object.values(identity).filter((value) => typeof value === 'string' || typeof value === 'number').join(' · ') || 'Non renseignée'}</p></AdrenalineSection></button>
            <button
                className="block w-full text-left"
                onClick={() => openSection('statistics')}
                type="button"
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
            <button className="block w-full text-left" type="button" onClick={() => openSection('health')}><AdrenalineSection title="Santé"><p className="m-0">{Object.keys(health).join(' · ') || 'Non renseignée'}</p></AdrenalineSection></button>
            <button className="block w-full text-left" type="button" onClick={() => openSection('protections')}><AdrenalineSection title="Protections"><p className="m-0">{Object.keys(protections).join(' · ') || 'Aucune'}</p></AdrenalineSection></button>
            <button className="block w-full text-left" type="button" onClick={() => openSection('formations')}><AdrenalineSection title="Formations et compétences"><p className="m-0">{[...formations, ...skills].map((entry) => String(entry.nom ?? 'Compétence')).join(' · ') || 'Aucune'}</p></AdrenalineSection></button>
            <button className="block w-full text-left" type="button" onClick={() => openSection('equipment')}><AdrenalineSection title="Équipement"><p className="m-0">{Array.isArray(equipment.possessions) ? equipment.possessions.join(' · ') : 'Aucun'}</p></AdrenalineSection></button>
            <button
                className="block w-full text-left"
                onClick={() => openSection('narrative')}
                type="button"
            >
                <AdrenalineSection title="Notes MJ">
                    <p className="m-0">
                        {String(narrative.role ?? 'Aucun rôle défini')}
                    </p>
                </AdrenalineSection>
            </button>
            <button className="block w-full text-left" type="button" onClick={() => openSection('meta')}><AdrenalineSection title="Provenance"><p className="m-0">{[meta.source, meta.page, meta.licence].filter(Boolean).join(' · ') || 'Non renseignée'}</p></AdrenalineSection></button>
        </article>
    )
}
