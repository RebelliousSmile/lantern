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
                <AdrenalineSection title="Contagion">
                    <p className="m-0">
                        {String(contagion.agent ?? 'Agent non précisé')}
                    </p>
                </AdrenalineSection>
            ) : null}
        </article>
    )
}
