import { renderLitmMarkdown } from '@/utils/markdown'
import { ClickableSection } from '../../../shared/preview/components/Clickable'
import { SectionGate } from '../../../shared/preview/components/SectionGate'
import {
    shouldShow,
    useOtherscapeChallengeSheetStore,
    useOtherscapeChallengeStore,
    useOtherscapeChallengeViewStore,
} from '../../hooks'

export default function HeaderBlock() {
    const { otherscapeChallenge } = useOtherscapeChallengeStore()
    const { openSheet } = useOtherscapeChallengeSheetStore()
    const view = useOtherscapeChallengeViewStore()

    const openBasic = () => openSheet({ kind: 'basic', mode: 'edit' })

    /* The band and the name are the card's top edge rather than sections, so
       neither is gated: a Challenge with nothing filled in still prints a
       frame. The description below is a region of its own and is. */
    return (
        <>
            <ClickableSection
                onClick={openBasic}
                ariaLabel="Edit the challenge name and scale"
            >
                <div className="challenge-header os-bar">
                    <span className="challenge-header__kind os-label">
                        Challenge
                    </span>
                    {/* Absent scale prints nothing: person-sized is the
                        Challenge that says nothing about its size. */}
                    {otherscapeChallenge.scale !== null && (
                        <span className="challenge-header__scale">
                            Scale {otherscapeChallenge.scale}
                        </span>
                    )}
                </div>
            </ClickableSection>

            <ClickableSection
                onClick={openBasic}
                ariaLabel="Edit the challenge name"
            >
                <div className="challenge-title os-bar">
                    <span className="challenge-title__text os-display">
                        {otherscapeChallenge.name || 'Untitled Challenge'}
                    </span>
                </div>
            </ClickableSection>

            <SectionGate
                show={shouldShow(otherscapeChallenge, 'description', view)}
            >
                <ClickableSection
                    onClick={openBasic}
                    ariaLabel="Edit the description"
                >
                    <div className="challenge-description">
                        {otherscapeChallenge.description.trim() ? (
                            <div
                                className="challenge-description__text"
                                dangerouslySetInnerHTML={{
                                    __html: renderLitmMarkdown(
                                        otherscapeChallenge.description
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
