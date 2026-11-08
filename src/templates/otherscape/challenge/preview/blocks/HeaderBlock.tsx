import { renderLitmMarkdown } from '@/utils/markdown'
import { ClickableSection } from '../../../shared/preview/components/Clickable'
import { RatingMarks } from '../../../shared/preview/components/RatingMarks'
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

    /* The tab and the name are the card's top edge rather than sections, so
       neither is gated: a Challenge with nothing filled in still prints a
       frame. The description below is a region of its own and is. */
    return (
        <div className="challenge-sheet__head">
            <ClickableSection
                onClick={openBasic}
                ariaLabel="Edit the challenge name and rating"
            >
                {/* The book prints the Challenge's stars in this tab (Core
                    Book pp. 302-303) and nothing else: the scale belongs to
                    the prose below. Unrated, the tab stays bare. */}
                <div className="challenge-tab">
                    {otherscapeChallenge.rating !== null && (
                        <span
                            className="challenge-tab__rating"
                            role="img"
                            aria-label={`Rating ${otherscapeChallenge.rating}`}
                        >
                            <RatingMarks
                                count={otherscapeChallenge.rating}
                                className="challenge-tab__mark"
                            />
                        </span>
                    )}
                </div>

                <div className="challenge-title os-display">
                    {otherscapeChallenge.name || 'Untitled Challenge'}
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
                        {/* The book names the scale in the prose (`with Scale
                            1`), never on the tab, so it opens the text. */}
                        {otherscapeChallenge.scale !== null && (
                            <p className="challenge-description__scale">
                                Scale {otherscapeChallenge.scale}
                            </p>
                        )}
                        {otherscapeChallenge.description.trim() ? (
                            <div
                                className="challenge-description__text"
                                dangerouslySetInnerHTML={{
                                    __html: renderLitmMarkdown(
                                        otherscapeChallenge.description
                                    ),
                                }}
                            />
                        ) : otherscapeChallenge.scale !== null ? null : (
                            <span className="os-placeholder">
                                add a short description
                            </span>
                        )}
                    </div>
                </ClickableSection>
            </SectionGate>
        </div>
    )
}
