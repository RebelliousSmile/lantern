import type { TranslationKey } from '@/i18n/text'
import { sectionIds, type SectionId } from './model'

/* Keys, not text: the appearance panel translates them, the preview resolves them in English. */
export const urbanShadowsSections: Array<{
    id: SectionId
    label: TranslationKey
}> = sectionIds.map((id) => ({
    id,
    label: `pbta:urbanShadows.sections.${id}` as const,
}))
