import contract from 'schema-pbta/packs/urban-shadows/presentation-contract.json'
import type { UrbanShadowsPlaybook as PublishedUrbanShadowsPlaybook } from './schema'

/** The document is the published one: every field a region of the contract holds is there. */
export type UrbanShadowsPlaybook = PublishedUrbanShadowsPlaybook
export type Move = UrbanShadowsPlaybook['moves'][number]
export type Relationship = NonNullable<
    UrbanShadowsPlaybook['mortalRelationships']
>[number]
export type CreationQuestion = NonNullable<
    UrbanShadowsPlaybook['creation']
>[number]

/** Regions, their order and their rows come from the published presentation contract. */
export const presentation = contract
export type Region = (typeof contract.regions)[number]
export type RegionId = Region['id']
export const regionById = (id: RegionId): Region | undefined =>
    contract.regions.find((region) => region.id === id)
export type SectionId = RegionId
export type SheetTarget = { kind: 'basic' | RegionId }
export type ViewState = {
    zoom: number
    previewWidth: number
    hidden: Record<SectionId, boolean>
    exportPrefs: { scale: 1 | 2 | 3 }
}
export type SheetState = { open: boolean; target: SheetTarget | null }
export const sectionIds: SectionId[] = contract.canonicalOrder.filter(
    (id) => id !== 'game-identity'
)
export const defaultView: ViewState = {
    zoom: 1,
    previewWidth: 1000,
    hidden: Object.fromEntries(sectionIds.map((id) => [id, false])),
    exportPrefs: { scale: 2 },
}
export const defaultSheet: SheetState = { open: false, target: null }
export const blankPlaybook = (): UrbanShadowsPlaybook => ({
    slug: 'untitled-urban-shadows-playbook',
    name: 'Untitled Urban Shadows Playbook',
    game: 'urban-shadows',
    description: 'An original Urban Shadows playbook.',
    stats: { blood: 0, heart: 0, mind: 0, spirit: 0 },
    statuses: {},
    attributes: {},
    moves: [],
    startingMoves: [],
    mortalRelationships: [],
    harm: { armor: 0, faint: 1, serious: 1, critical: 1 },
    scars: [],
    corruption: {
        trigger: 'When you cross a line to survive the city.',
        advances: [{ label: 'Take an original corruption advance.' }],
        moves: [],
    },
    endMove: 'When this story ends, choose what your character leaves behind.',
    editorial: {
        opening: {
            heading: 'Opening',
            paragraphs: ['Introduce this playbook.'],
        },
        playAdvice: {
            heading: 'Playing the playbook',
            paragraphs: ['Describe its choices.'],
        },
        identity: {
            heading: 'Identity',
            paragraphs: ['Choose your place in the city.'],
        },
        progression: {
            heading: 'Progression',
            paragraphs: ['Grow through the city.'],
        },
    },
    creation: [],
    gear: [],
    advancement: [],
})
