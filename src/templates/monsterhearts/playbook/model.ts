import type { TranslationKey } from '@/i18n/text'
import type { MonsterheartsPlaybook as Published } from 'schema-pbta'

export type EditorialBlock = { heading: string; paragraphs: string[] }
export type MonsterheartsEditorial = Record<
    | 'opening'
    | 'playAdvice'
    | 'identity'
    | 'progression'
    | 'darkestSelf'
    | 'sexMove'
    | 'mcGuidance',
    EditorialBlock
>
export type MonsterheartsPlaybook = Omit<
    Published,
    'strings' | 'conditions' | 'harm'
> & {
    strings: { max: number; starting: number }
    conditions: Array<{ name: string; description?: string }>
    harm: number
    editorial: MonsterheartsEditorial
}
export type SectionId =
    | 'strings'
    | 'conditions'
    | 'editorial'
    | 'moves'
    | 'advancement'
    | 'advances'
    | 'harm'
export type ViewState = {
    zoom: number
    previewWidth: number
    hidden: Record<SectionId, boolean>
    exportPrefs: { scale: 1 | 2 | 3 }
}
export type SheetState = { open: boolean; target: SectionId | 'basic' | null }
export const sections: Array<{ id: SectionId; label: TranslationKey }> = [
    { id: 'strings', label: 'pbta:monsterhearts.sections.strings' },
    { id: 'conditions', label: 'pbta:monsterhearts.sections.conditions' },
    { id: 'editorial', label: 'pbta:monsterhearts.sections.editorial' },
    { id: 'moves', label: 'pbta:monsterhearts.sections.moves' },
    { id: 'advancement', label: 'pbta:monsterhearts.sections.advancement' },
    { id: 'advances', label: 'pbta:monsterhearts.sections.advances' },
    { id: 'harm', label: 'pbta:monsterhearts.sections.harm' },
]
export const defaultView: ViewState = {
    zoom: 1,
    previewWidth: 1123,
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
    advances: [{ label: 'Take an original advance.' }],
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
