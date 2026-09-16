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
        </article>
    )
}
