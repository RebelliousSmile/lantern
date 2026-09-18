import type { UrbanShadowsPlaybook as PublishedUrbanShadowsPlaybook } from './schema'

export type Move = { name: string; moveType: string; description: string; checked?: boolean }
export type Relationship = NonNullable<
    PublishedUrbanShadowsPlaybook['mortalRelationships']
>[number]
export type CreationQuestion = NonNullable<
    PublishedUrbanShadowsPlaybook['creation']
>[number]
export type Scar = { name: string; stat: string; modifier: number | null }
export type Harm = {
    armor: number | null
    faint: number | null
    serious: number | null
    critical: number | null
}
export type Corruption = {
    trigger: string
    advances: { label: string; checked?: boolean }[]
    moves: string[]
}
export type Editorial = {
    opening: { heading: string; paragraphs: string[] }
    playAdvice: { heading: string; paragraphs: string[] }
    identity: { heading: string; paragraphs: string[] }
    progression: { heading: string; paragraphs: string[] }
}
export type UrbanShadowsPlaybook = {
    slug: string
    name: string
    game: string
    description: string
    stats: Record<string, number>
    statuses: Record<string, number>
    attributes: Record<string, string | number | boolean | string[]>
    moves: Move[]
    startingMoves: string[]
    mortalRelationships: Relationship[]
    harm: Harm
    scars: Scar[]
    corruption: Corruption
    endMove: string
    editorial: Editorial
    creation: CreationQuestion[]
    gear: { name: string; description: string }[]
    advancement: { label: string; checked?: boolean }[]
}
export type SectionId =
    | 'circles'
    | 'relationships'
    | 'harm'
    | 'corruption'
    | 'editorial'
    | 'moves'
    | 'creation'
    | 'gear'
    | 'advancement'
export type SheetTarget = {
    kind:
        | 'basic'
        | 'circles'
        | 'relationships'
        | 'harm'
        | 'corruption'
        | 'editorial'
        | 'moves'
        | 'creation'
        | 'gear'
        | 'advancement'
}
export type ViewState = {
    zoom: number
    previewWidth: number
    hidden: Record<SectionId, boolean>
    exportPrefs: { scale: 1 | 2 | 3 }
}
export type SheetState = { open: boolean; target: SheetTarget | null }
export const sectionIds: SectionId[] = [
    'circles',
    'relationships',
    'harm',
    'corruption',
    'editorial',
    'moves',
    'creation',
    'gear',
    'advancement',
]
export const defaultView: ViewState = {
    zoom: 1,
    previewWidth: 620,
    hidden: Object.fromEntries(sectionIds.map((id) => [id, false])) as Record<
        SectionId,
        boolean
    >,
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
