import { translate, type TranslationValues } from '@/i18n/text'
import type { ReactNode } from 'react'
import {
    PJ_PRESENTATION,
    type AdrenalinePresentationBlock,
    type AdrenalinePresentationSection,
} from 'schema-adrenaline/presentation'
import { pjLimit } from '../editor/pjLimits'
import { enumAt, STATE_SIDES } from '../editor/schemaShapes'
import {
    formationColumns,
    formationTypeLabel,
    SKILL_LINES,
} from '../formations'
import {
    asRecord,
    at,
    fieldRows,
    lastSegment,
    sortedBlocks,
} from '../presentation'
import { currentValue } from './SheetPrimitives'

/*
 * One component per published block form. The presentation names the blocks, their order, their
 * placement and their decorations; field names and enum values stay with the consumer. The sheet
 * speaks the language of its published labels, whatever the reader's interface language.
 */
const SHEET_LANGUAGE = 'fr'

function t(key: string, values?: TranslationValues) {
    return translate(
        `adrenaline:${key}` as Parameters<typeof translate>[0],
        values,
        SHEET_LANGUAGE
    )
}

type Source = Record<string, unknown>
type BlockProps = { block: AdrenalinePresentationBlock; source: Source }

function text(value: unknown, suffix = ''): string {
    const shown = currentValue(value)
    return shown === undefined || shown === '' ? '' : `${shown}${suffix}`
}

function strings(value: unknown): string[] {
    return Array.isArray(value)
        ? value.filter((item): item is string => typeof item === 'string')
        : []
}

function records(value: unknown): Record<string, unknown>[] {
    return Array.isArray(value)
        ? value
              .map(asRecord)
              .filter((item): item is Record<string, unknown> => !!item)
        : []
}

