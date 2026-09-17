import type { MonsterheartsPlaybook as Published } from 'schema-pbta'

export type MonsterheartsPlaybook = Published
export type SectionId =
    | 'strings'
    | 'conditions'
    | 'editorial'
    | 'moves'
    | 'advances'
    | 'harm'
export type ViewState = {
    zoom: number
    previewWidth: number
    hidden: Record<SectionId, boolean>
    exportPrefs: { scale: 1 | 2 | 3 }
}
export type SheetState = { open: boolean; target: SectionId | 'basic' | null }
export const sections: Array<{ id: SectionId; label: string }> = [
    { id: 'strings', label: 'Strings' },
    { id: 'conditions', label: 'Conditions' },
    { id: 'editorial', label: 'Editorial' },
    { id: 'moves', label: 'Moves' },
    { id: 'advances', label: 'Advances' },
    { id: 'harm', label: 'Harm' },
]
export const defaultView: ViewState = {
    zoom: 1,
    previewWidth: 600,
    hidden: Object.fromEntries(sections.map(({ id }) => [id, false])) as Record<
        SectionId,
        boolean
    >,
    exportPrefs: { scale: 2 },
}
export const defaultSheet: SheetState = { open: false, target: null }
const section = (heading: string, paragraphs: string[]) => ({
    heading,
    paragraphs,
})
export const blankPlaybook = (): MonsterheartsPlaybook => ({
    slug: 'untitled-skin',
    name: 'Untitled Skin',
    game: 'monsterhearts',
    description: 'An original Monsterhearts skin.',
    stats: { hot: 0, cold: 0, volatile: 0, dark: 0 },
    moves: [],
    strings: { max: 4, starting: 0 },
    conditions: [],
    advances: ['Take an original advance.'],
    harm: 0,
    editorial: {
        opening: section('Opening', ['Introduce this skin.']),
        playAdvice: section('Playing the skin', ['Describe its choices.']),
        identity: section('Identity', ['Choose who this skin is.']),
        progression: section('Progression', ['Take an original advance.']),
        darkestSelf: section('Darkest Self', ['Describe its demands.']),
        sexMove: section('Sex Move', ['Describe an intimate consequence.']),
        mcGuidance: section('For the MC', ['Describe guidance for the MC.']),
    },
})
