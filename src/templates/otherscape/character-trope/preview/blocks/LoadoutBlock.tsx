import { renderLitmInline } from '@/utils/markdown'
import { ClickableInline } from '../../../shared/preview/components/Clickable'
import { SectionHeader } from '../../../shared/preview/components/SectionHeader'
import {
    useOtherscapeCharacterTropeSheetStore,
    useOtherscapeCharacterTropeStore,
} from '../../hooks'

/* The gear the character starts with, printed as written. An entry here names
   what is carried; it is not a key into the loadout item catalog, so nothing is
   looked up and nothing is linked. */
export default function LoadoutBlock() {
    const { otherscapeCharacterTrope } = useOtherscapeCharacterTropeStore()
    const { openSheet } = useOtherscapeCharacterTropeSheetStore()

    const loadout = otherscapeCharacterTrope.loadout

    return (
        <div className="character-trope-loadout">
            <SectionHeader
                title="Loadout"
                onClick={() => openSheet({ kind: 'loadout', mode: 'create' })}
            />

            {loadout.length ? (
                <ul className="character-trope-loadout__list">
                    {loadout.map((entry, index) => (
                        <li key={`loadout-${index}`}>
                            <ClickableInline
                                onClick={() =>
                                    openSheet({
                                        kind: 'loadout',
                                        index,
                                        mode: 'edit',
                                    })
                                }
                                ariaLabel={`Edit loadout entry ${index + 1}`}
                                className="character-trope-entry w-full"
                            >
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: renderLitmInline(entry),
                                    }}
                                />
                            </ClickableInline>
                        </li>
                    ))}
                </ul>
            ) : (
                <button
                    type="button"
                    className="text-xs underline decoration-dotted opacity-80 hover:opacity-100 cursor-pointer"
                    onClick={() =>
                        openSheet({ kind: 'loadout', mode: 'create' })
                    }
                >
                    add loadout entries
                </button>
            )}
        </div>
    )
}
