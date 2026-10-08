import contract from 'schema-pbta/packs/masks/presentation-contract.json'
import type { MasksPlaybook as PublishedMasksPlaybook } from './schema'

/** The document is the published one: every field a region of the contract holds is there. */
export type MasksPlaybook = PublishedMasksPlaybook
export type Move = MasksPlaybook['moves'][number]

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
export const blankPlaybook = (): MasksPlaybook => ({
    slug: 'untitled-masks-playbook',
    name: 'Untitled Masks Playbook',
    game: 'masks',
    description: 'An original Masks playbook.',
    stats: { danger: 0 },
    moves: [],
    momentOfTruth: 'Describe this hero at their brightest.',
    editorial: {
        opening: {
            heading: 'Opening',
            paragraphs: ['Introduce this playbook.'],
        },
        playAdvice: { heading: 'Advice', paragraphs: ['Play bravely.'] },
        identity: { heading: 'Identity', paragraphs: ['Choose a name.'] },
        progression: {
            heading: 'Progression',
            paragraphs: ['Mark Potential.'],
        },
    },
})
