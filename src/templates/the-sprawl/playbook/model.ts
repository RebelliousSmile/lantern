import contract from 'schema-pbta/packs/the-sprawl/presentation-contract.json'
import type { TheSprawlPlaybook as Published } from './schema'

/** The document is the published one: every field a region of the contract holds is there. */
export type TheSprawlPlaybook = Published
export type Move = TheSprawlPlaybook['moves'][number]
export type Line = NonNullable<TheSprawlPlaybook['look']>[number]
export type Link = NonNullable<TheSprawlPlaybook['links']>[number]

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
export const blankPlaybook = (): TheSprawlPlaybook => ({
    slug: 'untitled-operator',
    name: 'Untitled Operator',
    game: 'the-sprawl',
    description: 'An original The Sprawl playbook.',
    stats: { cool: 0 },
    moves: [],
    directives: ['Protect people.'],
    editorial: {
        opening: {
            heading: 'Opening',
            paragraphs: ['Introduce this operator.'],
        },
        playAdvice: { heading: 'Advice', paragraphs: ['Watch the city.'] },
        identity: { heading: 'Identity', paragraphs: ['Choose a contact.'] },
        progression: {
            heading: 'Progression',
            paragraphs: ['Finish the mission.'],
        },
    },
})
