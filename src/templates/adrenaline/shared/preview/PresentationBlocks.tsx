import { translate, type TranslationValues } from '@/i18n/text'
import type { ReactNode } from 'react'
import type {
    AdrenalinePresentationBlock,
    AdrenalinePresentationSection,
} from 'schema-adrenaline/presentation'
import {
    formationColumns,
    formationTypeLabel,
    SKILL_LINES,
} from '../formations'
import { asRecord, at, lastSegment, sortedBlocks } from '../presentation'
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
    name: string
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
const PARAMETER_VALUES = [
    'equitable',
    'aleatoire',
    'one-shot',
    'campagne',
    'bac-a-sable',
    'storyline',
]

function GameParameters({ block, source }: BlockProps) {
    return (
        <>
            <span className="adr-pj__card-label">{block.label}</span>
            <div className="adr-pj__card-fields">
                {block.paths.map((pointer, index) => {
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
    const [nameKey, specialtyKey, scoreKey] = fields?.competence ?? [
        'nom',
        'specialite',
        'pourcentage',
    ]
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
                        <div className="adr-pj__formation" key={index}>
                            <Subhead
                                label={t('pj.sheet.training')}
                                trailing={[suffix]}
                            />
                            <div className="adr-pj__metric-list">
                                <div className="adr-pj__metric adr-pj__formation-head">
                                    <span className="adr-pj__metric-name">
                                        <span className="adr-pj__formation-type">
                                            {typeLabel} (
                                        </span>
                                        <Value className="adr-pj__formation-name">
                                            {text(formation?.[formationNameKey])}
                                        </Value>
                                        <span className="adr-pj__formation-type">
                                            )
                                        </span>
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
                                    const specialty = text(
                                        competence?.[specialtyKey]
                                    )
                                    const name = competence
                                        ? `${text(competence[nameKey])}${specialty ? ` (${specialty})` : ''}`
                                        : ''
                                    const perks = strings(competence?.avantages)
                                    return (
                                        <div
                                            className="adr-pj__competence"
                                            key={rank}
                                        >
                                            <div className="adr-pj__metric">
                                                <Value className="adr-pj__metric-name">
                                                    {name}
                                                </Value>
                                                <Value className="adr-pj__metric-value">
                                                    {text(
                                                        competence?.[scoreKey]
                                                    )}
                                                </Value>
                                            </div>
                                            {perks.length > 0 && (
                                                <p className="adr-pj__note">
                                                    {t('pj.sheet.perk', {
                                                        perks: perks.join(', '),
                                                    })}
                                                </p>
                                            )}
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

const IDENTITY_COLUMNS: readonly (readonly (readonly [string, string])[])[] = [
    [
        ['nationalite', 'nationality'],
        ['cheveux', 'hair'],
        ['yeux', 'eyes'],
        ['peau', 'skin'],
        ['signesParticuliers', 'distinguishingMarks'],
    ],
    [
        ['genre', 'gender'],
        ['age', 'age'],
        ['taille', 'height'],
        ['poids', 'weight'],
    ],
]

function IdentityFields({ block, source }: BlockProps) {
    const identity = asRecord(at(source, block.paths[0])) ?? {}
    return (
        <div className="adr-pj__block-grid">
            {IDENTITY_COLUMNS.map((fields, index) => (
                <div className="adr-pj__identity-column" key={index}>
                    {fields.map(([key, label]) => {
                        const raw = identity[key]
                        const age = text(raw)
                        const shown = Array.isArray(raw)
                            ? strings(raw).join(' · ')
                            : key === 'age' && age
                              ? t('pj.sheet.years', { age })
                              : text(raw)
                        return (
                            <WriteLine
                                key={key}
                                label={t(`shared.identity.${label}`)}
                                value={shown}
                            />
                        )
                    })}
                </div>
            ))}
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
            <MetricHeads
                heads={parts.map((part) => t(`pj.sheet.${RANGE_HEADS[part]}`))}
            />
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
    return block.paths.map((pointer) => {
        const found = at(source, pointer)
        const key = lastSegment(pointer)
        if (Array.isArray(found)) {
            const lines = found.map((item) => text(item))
            while (lines.length < 3) lines.push('')
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
    const weapons = records(at(source, block.paths[0]))
    return (weapons.length ? weapons : [undefined]).map((weapon, index) => (
        <div className="adr-pj__weapon" key={index}>
            <div className="adr-pj__weapon-line">
                <b className="adr-pj__write-label">{t('pj.sheet.weapon')}</b>
                <Value className="adr-pj__write-field">
                    {weapon
                        ? `${String(weapon.nom ?? '')}${weapon.type ? ` (${String(weapon.type)})` : ''}`
                        : ''}
                </Value>
                <Value className="adr-pj__weapon-score">
                    {weapon ? text(weapon.pourcentage, ' %') : ''}
                </Value>
                <Value className="adr-pj__weapon-damage">
                    {weapon?.desDeDegats !== undefined
                        ? `${text(weapon.desDeDegats)} ${die}`.trim()
                        : die}
                </Value>
            </div>
            {typeof weapon?.notes === 'string' && weapon.notes && (
                <p className="adr-pj__note">{weapon.notes}</p>
            )}
        </div>
    ))
}

function UnitLine({
    label,
    field,
    amount,
    unit,
}: {
    label: string
    field: string
    amount: string
    unit: string
}) {
    return (
        <div className="adr-pj__unit-line">
            <b className="adr-pj__write-label">{label}</b>
            <Value className="adr-pj__write-field">{field}</Value>
            <Value className="adr-pj__unit-value">{amount}</Value>
            <span className="adr-pj__unit">{unit}</span>
        </div>
    )
}

function ProtectionLines({ block, source }: BlockProps) {
    const pointer = block.paths[0]
    const physical = lastSegment(pointer) === 'physiques'
    const units =
        block.decoration?.kind === 'protection-units'
            ? block.decoration
            : undefined
    const unit = (physical ? units?.physical : units?.mental) ?? ''
    const side = asRecord(at(source, pointer)) ?? {}
    const cover = asRecord(physical ? side.armure : side.caractere)
    const places = strings(cover?.localisations)
        .map((item) => item.replace(/-/g, ' '))
        .join(', ')
    const shield = asRecord(side.bouclier)
    return (
        <>
            <UnitLine
                label={t('shared.protection.toughness')}
                field=""
                amount={text(side.solidite)}
                unit={unit}
            />
            <UnitLine
                label={
                    physical
                        ? t('shared.protection.armour')
                        : t('pj.sheet.character')
                }
                field={[text(physical ? cover?.nom : cover?.trait), places]
                    .filter(Boolean)
                    .join(' · ')}
                amount={text(cover?.points)}
                unit={unit}
            />
            <WriteLine
                label={t('shared.protection.shield')}
                value={[
                    text(shield?.nom),
                    strings(shield?.proprietes).join(', '),
                ]
                    .filter(Boolean)
                    .join(' · ')}
            />
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
                                    filled={count > index ? 1 : 0}
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

const THRESHOLDS = ['superficiel', 'leger', 'grave', 'profond'] as const

function ThresholdRows({ block, source }: BlockProps) {
    const pointer = block.paths[0]
    const side = asRecord(at(source, pointer)) ?? {}
    const mental = lastSegment(pointer) === 'mental'
    return (
        <>
            <MetricHeads
                heads={[
                    t('pj.sheet.base'),
                    t(mental ? 'pj.sheet.plusTrait' : 'pj.sheet.plusArmour'),
                ]}
            />
            <div className="adr-pj__metric-list">
                {THRESHOLDS.map((key) => {
                    const threshold = asRecord(side[key])
                    return (
                        <Metric
                            key={key}
                            name={t(`pj.sheet.thresholds.${key}`)}
                            values={[
                                text(threshold?.base),
                                text(threshold?.couvert),
                            ]}
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
}: {
    label: string
    modifier?: string
    children: ReactNode
}) {
    return (
        <div
            className={`adr-pj__track ${modifier ? `adr-pj__track--${modifier}` : ''}`}
        >
            <span className="adr-pj__track-label">{label}</span>
            <div className="adr-pj__track-body">{children}</div>
        </div>
    )
}

function StatusFrames({ block, source }: BlockProps) {
    const pointer = block.paths[0]
    const found = at(source, pointer)
    if (Array.isArray(found) || lastSegment(pointer) === 'etats') {
        const states = records(found)
        return (
            <div className="adr-pj__condition-stack">
                {(states.length ? states : [undefined]).map((state, index) => (
                    <div className="adr-pj__condition-card" key={index}>
                        <span className="adr-pj__condition-label">
                            {text(state?.nom) || t('pj.sheet.condition')}
                        </span>
                        <div className="adr-pj__condition-body">
                            <WriteLine
                                label={t('pj.sheet.location')}
                                value={[
                                    text(state?.versant),
                                    text(state?.localisation).replace(
                                        /-/g,
                                        ' '
                                    ),
                                ]
                                    .filter(Boolean)
                                    .join(' · ')}
                            />
                            <WriteLine
                                label={t('pj.sheet.duration')}
                                value={text(state?.duree)}
                            />
                            {typeof state?.notes === 'string' &&
                                state.notes && (
                                    <p className="adr-pj__note">
                                        {state.notes}
                                    </p>
                                )}
                        </div>
                    </div>
                ))}
            </div>
        )
    }
    const malus = asRecord(found) ?? {}
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
                        {text(malus[key], ' %')}
                    </Value>
                </Track>
            ))}
        </div>
    )
}

function FatigueCircles({ block, source }: BlockProps) {
    const fatigue = asRecord(at(source, block.paths[0])) ?? {}
    const groups =
        block.decoration?.kind === 'circle-groups'
            ? block.decoration.groups
            : []
    return (
        <div className="adr-pj__tracks">
            <Track label={block.label} modifier="fatigue">
                {groups.map((group, index) => (
                    <span className="adr-pj__track-group" key={group.label}>
                        {index > 0 && <span className="adr-pj__track-line" />}
                        <span className="adr-pj__track-period">
                            {humanize(group.label)}
                        </span>
                        <Circles
                            count={group.count}
                            filled={Math.min(
                                group.count,
                                Math.max(
                                    0,
                                    Number(
                                        currentValue(fatigue[group.label])
                                    ) || 0
                                )
                            )}
                        />
                    </span>
                ))}
            </Track>
        </div>
    )
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
    'protection-lines': ProtectionLines,
    'stress-dice': StressDice,
    'threshold-rows': ThresholdRows,
    'status-frames': StatusFrames,
    'fatigue-circles': FatigueCircles,
}

/* The cartouche prints its own banner label; formation columns print one subhead per column. */
const TITLED_ELSEWHERE = new Set([
    'name-card',
    'game-parameters',
    'formation-columns',
])

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
}: BlockProps & { onOpen: () => void }) {
    const Form = FORMS[block.form ?? ''] ?? Unknown
    return (
        <button className={blockClasses(block)} type="button" onClick={onOpen}>
            {!TITLED_ELSEWHERE.has(block.form ?? '') && (
                <Subhead label={block.label} />
            )}
            <Form block={block} source={source} />
        </button>
    )
}

export function PresentationBrand({
    variant,
    sheetLabel,
}: {
    variant: string
    sheetLabel: string
}) {
    return (
        <div className="adr-pj__brand">
            <strong className="adr-pj__brand-name">
                ☣ {variant.charAt(0).toUpperCase() + variant.slice(1)}
            </strong>
            <span className="adr-pj__brand-sheet">{sheetLabel}</span>
        </div>
    )
}

export function PresentationSection({
    section,
    children,
}: {
    section: AdrenalinePresentationSection
    children: ReactNode
}) {
    return (
        <section className={`adr-pj__section adr-pj--${section.id}`}>
            {section.showTitle !== false && (
                <h4 className="adr-pj__section-title">{section.label}</h4>
            )}
            <div
                className={`adr-pj__section-body adr-pj__columns-${section.columns ?? 1}`}
            >
                {children}
            </div>
        </section>
    )
}

export { sortedBlocks }
