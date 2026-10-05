import {
    Biohazard,
    PawPrint,
    Shield,
    Skull,
    User,
    type LucideIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'
import type {
    AdrenalinePresentation,
    AdrenalinePresentationBlock,
    AdrenalinePresentationSection,
} from 'schema-adrenaline/presentation'
import { asRecord, at, lastSegment, sortedBlocks } from '../presentation'
import { currentValue } from './SheetPrimitives'

/*
 * The compact card of the Zombiology booklets, drawn from a published presentation
 * (`surface: "compact-card"`): a banner coloured by category, then the sections in their published
 * order, each under its title band. Every printed value is read from the document as entered; the
 * card computes nothing. Same reading as Handbook's card, so both consumers print the same sheet.
 */
const CARD = 'adr-compact'

type Source = Record<string, unknown>

/** The creature state a card prints, named and triggered as entered. */
export type CompactCardState = {
    name: string
    triggers: string[]
    /** True on the card of the state the creature is in (`etatActif`). */
    active: boolean
    note?: string
}

/* Labels the published presentation leaves to the consumer: field names and enum values. */
const FIELD_LABELS: Record<string, string> = {
    zoneDeDetection: 'Détection',
    deplacement: 'Déplacement',
    malusAvantHs: 'Malus avant HS',
    possessions: 'Possessions',
    equipementFavori: 'Équipement favori',
    armesPhysiques: 'Armes physiques',
    armesMentales: 'Armes mentales',
    role: 'Rôle',
    attitude: 'Attitude',
    personnalite: 'Personnalité',
    historique: 'Historique',
    evolutionPossible: 'Évolution possible',
    interpretation: 'Interprétation',
    repliques: 'Répliques',
    notesMj: 'Notes du meneur',
    agent: 'Agent',
    vecteurs: 'Vecteurs',
    delaiAvantEffet: 'Délai avant effet',
    issue: 'Issue',
    modulations: 'Modulations',
}
const THRESHOLDS = [
    ['superficiel', 'Superficiel'],
    ['leger', 'Léger'],
    ['grave', 'Grave'],
    ['profond', 'Profond'],
] as const
const HEALTH_SIDES = [
    ['physique', 'SP'],
    ['mental', 'SM'],
] as const
/* Key, label, then the modifier that picks the track's colour token (stress keeps the ink). */
const TRACKS = [
    ['stress', 'Stress', 'stress'],
    ['malusChoquants', 'Malus choquants', 'shock'],
    ['malusBlessants', 'Malus blessants', 'wound'],
] as const
const PROTECTION_SIDES = [
    ['physiques', 'physique', 'armure', 'Armure', 'nom'],
    ['mentales', 'mentale', 'caractere', 'Caractère', 'trait'],
] as const
const DEFENSE_LEVELS: Record<string, string> = {
    oui: 'Oui',
    expose: 'Exposé',
    non: 'Non',
}
/* The icons the published categories name; one the map does not know is left out. */
const ICONS: Record<string, LucideIcon> = {
    biohazard: Biohazard,
    'paw-print': PawPrint,
    shield: Shield,
    skull: Skull,
    user: User,
}

function cls(name: string): string {
    return `${CARD}__${name}`
}

function humanize(key: string): string {
    const spaced = key
        .replace(/-/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .toLowerCase()
    return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

function label(key: string): string {
    return FIELD_LABELS[key] ?? humanize(key)
}

/** A string as entered, or the current value of a bounded number. */
function text(found: unknown, suffix = ''): string {
    if (typeof found === 'string') return found
    const shown = currentValue(found)
    return shown === undefined ? '' : `${shown}${suffix}`
}

function strings(found: unknown): string[] {
    return Array.isArray(found)
        ? found.filter(
              (item): item is string => typeof item === 'string' && item !== ''
          )
        : []
}

function records(found: unknown): Source[] {
    return Array.isArray(found)
        ? found.map(asRecord).filter((item): item is Source => !!item)
        : []
}

function isEmpty(found: unknown): boolean {
    if (found === undefined || found === null || found === '') return true
    if (Array.isArray(found)) return found.length === 0
    const record = asRecord(found)
    return record ? Object.keys(record).length === 0 : false
}

function joined(parts: readonly string[], separator = ' · '): string {
    return parts.filter(Boolean).join(separator)
}

/** A labelled line; `figure` marks a number, which the published `values.align` places on its line. */
function Line({
    name,
    content,
    figure = false,
}: {
    name: string
    content: string
    figure?: boolean
}) {
    if (!content) return null
    return (
        <span className={cls('line')}>
            <b className={cls('line-label')}>{name}</b>
            <span
                className={
                    figure ? `${cls('value')} ${cls('figure')}` : cls('value')
                }
            >
                {content}
            </span>
        </span>
    )
}

/** The damage of a skill or an action: the dice in a badge, then its properties as entered. */
function Damage({ found }: { found: unknown }) {
    const degats = asRecord(found)
    if (!degats) return null
    const versant = text(degats.versant)
    const extra = joined(
        [
            ...strings(degats.proprietes),
            text(degats.munitions) && `Munitions ${text(degats.munitions)}`,
            text(degats.portee) && `Portée ${text(degats.portee)}`,
        ],
        ', '
    )
    return (
        <span
            className={
                versant
                    ? `${cls('damage')} ${cls(`damage--${versant}`)}`
                    : cls('damage')
            }
        >
            {records(degats.profils).map((profile, index) => {
                const detail = joined(
                    [text(profile.nature), text(profile.condition)],
                    ' '
                )
                return [
                    index > 0 && (
                        <span
                            className={cls('damage-link')}
                            key={`link-${index}`}
                        >
                            {text(degats.liant) || 'ou'}
                        </span>
                    ),
                    <span className={cls('dice-badge')} key={`dice-${index}`}>
                        {text(profile.des)}
                    </span>,
                    detail && (
                        <span
                            className={cls('damage-detail')}
                            key={`detail-${index}`}
                        >
                            {detail}
                        </span>
                    ),
                ]
            })}
            {extra && <span className={cls('damage-detail')}>{extra}</span>}
        </span>
    )
}

/*
 * `Arme à feu (Pistolet) 40 % + DEX`, then its figure `70 %`: each part only when entered.
 * Without a total, the entered score is the figure.
 */
function skillParts(skill: Source): [string, string] {
    const name = text(skill.specialite)
        ? `${text(skill.nom)} (${text(skill.specialite)})`
        : text(skill.nom)
    const score = text(skill.pourcentage, ' %')
    const characteristic = text(skill.caracteristique).toUpperCase()
    const total = text(skill.total, ' %')
    const bonus = characteristic && `+ ${characteristic}`
    if (!total) return [joined([name, bonus], ' '), score]
    return [joined([name, score, bonus], ' '), total]
}

/** The same skill on one run of text, for an action's test: `… 40 % + DEX = 70 %`. */
function skillText(skill: Source): string {
    const [name, figure] = skillParts(skill)
    return joined(
        [name, figure && (text(skill.total) ? `= ${figure}` : figure)],
        ' '
    )
}

function SkillLine({ skill }: { skill: Source }) {
    const [name, figure] = skillParts(skill)
    const advantages = strings(skill.avantages)
    const notes = joined([
        advantages.length ? `Avantage : ${advantages.join(', ')}` : '',
        text(skill.action),
        text(skill.notes),
    ])
    return (
        <span className={cls('skill')}>
            <span className={cls('skill-head')}>
                <span className={cls('skill-name')}>{name}</span>
                {figure && (
                    <span className={`${cls('value')} ${cls('figure')}`}>
                        {figure}
                    </span>
                )}
            </span>
            <Damage found={skill.degats} />
            {notes && <span className={cls('note')}>{notes}</span>}
        </span>
    )
}

function NameCard({
    block,
    source,
    presentation,
}: {
    block: AdrenalinePresentationBlock
    source: Source
    presentation: AdrenalinePresentation
}) {
    const categories = presentation.categories
    const category = text(at(source, categories?.path ?? '/categorie'))
    const shown = category || categories?.fallbackLabel || block.label
    const Icon =
        categories && ICONS[categories.icons[shown] ?? categories.defaultIcon]
    const danger = text(at(source, '/niveauDeDanger'))
    const alternate = text(at(source, '/niveauDeDangerAlternatif'))
    const note = text(at(source, '/niveauDeDangerNote'))
    return (
        <>
            <span className={cls('banner-category')}>{shown}</span>
            <span className={cls('banner-identity')}>
                {Icon && (
                    <span className={cls('banner-icon')}>
                        <Icon aria-hidden="true" />
                    </span>
                )}
                <strong className={cls('banner-name')}>
                    {text(at(source, '/nom'))}
                </strong>
                {(danger || alternate) && (
                    <span className={cls('banner-danger')}>
                        ND {joined([danger, alternate], ' / ')}
                    </span>
                )}
            </span>
            {note && <span className={cls('banner-note')}>{note}</span>}
        </>
    )
}

/** A nested record printed on one line: its entered values, in document order. */
function summary(record: Source): string {
    return joined(
        Object.keys(record).map((key) => {
            const item = record[key]
            return Array.isArray(item)
                ? strings(item).join(', ')
                : text(item, key === 'probabilite' ? ' %' : '')
        })
    )
}

function Narrative({ found }: { found: unknown }) {
    if (typeof found === 'string')
        return <span className={cls('paragraph')}>{found}</span>
    if (Array.isArray(found)) {
        const items = [...strings(found), ...records(found).map(summary)]
        return (
            <span className={cls('list')}>
                {items.map((item, index) => (
                    <span className={cls('list-item')} key={index}>
                        {item}
                    </span>
                ))}
            </span>
        )
    }
    const record = asRecord(found) ?? {}
    return Object.keys(record).map((key) => {
        const item = record[key]
        const nested = records(item)
        const content = nested.length
            ? nested.map(summary).join(' ; ')
            : Array.isArray(item)
              ? strings(item).join(', ')
              : text(item)
        return <Line content={content} key={key} name={label(key)} />
    })
}

function CompactRows({ pointer, found }: { pointer: string; found: unknown }) {
    const key = lastSegment(pointer)
    if (key === 'caracteristiques') {
        const record = asRecord(found) ?? {}
        return (
            <span className={cls('grid')}>
                {Object.keys(record).map((name) => (
                    <span className={cls('cell')} key={name}>
                        <b className={cls('line-label')}>
                            {name.toUpperCase()}
                        </b>
                        <span className={cls('value')}>
                            {text(record[name], ' %')}
                        </span>
                    </span>
                ))}
            </span>
        )
    }
    if (Array.isArray(found))
        return records(found).map((record, index) => (
            <Line
                content={text(record.pourcentage, ' %')}
                figure
                key={index}
                name={joined(
                    [
                        text(record.nom),
                        text(record.type) && `(${text(record.type)})`,
                    ],
                    ' '
                )}
            />
        ))
    return <Line content={text(found)} name={label(key)} />
}

function Thresholds({ found }: { found: unknown }) {
    const health = asRecord(found) ?? {}
    return HEALTH_SIDES.map(([side, short]) => {
        const thresholds = asRecord(health[side])
        if (!thresholds) return null
        return (
            <span className={cls('thresholds')} key={side}>
                <b className={cls('line-label')}>{short}</b>
                {THRESHOLDS.map(([key, name]) => {
                    const threshold = asRecord(thresholds[key])
                    const base = text(threshold?.base)
                    const covered = text(threshold?.couvert)
                    return (
                        <span
                            className={`${cls('threshold')} ${cls('value')}`}
                            data-threshold={name}
                            key={key}
                        >
                            {covered ? `${base} (${covered})` : base}
                        </span>
                    )
                })}
            </span>
        )
    })
}

function reduction(found: unknown): string {
    const record = asRecord(found)
    if (!record) return ''
    const against = strings(record.contre)
    return joined(
        [
            `−${text(record.valeur)}`,
            against.length ? `contre ${against.join(', ')}` : '',
        ],
        ' '
    )
}

function Protections({ found }: { found: unknown }) {
    const protections = asRecord(found) ?? {}
    return PROTECTION_SIDES.map(
        ([sideKey, sideName, coverKey, coverName, nameKey]) => {
            const side = asRecord(protections[sideKey])
            if (!side) return null
            const cover = asRecord(side[coverKey])
            const shield = asRecord(side.bouclier)
            return [
                <Line
                    content={text(side.solidite)}
                    figure
                    key={`${sideKey}-solidite`}
                    name={`Solidité ${sideName}`}
                />,
                cover && (
                    <Line
                        content={joined([
                            text(cover[nameKey]),
                            text(cover.couverture),
                            text(cover.des).replace('-', '−'),
                            strings(cover.emotions).join(', '),
                            reduction(cover.reduction),
                            strings(cover.proprietes).join(', '),
                            text(cover.points) &&
                                `${text(cover.points)} points`,
                            strings(cover.localisations)
                                .map((place) => place.replace(/-/g, ' '))
                                .join(', '),
                        ])}
                        key={`${sideKey}-cover`}
                        name={coverName}
                    />
                ),
                shield && (
                    <Line
                        content={joined([
                            text(shield.nom),
                            strings(shield.proprietes).join(', '),
                        ])}
                        key={`${sideKey}-shield`}
                        name="Bouclier"
                    />
                ),
            ]
        }
    )
}

/** The published circles per track, the entered count bold; stress shows the published default when absent. */
function Tracks({
    block,
    found,
}: {
    block: AdrenalinePresentationBlock
    found: unknown
}) {
    const decoration =
        block.decoration?.kind === 'malus-tracks'
            ? block.decoration
            : { length: 10, stressDefault: 2 }
    const tracks = asRecord(found) ?? {}
    return TRACKS.map(([key, name, modifier]) => {
        const entered = currentValue(tracks[key])
        const bold =
            typeof entered === 'number'
                ? entered
                : key === 'stress'
                  ? decoration.stressDefault
                  : 0
        return (
            <span
                className={`${cls('track')} ${cls(`track--${modifier}`)}`}
                key={key}
            >
                <b className={cls('line-label')}>{name}</b>
                <span className={cls('circles')}>
                    {Array.from({ length: decoration.length }, (_, index) => (
                        <i
                            className={`${cls('circle-mark')} ${cls(index < bold ? 'circle-bold' : 'circle')}`}
                            key={index}
                        />
                    ))}
                </span>
            </span>
        )
    })
}

function InlineList({ found }: { found: unknown }) {
    const record = asRecord(found)
    const items = record
        ? Object.keys(record).flatMap((key) => {
              const item = record[key]
              if (typeof item === 'string') return [`${label(key)} : ${item}`]
              return [
                  ...strings(item),
                  ...records(item).map((weapon) =>
                      joined(
                          [
                              text(weapon.nom),
                              text(weapon.type),
                              text(weapon.pourcentage, ' %'),
                              text(weapon.notes),
                          ],
                          ' '
                      )
                  ),
              ]
          })
        : strings(found)
    return <span className={cls('inline-list')}>{items.join(' · ')}</span>
}

function Combat({ source }: { source: Source }) {
    const actions = text(at(source, '/actionsParRound'))
    const defense = asRecord(at(source, '/defense'))
    const level = text(defense?.niveau)
    const legacy =
        typeof defense?.active === 'boolean'
            ? defense.active
                ? 'oui'
                : 'non'
            : ''
    const bonus = text(defense?.bonus)
    return (
        <>
            {actions && (
                <span className={cls('combat-actions')}>
                    {actions} action{actions === '1' ? '' : 's'} par round
                </span>
            )}
            {defense && (
                <Line
                    content={joined(
                        [
                            DEFENSE_LEVELS[level || legacy] ?? level,
                            bonus && `+${bonus}`,
                            text(defense.notes),
                        ],
                        ' '
                    )}
                    name="Défense"
                />
            )}
        </>
    )
}

function Action({ action, follow }: { action: Source; follow: boolean }) {
    const test = asRecord(action.test)
    const name = joined([text(action.nom), test ? skillText(test) : ''], ' — ')
    const effects = joined([...strings(action.effets), text(action.notes)])
    const dice =
        action.degats ??
        (action.desDeDegats !== undefined
            ? { profils: [{ des: `${text(action.desDeDegats)}d10` }] }
            : undefined)
    return (
        <span className={cls(follow ? 'follow-up' : 'action')}>
            {strings(action.conditions).map((condition, index) => (
                <span className={cls('trigger')} key={index}>
                    {condition}
                </span>
            ))}
            {name && <span className={cls('skill-name')}>{name}</span>}
            <Damage found={dice} />
            {effects && <span className={cls('note')}>{effects}</span>}
            {records(action.suites).map((next, index) => (
                <Action action={next} follow key={index} />
            ))}
        </span>
    )
}

function Status({ found }: { found: unknown }) {
    if (!Array.isArray(found)) return <Narrative found={found} />
    return records(found).map((state, index) => (
        <Line
            content={joined([
                text(state.versant),
                text(state.localisation).replace(/-/g, ' '),
                text(state.duree),
                text(state.notes),
            ])}
            key={index}
            name={text(state.nom) || 'État'}
        />
    ))
}

function StateHeader({ state }: { state: CompactCardState }) {
    return (
        <>
            <span className={cls('state-name')}>
                <strong className={cls('state-label')}>{state.name}</strong>
                {state.active && (
                    <span className={cls('state-active')}>État actuel</span>
                )}
            </span>
            {state.triggers.map((trigger, index) => (
                <span className={cls('trigger')} key={index}>
                    {trigger}
                </span>
            ))}
            {state.note && <span className={cls('note')}>{state.note}</span>}
        </>
    )
}

type SectionProps = {
    section: AdrenalinePresentationSection
    source: Source
    presentation: AdrenalinePresentation
    state?: CompactCardState
    onOpen: (block: AdrenalinePresentationBlock) => void
}

/** What a block prints, or null when it has no value to print. */
function blockContent(
    block: AdrenalinePresentationBlock,
    { source, presentation, state }: Omit<SectionProps, 'section' | 'onOpen'>
): ReactNode {
    if (block.form === 'state-header')
        return state ? <StateHeader state={state} /> : null
    const values = block.paths.map((pointer) => at(source, pointer))
    const always = block.form === 'name-card' || block.form === 'malus-tracks'
    if (!always && values.every(isEmpty)) return null
    const [found] = values
    switch (block.form) {
        case 'name-card':
            return (
                <NameCard
                    block={block}
                    presentation={presentation}
                    source={source}
                />
            )
        case 'narrative':
            return <Narrative found={found} />
        case 'compact-rows':
            return <CompactRows found={found} pointer={block.paths[0]} />
        case 'threshold-rows':
            return <Thresholds found={found} />
        case 'protection-lines':
            return <Protections found={found} />
        case 'malus-tracks':
            return <Tracks block={block} found={found} />
        case 'status-frames':
            return <Status found={found} />
        case 'skill-lines':
            return records(found).map((skill, index) => (
                <SkillLine key={index} skill={skill} />
            ))
        case 'inline-list':
            return <InlineList found={found} />
        case 'combat':
            return <Combat source={source} />
        case 'action-lines':
            return records(found).map((action, index) => (
                <Action action={action} follow={false} key={index} />
            ))
        default:
            /* A form this card does not draw yet is shown as plain lines, never dropped. */
            return block.paths.map((path, index) => (
                <Line
                    content={text(values[index])}
                    key={path}
                    name={label(lastSegment(path))}
                />
            ))
    }
}

/** A section's printed title: its label, then the value named by `labelFrom`. */
function sectionTitle(
    section: AdrenalinePresentationSection,
    source: Source
): string {
    const from = section.labelFrom ? text(at(source, section.labelFrom)) : ''
    return from ? `${section.label} (${from})` : section.label
}

/** One published section, or nothing when none of its blocks has a value to print. */
export function CompactSection({
    section,
    source,
    presentation,
    state,
    onOpen,
}: SectionProps) {
    const blocks = sortedBlocks(section).flatMap((block) => {
        const content = blockContent(block, { source, presentation, state })
        if (content === null) return []
        return [
            <button
                className={[
                    cls('block'),
                    cls(`form-${block.form ?? 'none'}`),
                    cls(`block-${block.id}`),
                ].join(' ')}
                key={block.id}
                type="button"
                onClick={() => onOpen(block)}
            >
                {content}
            </button>,
        ]
    })
    if (blocks.length === 0) return null
    const className = [
        cls('section'),
        cls(`section-${section.id}`),
        cls(`layout-${section.layout}`),
    ].join(' ')
    const title = sectionTitle(section, source)
    if (section.collapsible)
        return (
            <details className={className}>
                <summary className={cls('section-title')}>{title}</summary>
                {blocks}
            </details>
        )
    return (
        <section className={className}>
            {section.showTitle !== false && section.layout !== 'banner' && (
                <div className={cls('section-title')}>{title}</div>
            )}
            {blocks}
        </section>
    )
}

/** Root classes of a compact card: the published surface, value alignment and banner variant. */
export function compactCardClasses(
    presentation: AdrenalinePresentation,
    source: Source
): string {
    const { appearance, categories } = presentation
    const category = categories ? text(at(source, categories.path)) : ''
    return [
        CARD,
        `${CARD}--${appearance.surface}`,
        `${CARD}--values-${appearance.values.align}`,
        appearance.outerRule ? `${CARD}--outer-rule` : '',
        categories
            ? `${CARD}--banner-${categories.variants[category] ?? categories.defaultVariant}`
            : '',
    ]
        .filter(Boolean)
        .join(' ')
}
