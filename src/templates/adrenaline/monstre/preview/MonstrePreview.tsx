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
    installAdrenalineFontFaces,
    sortedSections,
} from '../../shared/presentation'
import {
    CompactSection,
    compactCardClasses,
    type CompactCardState,
} from '../../shared/preview/CompactCard'
import '../../shared/preview/compactCard.css'
import type { MonstreSection } from '../../shared/sections'
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
    card: 'principal' | 'secondaire'
    source: MonsterDocument
    state: CompactCardState
}

/* The edit sheet a block opens, read from the first document path it shows. */
const editTargets: Record<string, MonstreSection | undefined> = {
    nom: 'basic',
    description: 'basic',
    zoneDeDetection: 'basic',
    deplacement: 'basic',
    actionsParRound: 'basic',
    etatPrincipal: 'states',
    caracteristiques: 'statistics',
    sante: 'health',
    etatsPermanents: 'health',
    malusAvantHs: 'health',
    protections: 'protections',
    comportement: 'behaviour',
    traitsSpeciaux: 'behaviour',
    actions: 'behaviour',
    competences: 'skills',
    equipement: 'equipment',
    contagion: 'contagion',
    narratif: 'narrative',
}

function editTarget(block: AdrenalinePresentationBlock): MonstreSection {
    return editTargets[block.paths[0]?.split('/')[1] ?? ''] ?? 'meta'
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
function stateCards(source: MonsterDocument): StateCard[] {
    const base = baseOf(source)
    const states = statesOf(source)
    const known = (id: string) =>
        id === BASE || states.some((state) => state.id === id)
    const principal = known(text(source.etatPrincipal))
        ? text(source.etatPrincipal)
        : BASE
    const secondary = principal !== BASE ? BASE : states[0]?.id
    const active = known(text(source.etatActif)) ? text(source.etatActif) : BASE
    const baseState = asRecord(source.etatDeBase)
    const resolve = (card: StateCard['card'], id: string): StateCard => {
        const state = states.find((candidate) => candidate.id === id)
        return {
            card,
            source: state ? { ...base, ...state.delta } : base,
            state: {
                name: state
                    ? state.nom
                    : text(baseState?.nom) || 'État de base',
                triggers: state
                    ? state.declencheurs
                    : strings(baseState?.declencheurs),
                active: states.length > 0 && active === id,
                ...(state?.notes ? { note: state.notes } : {}),
            },
        }
    }
    return secondary === undefined
        ? [resolve('principal', principal)]
        : [resolve('principal', principal), resolve('secondaire', secondary)]
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
    const base = baseOf(document)
    const cards = stateCards(document)
    const sections = sortedSections(PRESENTATION)
    const onOpen = (block: AdrenalinePresentationBlock) =>
        openSection(editTarget(block))
    const firstCarded = sections.findIndex((section) => section.cards)
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
                            source={base}
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
                        {cards.map(({ card, source, state }) => (
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
                                    .filter((carded) =>
                                        carded.cards?.includes(card)
                                    )
                                    .map((carded) => (
                                        <CompactSection
                                            key={carded.id}
                                            presentation={PRESENTATION}
                                            section={carded}
                                            source={source}
                                            state={state}
                                            onOpen={onOpen}
                                        />
                                    ))}
                            </div>
                        ))}
                    </div>
                )
            })}
        </article>
    )
}