function humanize(value: string): string {
    const spaced = value.replace(/-/g, ' ')
    return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

function rangePart(value: unknown, part: 'minimum' | 'current') {
    const record = asRecord(value)
    return currentValue(
        record?.[part] ?? (part === 'current' ? value : undefined)
    )
}

function Value({
    children,
    className,
}: {
    children?: ReactNode
    className: string
}) {
    return <span className={`adr-pj__value ${className}`}>{children}</span>
}

function Subhead({
    label,
    trailing = [],
}: {
    label: string
    trailing?: readonly string[]
}) {
    return (
        <h5 className="adr-pj__block-title">
            {label}
            {trailing.length > 0 && (
                <span className="adr-pj__subhead-trailing">
                    {trailing.map((item, index) => (
                        <span className="adr-pj__subhead-head" key={index}>
                            {item}
                        </span>
                    ))}
                </span>
            )}
        </h5>
    )
}

function WriteLine({ label, value }: { label: string; value: string }) {
    return (
        <div className="adr-pj__write-line">
            <b className="adr-pj__write-label">{label}</b>
            <Value className="adr-pj__write-field">{value}</Value>
        </div>
    )
}

function Metric({
    name,
    values,
    className = '',
}: {
    name: ReactNode
    values: readonly string[]
    className?: string
}) {
    return (
        <div
            className={`adr-pj__metric adr-pj__metric-${values.length} ${className}`}
        >
            <span className="adr-pj__metric-name">{name}</span>
            {values.map((item, index) => (
                <Value className="adr-pj__metric-value" key={index}>
                    {item}
                </Value>
            ))}
        </div>
    )
}

function MetricHeads({ heads }: { heads: readonly string[] }) {
    return (
        <div className={`adr-pj__metric-heads adr-pj__metric-${heads.length}`}>
            <span className="adr-pj__metric-name" />
            {heads.map((head) => (
                <span className="adr-pj__metric-head" key={head}>
                    {head}
                </span>
            ))}
        </div>
    )
}

function Circles({ count, filled }: { count: number; filled: number }) {
    return Array.from({ length: count }, (_, index) => (
        <i
            className={`adr-pj__dot-mark ${index < filled ? 'adr-pj__dot-filled' : ''}`}
            key={index}
        />
    ))
}

function NameCard({ block, source }: BlockProps) {
    const suffix =
        block.valueSuffix && block.valueSuffix !== block.label
            ? ` ${block.valueSuffix}`
            : ''
    return (
        <>
            <span className="adr-pj__card-label">{block.label}</span>
            <Value className="adr-pj__card-value">
                {block.paths
                    .map((pointer) => text(at(source, pointer), suffix))
                    .filter(Boolean)
                    .join(' · ')}
            </Value>
        </>
    )
}

const PARAMETER_LABELS: Record<string, string> = {
    joueur: 'player',
    typeDeCreation: 'creation',
    typeDeScenario: 'scenario',
    declinaisonDeCampagne: 'campaign',
}
/* The values the schema lists for the three enumerated parameters: nothing restated here. */
const PARAMETER_VALUES: readonly string[] = [
    'typeDeCreation',
    'typeDeScenario',
    'declinaisonDeCampagne',
].reduce<string[]>(
    (all, key) => all.concat(enumAt('pj', `/parametresDuJeu/${key}`)),
    []
)

/* The label the presentation publishes for a location id; the id itself when it publishes none. */
const LOCATION_LABELS: Record<string, string> = PJ_PRESENTATION.sections.reduce<
    Record<string, string>
>(
    (all, section) =>
        (section.blocks as readonly AdrenalinePresentationBlock[]).reduce(
            (labels, block) => {
                const locations = (
                    block.decoration as
                        | { locations?: { id: string; label: string }[] }
                        | undefined
                )?.locations
                return (locations ?? []).reduce(
                    (found, { id, label }) => ({ ...found, [id]: label }),
                    labels
                )
            },
            all
        ),
    {}
)

/** The line printed under the sheet label: the subtitle pointers of the game parameters, as entered. */
export function parametersSubtitle(
    block: BlockProps['block'],
    source: BlockProps['source']
): string {
    return (block.subtitlePaths ?? [])
        .map((pointer) => {
            const raw = text(at(source, pointer))
            return PARAMETER_VALUES.includes(raw)
                ? t(`pj.sheet.values.${raw}`)
                : raw
        })
        .filter(Boolean)
        .join(' · ')
}

function GameParameters({ block, source }: BlockProps) {
    return (
        <>
            <span className="adr-pj__card-label">{block.label}</span>
            <div className="adr-pj__card-fields">
                {block.paths.map((pointer, index) => {
                    /* A pointer printed as a subtitle, under the sheet label, is not a row. */
                    if ((block.subtitlePaths ?? []).includes(pointer))
                        return null
                    const key = lastSegment(pointer)
                    const raw = text(at(source, pointer))
                    return (
                        <WriteLine
                            key={key}
                            label={
                                block.rowLabels?.[index] ??
                                (PARAMETER_LABELS[key]
                                    ? t(
                                          `pj.sheet.parameters.${PARAMETER_LABELS[key]}`
                                      )
                                    : humanize(key))
                            }
                            value={
                                PARAMETER_VALUES.includes(raw)
                                    ? t(`pj.sheet.values.${raw}`)
                                    : raw
                            }
                        />
                    )
                })}
            </div>
        </>
    )
}

function FormationColumns({ block, source }: BlockProps) {
    const suffix = block.valueSuffix ?? ''
    const fields = block.formationFields
    /* Read by name, not by position: the published list grows (caracteristique since 2.7.0). */
    const competenceFields: readonly string[] = fields?.competence ?? [
        'nom',
        'specialite',
        'pourcentage',
    ]
    const printed = (key: string) => competenceFields.includes(key)
    const [typeKey, formationNameKey, formationScoreKey] = fields?.header ?? [
        'type',
        'nom',
        'pourcentage',
    ]
    return (
        <div className="adr-pj__block-grid">
            {formationColumns(records(at(source, block.paths[0]))).map(
                ({ type, formation }, index) => {
                    const skills = records(formation?.competences)
                    const lines: (Record<string, unknown> | undefined)[] = [
                        ...skills,
                    ]
                    while (lines.length < SKILL_LINES) lines.push(undefined)
                    const typeLabel = formationTypeLabel(
                        String(formation?.[typeKey] ?? type)
                    )
                    return (
                        <div
                            className="adr-pj__formation"
                            data-zone={`formation:${type}`}
                            key={index}
                        >
                            <Subhead
                                label={t('pj.sheet.training')}
                                trailing={[suffix]}
                            />
                            <div className="adr-pj__metric-list">
                                <div className="adr-pj__metric adr-pj__formation-head">
                                    <span className="adr-pj__metric-name">
                                        {(() => {
                                            const name = text(
                                                formation?.[formationNameKey]
                                            )
                                            return name.trim() === '' ? (
                                                <span className="adr-pj__formation-type">
                                                    {typeLabel}
                                                </span>
                                            ) : (
                                                <>
                                                    <span className="adr-pj__formation-type">
                                                        {typeLabel} (
                                                    </span>
                                                    <Value className="adr-pj__formation-name">
                                                        {name}
                                                    </Value>
                                                    <span className="adr-pj__formation-type">
                                                        )
                                                    </span>
                                                </>
                                            )
                                        })()}
                                    </span>
                                    <Value className="adr-pj__metric-value">
                                        {text(formation?.[formationScoreKey])}
                                    </Value>
                                </div>
                            </div>
                            <Subhead
                                label={t('shared.skills.label')}
                                trailing={[suffix]}
                            />
                            <div className="adr-pj__metric-list">
                                {lines.map((competence, rank) => {
                                    const specialty = printed('specialite')
                                        ? text(competence?.specialite)
                                        : ''
                                    const characteristic = printed(
                                        'caracteristique'
                                    )
                                        ? text(
                                              competence?.caracteristique
                                          ).toUpperCase()
                                        : ''
                                    const name = competence
                                        ? `${text(competence.nom)}${specialty ? ` (${specialty})` : ''}${characteristic ? ` (${characteristic})` : ''}`
                                        : ''
                                    return (
                                        <div
                                            className="adr-pj__competence"
                                            data-zone={`skill:${type}:${rank}`}
                                            key={rank}
                                        >
                                            <div className="adr-pj__metric">
                                                <Value className="adr-pj__metric-name">
                                                    {name}
                                                </Value>
                                                <Value className="adr-pj__metric-value">
                                                    {text(
                                                        competence?.pourcentage
                                                    )}
                                                </Value>
                                            </div>
                                            {typeof competence?.notes ===
                                                'string' &&
                                                competence.notes && (
                                                    <p className="adr-pj__note">
                                                        {competence.notes}
                                                    </p>
                                                )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                }
            )}
        </div>
    )
}

/* Field names stay with the consumer, their printed rows come from the presentation. */
const IDENTITY_LABELS: Record<string, string> = {
    nationalite: 'nationality',
    cheveux: 'hair',
    yeux: 'eyes',
    peau: 'skin',
    signesParticuliers: 'distinguishingMarks',
    genre: 'gender',
    age: 'age',
    taille: 'height',
    poids: 'weight',
}

function IdentityFields({ block, source }: BlockProps) {
    const identity = asRecord(at(source, block.paths[0])) ?? {}
    const rows =
        fieldRows(block) ?? Object.keys(IDENTITY_LABELS).map((key) => [key])
    return (
        <div className="adr-pj__field-rows">
            {rows.map((row) =>
                row.map((key) => {
                    const raw = identity[key]
                    const age = text(raw)
                    const shown = Array.isArray(raw)
                        ? strings(raw).join(' · ')
                        : key === 'age' && age
                          ? t('pj.sheet.years', { age })
                          : text(raw)
                    const label = IDENTITY_LABELS[key]
                    return (
                        <div
                            className={
                                row.length === 1
                                    ? 'adr-pj__field adr-pj__field--across'
                                    : 'adr-pj__field'
                            }
                            key={key}
                        >
                            <WriteLine
                                label={
                                    label
                                        ? t(`shared.identity.${label}`)
                                        : humanize(key)
                                }
                                value={shown}
                            />
                        </div>
                    )
                })
            )}
        </div>
    )
}

const RANGE_HEADS = {
    minimum: 'rangeMinimum',
    current: 'rangeCurrent',
} as const

function CharacteristicRows({ block, source }: BlockProps) {
    const parts = block.rangeDisplay ?? ['current']
    const suffix = block.valueSuffix ? ` ${block.valueSuffix}` : ''
    return (
        <>
            {/* One column needs no heading: the sheet prints a bare value. */}
            {parts.length > 1 && (
                <MetricHeads
                    heads={parts.map((part) =>
                        t(`pj.sheet.${RANGE_HEADS[part]}`)
                    )}
                />
            )}
            <div className="adr-pj__metric-list">
                {block.paths.map((pointer, index) => (
                    <Metric
                        className="adr-pj__characteristic"
                        key={pointer}
                        name={
                            block.rowLabels?.[index] ??
                            humanize(lastSegment(pointer))
                        }
                        values={parts.map((part) => {
                            const found = rangePart(at(source, pointer), part)
                            return found === undefined
                                ? ''
                                : `${found}${suffix}`
                        })}
                    />
                ))}
            </div>
        </>
    )
}

const FIELD_LABELS: Record<string, string> = {
    possessions: 'shared.equipment.possessions',
    equipementFavori: 'shared.equipment.favouriteGear',
}

function RuledList({ block, source }: BlockProps) {
    return block.paths.map((pointer, rank) => {
        const found = at(source, pointer)
        const key = lastSegment(pointer)
        /* The first path of a ruled list is the list; with nothing entered yet its lines stay to be written on. */
        if (Array.isArray(found) || (found === undefined && rank === 0)) {
            const lines = (Array.isArray(found) ? found : []).map((item) =>
                text(item)
            )
            while (lines.length < (block.minimumRows ?? 0)) lines.push('')
            return (
                <div className="adr-pj__ruled-list" key={pointer}>
                    {lines.map((line, index) => (
                        <Value className="adr-pj__ruled-line" key={index}>
                            {line}
                        </Value>
                    ))}
                </div>
            )
        }
        return (
            <WriteLine
                key={pointer}
                label={FIELD_LABELS[key] ? t(FIELD_LABELS[key]) : humanize(key)}
                value={text(found)}
            />
        )
    })
}

function WeaponLines({ block, source }: BlockProps) {
    const die =
        block.decoration?.kind === 'weapon-die' ? block.decoration.label : ''
    /* Empty lines stay to be written on. */
    const weapons: (Record<string, unknown> | undefined)[] = records(
        at(source, block.paths[0])
    )
    while (weapons.length < (block.minimumRows ?? 0)) weapons.push(undefined)
    return weapons.map((weapon, index) => (
        <div
            className="adr-pj__weapon"
            data-zone={`weapon:${index}`}
            key={index}
        >
            <div className="adr-pj__weapon-line">
                <Value className="adr-pj__write-field">
                    {weapon ? String(weapon.nom ?? '') : ''}
                </Value>
                <Value className="adr-pj__weapon-score">
                    {weapon ? text(weapon.pourcentage, ' %') : ''}
                </Value>
                <Value
                    className={`adr-pj__weapon-damage${
                        typeof weapon?.nature === 'string' &&
                        /^[a-z][a-z0-9-]*$/.test(weapon.nature)
                            ? ` adr-pj__die adr-pj__die--${weapon.nature}`
                            : ''
                    }`}
                >
                    {/* The die's unit follows a written count: an empty line prints nothing. */}
                    {weapon?.desDeDegats !== undefined
                        ? `${text(weapon.desDeDegats)} ${die}`.trim()
                        : ''}
                </Value>
            </div>
        </div>
    ))
}

function UnitLine({
    label,
    field,
    amount,
}: {
    label: string
    field: string
    amount: string
}) {
    return (
        <div className="adr-pj__unit-line">
            <b className="adr-pj__write-label">{label}</b>
            <Value className="adr-pj__write-field">{field}</Value>
            <Value className="adr-pj__unit-value">{amount}</Value>
        </div>
    )
}

/* Protection lines, then the grid of the published locations: a covered one ticks its first box. */
function LocationGrid({ block, source }: BlockProps) {
    const grid =
        block.decoration?.kind === 'location-grid'
            ? block.decoration
            : undefined
    if (!grid) return null
    const physical = grid.side === 'physical'
    const side = asRecord(at(source, block.paths[0])) ?? {}
    const cover = asRecord(physical ? side.armure : side.caractere)
    const covered = strings(cover?.localisations)
    return (
        <>
            <UnitLine
                label={
                    physical
                        ? t('shared.protection.armour')
                        : t('pj.sheet.character')
                }
                field={text(physical ? cover?.nom : cover?.trait)}
                amount={text(cover?.points)}
            />
            <div className="adr-pj__locations">
                {grid.locations.map((location) => (
                    <div className="adr-pj__location" key={location.id}>
                        <span className="adr-pj__location-range">
                            {location.range}
                        </span>
                        <span className="adr-pj__location-label">
                            {location.label}
                        </span>
                        <span className="adr-pj__location-boxes">
                            <Circles
                                count={grid.boxes}
                                filled={
                                    covered.indexOf(location.id) >= 0 ? 1 : 0
                                }
                            />
                        </span>
                    </div>
                ))}
            </div>
        </>
    )
}

const STRESS = [
    ['adrenaline', 'adrenaline', 'favorable', 'favourable'],
    ['panique', 'panic', 'defavorable', 'unfavourable'],
] as const

function StressDice({ block, source }: BlockProps) {
    const stress = asRecord(at(source, block.paths[0])) ?? {}
    const dice =
        block.decoration?.kind === 'dice-options' ? block.decoration : undefined
    return (
        <div className="adr-pj__stress-grid">
            {STRESS.map(([key, label, side, sideLabel]) => {
                const count = Number(currentValue(stress[key])) || 0
                return (
                    <div className="adr-pj__stress-card" key={key}>
                        <span className="adr-pj__card-label">
                            {t(`pj.sheet.${label}`)}
                        </span>
                        {(dice?.[side] ?? []).map((die, index) => (
                            <div className="adr-pj__stress-roll" key={die}>
                                <Circles
                                    count={1}
                                    filled={count === index + 1 ? 1 : 0}
                                />
                                <strong className="adr-pj__stress-die">
                                    {die.replace('-', '−')}
                                </strong>
                                <small className="adr-pj__stress-side">
                                    {t(`pj.sheet.${sideLabel}`)}
                                </small>
                            </div>
                        ))}
                    </div>
                )
            })}
        </div>
    )
}

/** The noun of the malus the sheet counts: read from the published legend ("1 malus = -10 %"). */
function malusNoun(): string {
    for (const section of PJ_PRESENTATION.sections)
        for (const block of section.blocks)
            if (block.form === 'malus-scale')
                for (const note of block.notes ?? []) {
                    const found = /^\d+\s+(\S+)/.exec(note)
                    if (found) return found[1]
                }
    return t('pj.sheet.malus')
}

function ThresholdRows({ block, source }: BlockProps) {
    const pointer = block.paths[0]
    const side = asRecord(at(source, pointer)) ?? {}
    return (
        <>
            <div className="adr-pj__metric-list">
                {(block.thresholdLevels ?? []).map((level) => {
                    const threshold = asRecord(side[level.key])
                    return (
                        <Metric
                            key={level.key}
                            name={
                                <>
                                    {level.label}
                                    <span className="adr-pj__threshold-malus">
                                        {level.malus} {malusNoun()}
                                    </span>
                                </>
                            }
                            values={[text(threshold?.base)]}
                        />
                    )
                })}
            </div>
        </>
    )
}

function Track({
    label,
    modifier,
    children,
    written,
}: {
    label: string
    modifier?: string
    children: ReactNode
    written?: ReactNode
}) {
    return (
        <div
            className={`adr-pj__track ${modifier ? `adr-pj__track--${modifier}` : ''}`}
        >
            <span className="adr-pj__track-label">{label}</span>
            <div className="adr-pj__track-body">{children}</div>
            <Value className="adr-pj__track-text">{written}</Value>
        </div>
    )
}

function StatusFrames({ block, source }: BlockProps) {
    const pointer = block.paths[0]
    const found = at(source, pointer)
    if (typeof found === 'string' && lastSegment(pointer) === 'etats') {
        /* The player sheet's free zone: the text as written, one line per state. */
        return (
            <div className="adr-pj__states-zone">
                {found
                    .split(/\r?\n/)
                    .filter((line) => line.trim())
                    .map((line, index) => (
                        <p className="adr-pj__states-line" key={index}>
                            {line.trim()}
                        </p>
                    ))}
            </div>
        )
    }
    if (Array.isArray(found) || lastSegment(pointer) === 'etats') {
        const lines = records(found)
            .map((state) =>
                [
                    text(state.nom),
                    [
                        STATE_SIDES.includes(text(state.versant))
                            ? t(`pj.form.sides.${text(state.versant)}`)
                            : text(state.versant),
                        LOCATION_LABELS[text(state.localisation)] ??
                            text(state.localisation),
                    ]
                        .filter(Boolean)
                        .join(' · '),
                    text(state.duree),
                    text(state.notes),
                ]
                    .filter(Boolean)
                    .join(' — ')
            )
            .filter(Boolean)
        // A free zone, as on the paper sheet: what the document enters is written in it, nothing is laid out.
        return (
            <div className="adr-pj__states-zone">
                {lines.map((line, index) => (
                    <p className="adr-pj__states-line" key={index}>
                        {line}
                    </p>
                ))}
            </div>
        )
    }
    const malus = asRecord(found)
    if (!malus) {
        // A free-text frame of the Malus block, such as Divers.
        return (
            <div className="adr-pj__tracks">
                <Track label={block.label} modifier="frame">
                    <Value className="adr-pj__track-text">{text(found)}</Value>
                </Track>
            </div>
        )
    }
    // schema-adrenaline 2.6.0 still publishes the two counts physique and mental.
    return (
        <div className="adr-pj__tracks">
            {(['physique', 'mental'] as const).map((key) => (
                <Track
                    key={key}
                    label={t(
                        `pj.sheet.${key === 'physique' ? 'physical' : 'mental'}`
                    )}
                >
                    <span className="adr-pj__track-line" />
                    <Value className="adr-pj__track-value">
                        {text(malus[key])}
                    </Value>
                </Track>
            ))}
        </div>
    )
}

/* The yellow Choc box: five round circles, then five hour circles (published as `fatigue-circles` up to 2.6.0). */
function ShockCircles({ block, source }: BlockProps) {
    const shock = asRecord(at(source, block.paths[0])) ?? {}
    const groups =
        block.decoration?.kind === 'circle-groups'
            ? block.decoration.groups
            : []
    return (
        <div className="adr-pj__tracks">
            <Track
                label={block.label}
                modifier="choc"
                written={text(
                    block.paths[1] ? at(source, block.paths[1]) : undefined
                )}
            >
                {groups.map((group, index) => (
                    <span className="adr-pj__track-group" key={group.key}>
                        {index > 0 && <span className="adr-pj__track-line" />}
                        <span className="adr-pj__track-stack">
                            <Circles
                                count={group.count}
                                filled={Math.min(
                                    group.count,
                                    Math.max(
                                        0,
                                        Number(
                                            currentValue(shock[group.key])
                                        ) || 0
                                    )
                                )}
                            />
                            <span className="adr-pj__track-period">
                                {group.label}
                            </span>
                        </span>
                    </span>
                ))}
            </Track>
        </div>
    )
}

/* Total des malus: the printed scale, the current total circled. */
function MalusScale({ block, source }: BlockProps) {
    const scale =
        block.decoration?.kind === 'scale' ? block.decoration : undefined
    const from = scale?.from ?? 1
    /* The last numbered step is the published one, else the schema's bound of the total. */
    const to = scale?.to ?? pjLimit('/etatDePartie/malus/total')?.max ?? from
    const total = Number(currentValue(at(source, block.paths[0]))) || 0
    const steps: { label: string; current: boolean }[] = Array.from(
        { length: to - from + 1 },
        (_, index) => ({
            label: String(from + index),
            current: from + index === total,
        })
    )
    /* The tenth malus is the published last step: any total above the numbered ones lands there. */
    if (scale?.last) steps.push({ label: scale.last, current: total > to })
    return (
        <div className="adr-pj__scale">
            <span className="adr-pj__scale-label">{block.label}</span>
            {steps.map((step) => (
                <span
                    className={`adr-pj__scale-step${step.current ? ' adr-pj__scale-step--current' : ''}`}
                    key={step.label}
                >
                    {step.label}
                </span>
            ))}
        </div>
    )
}

/* Divers: the published count of circles, ticked by the counter, and the free text beside them. */
function CircleRow({ block, source }: BlockProps) {
    const row =
        block.decoration?.kind === 'circle-row' ? block.decoration : undefined
    const entered = block.paths.map((pointer) => at(source, pointer))
    const counter = entered.find((value) => typeof value === 'number')
    const free = entered.find((value) => typeof value === 'string')
    const count = row?.count ?? 0
    return (
        <div className="adr-pj__tracks">
            <Track label={block.label} modifier="frame" written={text(free)}>
                <Circles
                    count={count}
                    filled={Math.min(count, Math.max(0, Number(counter) || 0))}
                />
            </Track>
        </div>
    )
}

/* Wounds, as on the paper sheet: one panel per column, a circle left of each duration (one ticked), then room to write. */
function WoundCircles({ block, source }: BlockProps) {
    const wounds =
        block.decoration?.kind === 'wound-circles'
            ? block.decoration
            : undefined
    if (!wounds) return null
    const side = asRecord(at(source, block.paths[0])) ?? {}
    return (
        <div className="adr-pj__wounds">
            {wounds.columns.map((column) => {
                const entered = asRecord(side[column.key]) ?? {}
                return (
                    <div className="adr-pj__wound" key={column.key}>
                        {wounds.durations.map((duration) => (
                            <div className="adr-pj__wound-line" key={duration}>
                                <Circles
                                    count={wounds.circles}
                                    filled={
                                        entered[duration] === true
                                            ? wounds.circles
                                            : 0
                                    }
                                />
                                <span className="adr-pj__wound-head">
                                    {humanize(duration)}
                                </span>
                            </div>
                        ))}
                        <p className="adr-pj__wound-write">
                            {text(entered.notes)}
                        </p>
                    </div>
                )
            })}
        </div>
    )
}

/* The fixed table of the social weapons: every word comes from the presentation, never the document. */
function ReferenceTable({ block, source }: BlockProps) {
    const table = block.referenceTable
    if (!table) return null
    /* A weapon the character does not use stays on its line, struck out by typography alone. */
    const struck = strings(at(source, block.paths[0]))
    return (
        <div className="adr-pj__reference">
            <div className="adr-pj__reference-table">
                {table.lines.map((line) => (
                    <div
                        className={
                            struck.indexOf(line.name) >= 0
                                ? 'adr-pj__reference-row adr-pj__reference-row--struck'
                                : 'adr-pj__reference-row'
                        }
                        key={line.name}
                    >
                        <span className="adr-pj__reference-name">
                            {line.name}
                        </span>
                        <span className="adr-pj__reference-properties">
                            {line.properties}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

/* Rows of several paths, each cell named by its published label: the value as entered. */
function CompactRows({ block, source }: BlockProps) {
    return (block.pointerRows ?? []).map((row, index) => (
        <div className="adr-pj__field-rows" key={index}>
            {row.map((cell) => {
                const raw = at(source, cell.path)
                return (
                    <div
                        className={
                            row.length === 1
                                ? 'adr-pj__field adr-pj__field--across'
                                : 'adr-pj__field'
                        }
                        key={cell.path}
                    >
                        <WriteLine
                            label={
                                cell.label ?? humanize(lastSegment(cell.path))
                            }
                            value={
                                Array.isArray(raw)
                                    ? strings(raw).join(' · ')
                                    : text(raw)
                            }
                        />
                    </div>
                )
            })}
        </div>
    ))
}

/* Free prose under the block title, on ruled lines. */
function Narrative({ block, source }: BlockProps) {
    return block.paths.map((pointer) => (
        <Value className="adr-pj__narrative" key={pointer}>
            {text(at(source, pointer))}
        </Value>
    ))
}

function Unknown({ block, source }: BlockProps) {
    return block.paths.map((pointer) => (
        <WriteLine
            key={pointer}
            label={humanize(lastSegment(pointer))}
            value={text(at(source, pointer))}
        />
    ))
}

const FORMS: Partial<Record<string, (props: BlockProps) => ReactNode>> = {
    'name-card': NameCard,
    'game-parameters': GameParameters,
    'formation-columns': FormationColumns,
    'identity-fields': IdentityFields,
    'characteristic-rows': CharacteristicRows,
    'ruled-list': RuledList,
    'weapon-lines': WeaponLines,
    'location-grid': LocationGrid,
    'reference-table': ReferenceTable,
    'wound-circles': WoundCircles,
    'circle-row': CircleRow,
    'compact-rows': CompactRows,
    ['narrative']: Narrative,
    'stress-dice': StressDice,
    'threshold-rows': ThresholdRows,
    'status-frames': StatusFrames,
    'fatigue-circles': ShockCircles,
    'shock-circles': ShockCircles,
    'malus-scale': MalusScale,
}

/* The cartouche prints its own banner label; formation columns print one subhead per column. */
const TITLED_ELSEWHERE = new Set([
    'name-card',
    'game-parameters',
    'formation-columns',
    // The Malus column prints its labels on the band of each frame, as the paper sheet does.
    'fatigue-circles',
    'shock-circles',
    'malus-scale',
    'circle-row',
])

function titledElsewhere(
    block: AdrenalinePresentationBlock,
    source: BlockProps['source']
) {
    if (TITLED_ELSEWHERE.has(block.form ?? '')) return true
    const pointer = block.paths[0]
    if (block.form !== 'status-frames' || lastSegment(pointer) === 'etats')
        return false
    const found = at(source, pointer)
    return !Array.isArray(found) && !asRecord(found)
}

function blockClasses(block: AdrenalinePresentationBlock) {
    const placement = block.placement
    return [
        'adr-pj__block',
        `adr-pj__${block.id}`,
        `adr-pj__form-${block.form ?? 'none'}`,
        placement
            ? `adr-pj__col-${placement.column} adr-pj__row-${placement.row}`
            : '',
        placement?.rowSpan ? `adr-pj__row-span-${placement.rowSpan}` : '',
        placement?.columnSpan ? `adr-pj__col-span-${placement.columnSpan}` : '',
    ]
        .filter(Boolean)
        .join(' ')
}

export function PresentationBlock({
    block,
    source,
    onOpen,
    withNotes = true,
}: BlockProps & {
    onOpen?: (zone?: string) => void
    /** False when the section prints the block's notes itself, across all its columns. */
    withNotes?: boolean
}) {
    const Form = FORMS[block.form ?? ''] ?? Unknown
    const content = (
        <>
            {!titledElsewhere(block, source) && <Subhead label={block.label} />}
            <Form block={block} source={source} />
            {withNotes &&
                (block.notes ?? []).map((note) => (
                    <p className="adr-pj__note adr-pj__block-note" key={note}>
                        {note}
                    </p>
                ))}
        </>
    )
    /* A block that reads no document path has nothing to edit: it is not a button. */
    return onOpen ? (
        <button
            className={blockClasses(block)}
            type="button"
            onClick={(event) =>
                onOpen(
                    (event.target as HTMLElement)
                        .closest('[data-zone]')
                        ?.getAttribute('data-zone') ?? undefined
                )
            }
        >
            {content}
        </button>
    ) : (
        <div className={blockClasses(block)}>{content}</div>
    )
}

export function PresentationBrand({
    variant,
    sheetLabel,
    subtitle,
}: {
    variant: string
    sheetLabel: string
    subtitle?: string
}) {
    return (
        <div className="adr-pj__brand">
            <strong className="adr-pj__brand-name">
                ☣ {variant.charAt(0).toUpperCase() + variant.slice(1)}
            </strong>
            <span className="adr-pj__brand-sheet">{sheetLabel}</span>
            {subtitle ? (
                <span className="adr-pj__brand-subtitle">{subtitle}</span>
            ) : null}
        </div>
    )
}

export function PresentationSection({
    section,
    span,
    children,
}: {
    section: AdrenalinePresentationSection
    /** Share of a published sheet row, in thirds; absent for a section alone on its row. */
    span?: number
    children: ReactNode
}) {
    const className = [
        'adr-pj__section',
        `adr-pj--${section.id}`,
        span ? `adr-pj__span-${span}` : '',
        section.collapsible ? 'adr-pj__section--collapsible' : '',
    ]
        .filter(Boolean)
        .join(' ')
    const body = (
        <div
            className={`adr-pj__section-body adr-pj__columns-${section.columns ?? 1}`}
        >
            {children}
        </div>
    )
    /* A collapsible section is folded by default; its title is the handle that unfolds it. */
    if (section.collapsible)
        return (
            <details className={className}>
                <summary className="adr-pj__section-title">
                    {section.label}
                </summary>
                {body}
            </details>
        )
    return (
        <section className={className}>
            {section.showTitle !== false && (
                <h4 className="adr-pj__section-title">{section.label}</h4>
            )}
            {body}
        </section>
    )
}

export { sortedBlocks }
