import { useUiText } from '@/i18n/text'
import { useEffect } from 'react'
import {
    MONSTRE_PRESENTATION,
    type AdrenalinePresentation,
    type AdrenalinePresentationBlock,
} from 'schema-adrenaline/presentation'
import { useAdrenalineDocument } from '../../shared/hooks'
import {
    adrenalineSheetTokens,
    asRecord,
    at,
    installAdrenalineFontFaces,
    sortedSections,
} from '../../shared/presentation'
import {
    CompactSection,
    compactCardClasses,
    publishedCards,
    publishedSection,
    stateBadgeOf,
    type CardId,
    type CompactCardState,
} from '../../shared/preview/CompactCard'
import '../../shared/preview/compactCard.css'
import { maximumStates } from '../../shared/schemaFields'
import type { MonstreSection } from '../../shared/sections'
import { panelFor, rootKeys } from '../editTargets'
import { blankMonstre } from '../sample'
import type { MonsterDocument } from '../states'

const PRESENTATION: AdrenalinePresentation = MONSTRE_PRESENTATION

const BASE = 'base'
const LEGACY_STATE = 'alternatif-historique'
const STATE_KEYS = ['etatActif', 'etatAlternatif', 'etats']

type PrintedState = {
    id: string
    nom: string
    declencheurs: string[]
    delta: MonsterDocument
    notes?: string
}

type StateCard = {
    card: CardId
    /** `base` or the id of the state this card prints. */
    id: string
    source: MonsterDocument
    state: CompactCardState
}

function editTarget(block: AdrenalinePresentationBlock): MonstreSection {
    return panelFor(block.paths)
}

function strings(value: unknown): string[] {
    return Array.isArray(value)
        ? value.filter(
              (item): item is string => typeof item === 'string' && item !== ''
          )
        : []
}

function text(value: unknown): string {
    return typeof value === 'string' ? value : ''
}

/** The base of the creature: the document without its alternative states. */
function baseOf(source: MonsterDocument): MonsterDocument {
    return Object.fromEntries(
        Object.entries(source).filter(([key]) => !STATE_KEYS.includes(key))
    )
}

/** The entered states; the legacy `etatAlternatif` reads as one state whose characteristics overlay the base. */
function statesOf(source: MonsterDocument): PrintedState[] {
    const legacy = asRecord(source.etatAlternatif)
    if (legacy) {
        const delta: MonsterDocument = {}
        const characteristics = asRecord(legacy.caracteristiques)
        if (characteristics)
            delta.caracteristiques = {
                ...asRecord(source.caracteristiques),
                ...characteristics,
            }
        for (const key of ['zoneDeDetection', 'deplacement', 'actionsParRound'])
            if (legacy[key] !== undefined) delta[key] = legacy[key]
        const notes = text(legacy.notes)
        return [
            {
                id: LEGACY_STATE,
                nom: text(legacy.nom) || 'État alternatif',
                declencheurs: strings(legacy.declencheurs),
                delta,
                ...(notes ? { notes } : {}),
            },
        ]
    }
    const entered = Array.isArray(source.etats) ? source.etats : []
    return entered.flatMap((item) => {
        const state = asRecord(item)
        const id = text(state?.id)
        if (!state || !id) return []
        return [
            {
                id,
                nom: text(state.nom) || id,
                declencheurs: strings(state.declencheurs),
                delta: asRecord(state.delta) ?? {},
            },
        ]
    })
}

/*
 * The principal card prints `etatPrincipal`, or the base; the secondary card prints the other
 * one: the base when the principal is a state, else the first state. A creature without states
 * has one card. A state overlays the base field by field, as entered.
 */
function stateCards(
    source: MonsterDocument,
    enteredPath: string | undefined
): StateCard[] {
    const base = baseOf(source)
    const states = statesOf(source)
    const known = (id: string) =>
        id === BASE || states.some((state) => state.id === id)
    const principal = known(text(source.etatPrincipal))
        ? text(source.etatPrincipal)
        : BASE
    const secondary = principal !== BASE ? BASE : states[0]?.id
    /*
     * The current state, as the schema says: absent or `base` designates the base profile, a known
     * id designates that state, anything else designates no card. A creature with no state besides
     * its base has no current state to tick.
     */
    const entered = enteredPath ? text(at(source, enteredPath)) : ''
    const current =
        states.length === 0
            ? undefined
            : entered === '' || entered === BASE
              ? BASE
              : states.some((state) => state.id === entered)
                ? entered
                : undefined
    const baseState = asRecord(source.etatDeBase)
    const resolve = (card: StateCard['card'], id: string): StateCard => {
        const state = states.find((candidate) => candidate.id === id)
        // The published state enters its note in its delta; the legacy form entered it beside.
        const note = text(state?.notes) || text(state?.delta.notes)
        return {
            card,
            id,
            source: state ? { ...base, ...state.delta } : base,
            state: {
                name: state
                    ? state.nom
                    : text(baseState?.nom) || 'État de base',
                triggers: state
                    ? state.declencheurs
                    : strings(baseState?.declencheurs),
                active: current === id,
                current: current === id,
                ...(note ? { note } : {}),
            },
        }
    }
    return secondary === undefined
        ? [resolve('principal', principal)]
        : [resolve('principal', principal), resolve('secondaire', secondary)]
}

