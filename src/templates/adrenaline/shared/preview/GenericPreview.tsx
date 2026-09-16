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
    const identity = (doc.identite ?? {}) as Record<string, unknown>
    const health = (doc.sante ?? {}) as Record<string, Record<string, unknown>>
    const protections = (doc.protections ?? {}) as Record<
        string,
        Record<string, unknown>
    >
    const description = text(doc.description)
    const items = [
        ...(Array.isArray(doc.comportement) ? doc.comportement : []),
        ...(Array.isArray(doc.traitsSpeciaux) ? doc.traitsSpeciaux : []),
        ...(Array.isArray(doc.equipement) ? doc.equipement : []),
    ].filter((item): item is string => typeof item === 'string')
    const identityLine = Object.values(identity)
        .flatMap((value) => (Array.isArray(value) ? value : [value]))
        .filter((value): value is string | number =>
            ['string', 'number'].includes(typeof value)
        )
        .join(' · ')
    const thresholds = ['superficiel', 'leger', 'grave', 'profond'].map(
        (level) => {
            const physical = health.physique?.[level] as
                | Record<string, unknown>
                | undefined
            const mental = health.mental?.[level] as
                | Record<string, unknown>
                | undefined
            return {
                label: level,
                value: [physical?.base, mental?.base]
                    .filter((value) => typeof value === 'number')
                    .join(' / '),
            }
        }
    )
    const formations = Array.isArray(doc.formations)
        ? doc.formations
              .map((entry) => text((entry as Record<string, unknown>).nom))
              .filter((entry): entry is string => Boolean(entry))
        : []
    const competences = Array.isArray(doc.competences)
        ? doc.competences
              .map((entry) => text((entry as Record<string, unknown>).nom))
              .filter((entry): entry is string => Boolean(entry))
        : []

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
            {identityLine ? (
                <AdrenalineSection title="Identité">
                    <p className="m-0 text-sm">{identityLine}</p>
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
            {thresholds.some((threshold) => threshold.value) ? (
                <AdrenalineSection title="Santé et protections">
                    <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                        {thresholds.map((threshold) => (
                            <div key={threshold.label}>
                                <strong className="block capitalize text-[0.7rem] text-[var(--adr-burgundy)]">
                                    {threshold.label}
                                </strong>
                                {threshold.value || '—'}
                            </div>
                        ))}
                    </div>
                    {Object.keys(protections).length ? (
                        <p className="mt-3 mb-0 text-sm">
                            Solidité :{' '}
                            {String(protections.physiques?.solidite ?? '—')}{' '}
                            physique ·{' '}
                            {String(protections.mentales?.solidite ?? '—')}{' '}
                            mentale
                        </p>
                    ) : null}
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
            {formations.length || competences.length ? (
                <AdrenalineSection title="Formations et compétences">
                    <p className="m-0 text-sm">
                        {[...formations, ...competences].join(' · ')}
                    </p>
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
