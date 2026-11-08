import { renderLitmInline } from '@/utils/markdown'
import { ClickableInline } from '../../../shared/preview/components/Clickable'
import {
    useOtherscapeCharacterTropeSheetStore,
    useOtherscapeCharacterTropeStore,
} from '../../hooks'

/* The gear the character starts with, run in after "Loadout:" the way the book
   sets it, each entry highlighted. An entry names what is carried; it is not a
   key into the loadout item catalog, so nothing is looked up and nothing is
   linked. */
export default function LoadoutBlock() {
    const { otherscapeCharacterTrope } = useOtherscapeCharacterTropeStore()
    const { openSheet } = useOtherscapeCharacterTropeSheetStore()

    const loadout = otherscapeCharacterTrope.loadout

    return (
        <p className="character-trope-loadout">
            <button
                type="button"
                className="character-trope-loadout__label"
                onClick={() => openSheet({ kind: 'loadout', mode: 'create' })}
                aria-label="Add a loadout entry"
            >
                Loadout:
            </button>{' '}
            {loadout.length ? (
                loadout.map((entry, index) => (
                    <span key={`loadout-${index}`}>
                        {index > 0 && ', '}
                        <ClickableInline
                            onClick={() =>
                                openSheet({
                                    kind: 'loadout',
                                    index,
                                    mode: 'edit',
                                })
                            }
                            ariaLabel={`Edit loadout entry ${index + 1}`}
                            className="character-trope-entry"
                        >
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: renderLitmInline(entry),
                                }}
                            />
                        </ClickableInline>
                    </span>
                ))
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
        </p>
    )
}