/* Entered means non-empty, as the Handbook reads it: an empty list or an empty object enters nothing. */
function isEntered(found: unknown): boolean {
    if (found === undefined || found === null || found === '') return false
    if (Array.isArray(found)) return found.length > 0
    return typeof found === 'object'
        ? Object.keys(found as object).length > 0
        : true
}

/*
 * A card exists when the presentation declares it and, if it names `existsWhenAny`, the document
 * enters a value at one of those pointers. A presentation that declares no cards leaves every
 * resolvable state its card.
 */
function cardExists(card: CardId, source: MonsterDocument): boolean {
    const declared = publishedCards(PRESENTATION)?.find(
        (entry) => entry.id === card
    )
    if (!declared) return !publishedCards(PRESENTATION)
    return (
        !declared.existsWhenAny ||
        declared.existsWhenAny.some((pointer) => isEntered(at(source, pointer)))
    )
}

/*
 * The card is laid out by the published presentation: the banner and description, then one card
 * per printed state holding the sections published for it, then the sections outside the cards.
 */
export function MonstrePreview() {
    const { document, openSection } = useAdrenalineDocument<
        Record<string, unknown>,
        MonstreSection
    >(
        'adrenaline.monstre',
        blankMonstre() as unknown as Record<string, unknown>
    )
    useEffect(installAdrenalineFontFaces, [])
    const ui = useUiText()
    const base = baseOf(document)
    const badge = stateBadgeOf(PRESENTATION)
    const cards = stateCards(document, badge?.current.path).filter(({ card }) =>
        cardExists(card, document)
    )
    /* States entered beyond what the published schema allows are not printed; say so. */
    const allowed = maximumStates()
    const unprinted =
        allowed === undefined ? 0 : statesOf(document).length - allowed
    const printed = cards.map(({ card }) => card)
    const sections = sortedSections(PRESENTATION)
    /* Outside the cards the sheet has one source: what the principal card prints. */
    const principal = cards.find(({ card }) => card === 'principal')
    const sheetSource = principal?.source ?? base
    const onOpen = (block: AdrenalinePresentationBlock) =>
        openSection(editTarget(block), principal?.id, rootKeys(block.paths))
    const firstCarded = sections.findIndex((section) => section.cards)
    /* A section is on a card it names, or on its fallback card when none of those is printed. */
    const printedOn = (section: (typeof sections)[number], card: CardId) => {
        const published = publishedSection(section)
        if (published.cards?.includes(card)) return true
        return (
            published.fallbackCard === card &&
            !published.cards?.some((named) => printed.includes(named))
        )
    }
    return (
        <article
            className={compactCardClasses(PRESENTATION, document)}
            style={adrenalineSheetTokens}
        >
            {sections.map((section, index) => {
                if (!section.cards)
                    return (
                        <CompactSection
                            key={section.id}
                            presentation={PRESENTATION}
                            section={section}
                            source={sheetSource}
                            onOpen={onOpen}
                        />
                    )
                if (index !== firstCarded) return null
                return (
                    <div
                        className={
                            cards.length === 1
                                ? 'adr-compact__cards adr-compact__cards--single'
                                : 'adr-compact__cards'
                        }
                        key="cards"
                    >
                        {cards.map(({ card, id, source, state }) => (
                            <div
                                className={[
                                    'adr-compact__state-card',
                                    `adr-compact__state-card--${card}`,
                                    state.active
                                        ? 'adr-compact__state-card--active'
                                        : '',
                                ]
                                    .filter(Boolean)
                                    .join(' ')}
                                key={card}
                            >
                                {sections
                                    .filter((carded) => printedOn(carded, card))
                                    .flatMap((carded, _, onThisCard) => {
                                        const join =
                                            publishedSection(carded).joinedTo
                                        const target =
                                            join?.card === card
                                                ? onThisCard.find(
                                                      (other) =>
                                                          other.id ===
                                                          join.section
                                                  )
                                                : undefined
                                        /* Printed under the section it joins, not on its own. */
                                        if (target) return []
                                        const following = onThisCard.find(
                                            (other) => {
                                                const joined =
                                                    publishedSection(
                                                        other
                                                    ).joinedTo
                                                return (
                                                    joined?.card === card &&
                                                    joined.section === carded.id
                                                )
                                            }
                                        )
                                        return [
                                            <CompactSection
                                                card={card}
                                                joined={following}
                                                key={carded.id}
                                                presentation={PRESENTATION}
                                                section={carded}
                                                source={source}
                                                state={state}
                                                onOpen={(block) =>
                                                    openSection(
                                                        editTarget(block),
                                                        id,
                                                        rootKeys(block.paths)
                                                    )
                                                }
                                            />,
                                        ]
                                    })}
                            </div>
                        ))}
                    </div>
                )
            })}
            {unprinted > 0 && (
                <p className="adr-compact__notice" role="status">
                    {ui('adrenaline:shared.card.statesNotPrinted', {
                        count: unprinted,
                    })}
                </p>
            )}
        </article>
    )
}
