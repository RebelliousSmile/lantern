import { regionById, sectionIds, type SectionId } from './model'

/* Labels arrive from the published presentation contract: text, not keys. */
export const monsterOfTheWeekSections: Array<{
    id: SectionId
    label: { text: string }
}> = sectionIds.map((id) => ({
    id,
    label: { text: regionById(id)?.label ?? id },
}))
