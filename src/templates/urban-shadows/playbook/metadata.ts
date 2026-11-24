import { localizedLabel } from '@/templates/pbta/shared/localizedLabel'
import { regionById, sectionIds, type SectionId } from './model'

/* Labels arrive from the published presentation contract: text, not keys. The text is read at each
   call, so the shell follows the interface language. */
export const urbanShadowsSections: Array<{
    id: SectionId
    label: { text: string }
}> = sectionIds.map((id) => ({
    id,
    label: {
        get text() {
            const region = regionById(id)
            return region ? localizedLabel(region.label) : id
        },
    },
}))
