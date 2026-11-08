import { ClickableSection } from '../../../shared/preview/components/Clickable'
import {
    useOtherscapeCharacterSheetStore,
    useOtherscapeCharacterStore,
} from '../../hooks'

/* The sheet's top edge: the character name on a slanted slab. It is not a
   section, so it is never gated. */
export default function NameBlock() {
    const { otherscapeCharacter } = useOtherscapeCharacterStore()
    const { openSheet } = useOtherscapeCharacterSheetStore()

    return (
        <ClickableSection
            onClick={() => openSheet({ kind: 'basic', mode: 'edit' })}
            ariaLabel="Edit the character name"
        >
            <div className="os-character-name os-bar">
                <span className="os-character-name__text os-display">
                    {otherscapeCharacter.name.trim() || 'Unnamed Character'}
                </span>
            </div>
        </ClickableSection>
    )
}
