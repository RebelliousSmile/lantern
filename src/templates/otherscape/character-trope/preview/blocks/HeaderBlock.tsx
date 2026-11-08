import { renderLitmMarkdown } from '@/utils/markdown'
import { ClickableSection } from '../../../shared/preview/components/Clickable'
import { SectionGate } from '../../../shared/preview/components/SectionGate'
import {
    shouldShow,
    useOtherscapeCharacterTropeSheetStore,
    useOtherscapeCharacterTropeStore,
    useOtherscapeCharacterTropeViewStore,
} from '../../hooks'

/* The category the book prints on a tab of its own above the panel, gold on
   dark olive. It falls back on what the card is when the author has not filed
   the trope under anything. */
export function CategoryTab() {
    const { otherscapeCharacterTrope } = useOtherscapeCharacterTropeStore()
    const { openSheet } = useOtherscapeCharacterTropeSheetStore()

    const category = otherscapeCharacterTrope.category.trim()

    return (
        <button
            type="button"
            className="character-trope-category"
            onClick={() => openSheet({ kind: 'basic', mode: 'edit' })}
            aria-label="Edit the category"
        >
            {category || 'Character Trope'}
        </button>
    )
}

export default function HeaderBlock() {
    const { otherscapeCharacterTrope } = useOtherscapeCharacterTropeStore()
    const { openSheet } = useOtherscapeCharacterTropeSheetStore()
    const view = useOtherscapeCharacterTropeViewStore()

    const openBasic = () => openSheet({ kind: 'basic', mode: 'edit' })

    /* The name is the card's head rather than a section, so it is not gated:
       a Character Trope with nothing filled in still prints it. The
       description below is a region of its own and is. */
    return (
        <>
            <ClickableSection
                onClick={openBasic}
                ariaLabel="Edit the character trope name"
            >
                <h3 className="character-trope-title">
                    {otherscapeCharacterTrope.name ||
                        'Untitled Character Trope'}
                </h3>
            </ClickableSection>

            <SectionGate
                show={shouldShow(otherscapeCharacterTrope, 'description', view)}
            >
                <ClickableSection
                    onClick={openBasic}
                    ariaLabel="Edit the description"
                >
                    <div className="character-trope-description">
                        {otherscapeCharacterTrope.description.trim() ? (
                            <div
                                className="character-trope-description__text"
                                dangerouslySetInnerHTML={{
                                    __html: renderLitmMarkdown(
                                        otherscapeCharacterTrope.description
                                    ),
                                }}
                            />
                        ) : (
                            <span className="os-placeholder">
                                add a short description
                            </span>
                        )}
                    </div>
                </ClickableSection>
            </SectionGate>
        </>
    )
}
