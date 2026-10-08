import contract from 'schema-pbta/packs/monster-of-the-week/presentation-contract.json'
import type { MonsterOfTheWeekPlaybook as Published } from './schema'

/** The document is the published one: every field a region of the contract holds is there. */
export type MonsterOfTheWeekPlaybook = Published
export type Move = MonsterOfTheWeekPlaybook['moves'][number]

/** Regions, their order and their faces come from the published presentation contract. */
export const presentation = contract
export type Region = (typeof contract.regions)[number]
export type RegionId = Region['id']
export const regionById = (id: RegionId): Region | undefined =>
    contract.regions.find((region) => region.id === id)
export type SectionId = RegionId
export type SheetTarget = { kind: RegionId }
export type ViewState = {
    zoom: number
    previewWidth: number
    hidden: Record<SectionId, boolean>
    exportPrefs: { scale: 1 | 2 | 3 }
}
export type SheetState = { open: boolean; target: SheetTarget | null }
export const sectionIds: SectionId[] = [...contract.canonicalOrder]
export const defaultView: ViewState = {
    zoom: 1,
    previewWidth: 1000,
    hidden: Object.fromEntries(
        sectionIds.map((id) => [id, false])
    ) as ViewState['hidden'],
    exportPrefs: { scale: 2 },
}
export const defaultSheet: SheetState = { open: false, target: null }
export const blankPlaybook = (): MonsterOfTheWeekPlaybook => ({
    slug: 'untitled-hunter',
    name: 'Untitled Hunter',
    game: 'monster-of-the-week',
    description: 'An original Monster of the Week playbook.',
    stats: { charm: 0 },
    moves: [],
    improvements: [{ label: 'Take a move.' }],
    editorial: {
        opening: {
            heading: 'Opening',
            paragraphs: ['Introduce this hunter.'],
        },
        playAdvice: { heading: 'Advice', paragraphs: ['Keep watch.'] },
        identity: { heading: 'Identity', paragraphs: ['Choose a road.'] },
        progression: {
            heading: 'Progression',
            paragraphs: ['Take a move.'],
        },
    },
})
