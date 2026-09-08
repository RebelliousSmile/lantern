import { renderLitmMarkdown } from '@/utils/markdown'
import { ClickableSection } from '../../../shared/preview/components/Clickable'
import { SectionGate } from '../../../shared/preview/components/SectionGate'
import {
    shouldShow,
    useOtherscapeCharacterTropeSheetStore,
    useOtherscapeCharacterTropeStore,
    useOtherscapeCharacterTropeViewStore,
} from '../../hooks'

export default function HeaderBlock() {
    const { otherscapeCharacterTrope } = useOtherscapeCharacterTropeStore()
    const { openSheet } = useOtherscapeCharacterTropeSheetStore()
    const view = useOtherscapeCharacterTropeViewStore()

    const openBasic = () => openSheet({ kind: 'basic', mode: 'edit' })

    /* The band and the name are the card's top edge rather than sections, so
       neither is gated: a Character Trope with nothing filled in still prints a
       frame. The description below is a region of its own and is. */
    return (
        <>
            <ClickableSection
                onClick={openBasic}
                ariaLabel="Edit the character trope name and category"
            >
                <div className="character-trope-header os-bar">
                    <span className="character-trope-header__kind os-label">
                        Character Trope
                    </span>
                    {/* The category is a free label rather than a themebook, so
                        the band prints it as written and skips it when the
                        author has not filed the trope under anything. */}
                    {otherscapeCharacterTrope.category.trim() ? (
                        <span className="character-trope-header__category">
                            {otherscapeCharacterTrope.category}
                        </span>
                    ) : null}
                </div>
            </ClickableSection>

            <ClickableSection
                onClick={openBasic}
                ariaLabel="Edit the character trope name"
            >
                <div className="character-trope-title os-bar">
                    <span className="character-trope-title__text os-display">
                        {otherscapeCharacterTrope.name ||
                            'Untitled Character Trope'}
                    </span>
                </div>
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
