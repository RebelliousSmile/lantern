import type { TemplateSectionDefinition } from '@/core/templates/types'
import type { UiText } from '@/i18n/text'

export const adrenalineSection = (
    id: string,
    label: UiText
): TemplateSectionDefinition => ({ id, label })
