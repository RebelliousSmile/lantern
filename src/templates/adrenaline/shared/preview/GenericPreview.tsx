import { useActiveTemplateTab } from '@/core/workspace/selectors'
import {
    AdrenalineHeader,
    AdrenalineSection,
    AdrenalineStatGrid,
} from './SheetPrimitives'
import './adrenalineTheme.css'

const physical = ['for', 'con', 'dex', 'rap']
const mental = ['log', 'vol', 'per', 'cha']

const labels: Record<string, string> = {
    for: 'FOR',
    con: 'CON',
    dex: 'DEX',
    rap: 'RAP',
    log: 'LOG',
    vol: 'VOL',
    per: 'PER',
    cha: 'CHA',
}

function text(value: unknown) {
    return typeof value === 'string' && value.trim() ? value : null
}

export function AdrenalinePreview({
    templateId,
    kind,
}: {
    templateId: string
    kind: 'PJ' | 'PNJ' | 'Monstre'
}) {
    const tab = useActiveTemplateTab<Record<string, unknown>>(templateId)
    const doc = tab?.doc ?? {}
    const characteristics = (doc.caracteristiques ?? {}) as Record<
        string,
        number
    >
    const narrative = (doc.narratif ?? {}) as Record<string, unknown>
    const description = text(doc.description)
    const items = [
        ...(Array.isArray(doc.comportement) ? doc.comportement : []),
        ...(Array.isArray(doc.traitsSpeciaux) ? doc.traitsSpeciaux : []),
        ...(Array.isArray(doc.equipement) ? doc.equipement : []),
    ].filter((item): item is string => typeof item === 'string')

    return (
        <article className="adr-doc adr-card mx-auto w-full max-w-[680px] overflow-hidden">
            <AdrenalineHeader
                aside={
                    typeof doc.niveauDeDanger === 'number' ? (
                        <span className="text-sm font-bold">
                            ND {doc.niveauDeDanger}
                        </span>
                    ) : null
                }
                eyebrow={`Système Adrenaline · ${kind}`}
                title={text(doc.nom) ?? `Sans nom`}
            />
            {description ? (
                <AdrenalineSection title="Présentation">
                    <p className="m-0 leading-relaxed">{description}</p>
                </AdrenalineSection>
            ) : null}
            {Object.keys(characteristics).length ? (
                <AdrenalineSection title="Caractéristiques">
                    <AdrenalineStatGrid
                        values={[...physical, ...mental]
                            .filter((key) => key in characteristics)
                            .map((key) => ({
                                label: labels[key],
                                value: characteristics[key],
                            }))}
                    />
                </AdrenalineSection>
            ) : null}
            {items.length ? (
                <AdrenalineSection title="Actions et ressources">
                    <ul className="adr-list">
                        {items.map((item, index) => (
                            <li key={`${item}-${index}`}>{item}</li>
                        ))}
                    </ul>
                </AdrenalineSection>
            ) : null}
            {kind === 'Monstre' && doc.etatAlternatif ? (
                <AdrenalineSection title="État alternatif">
                    <p className="m-0">
                        {text(
                            (doc.etatAlternatif as Record<string, unknown>).nom
                        ) ?? 'État non nommé'}
                    </p>
                </AdrenalineSection>
            ) : null}
            {kind === 'PNJ' && text(narrative.role) ? (
                <AdrenalineSection title="Notes de jeu">
                    <p className="m-0">{text(narrative.role)}</p>
                </AdrenalineSection>
            ) : null}
        </article>
    )
}
