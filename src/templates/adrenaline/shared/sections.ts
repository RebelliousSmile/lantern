import type { TranslationKey } from '@/i18n/text'
import type { editTargets } from './presentation'

/* Section ids are the single vocabulary shared by previews, descriptors and
   editor panels: a preview can only open a section its editor can render. */

/** PJ sections: whatever a presentation block can open, plus provenance. */
export type PjSection = (typeof editTargets)[keyof typeof editTargets] | 'meta'
export type PnjSection =
    | 'basic'
    | 'identity'
    | 'statistics'
    | 'health'
    | 'protections'
    | 'formations'
    | 'equipment'
    | 'narrative'
    | 'meta'
export type MonstreSection =
    | 'basic'
    | 'statistics'
    | 'health'
    | 'protections'
    | 'behaviour'
    | 'skills'
    | 'equipment'
    | 'states'
    | 'contagion'
    | 'narrative'
    | 'meta'

const sectionLabel = (id: string) =>
    `adrenaline:sections.${id}` as TranslationKey

function sections<T extends string>(ids: readonly T[]) {
    return ids.map((id) => ({ id, label: sectionLabel(id) }))
}

export const pjSections = sections<PjSection>([
    'parameters',
    'identity',
    'characteristics',
    'health',
    'protections',
    'formations',
    'equipment',
    'meta',
])
export const pnjSections = sections<PnjSection>([
    'basic',
    'identity',
    'statistics',
    'health',
    'protections',
    'formations',
    'equipment',
    'narrative',
    'meta',
])
export const monstreSections = sections<MonstreSection>([
    'basic',
    'statistics',
    'health',
    'protections',
    'behaviour',
    'skills',
    'equipment',
    'states',
    'contagion',
    'narrative',
    'meta',
])
