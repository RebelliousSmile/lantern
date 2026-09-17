import { sectionIds, type SectionId } from './model'
export const urbanShadowsSections: Array<{ id: SectionId; label: string }> =
    sectionIds.map((id) => ({
        id,
        label: {
            circles: 'Circles & Status',
            relationships: 'Mortal Relationships',
            harm: 'Harm & Scars',
            corruption: 'Corruption & End Move',
            editorial: 'Editorial',
            moves: 'Moves',
            creation: 'Creation',
            gear: 'Gear',
            advancement: 'Advancement',
        }[id],
    }))
