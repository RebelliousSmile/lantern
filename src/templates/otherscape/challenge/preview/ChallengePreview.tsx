import { cn } from '@/utils/cn'
import { SectionGate } from '../../shared/preview/components/SectionGate'
import {
    shouldShow,
    useOtherscapeChallengeStore,
    useOtherscapeChallengeViewStore,
} from '../hooks'
import ConsequencesBlock from './blocks/ConsequencesBlock'
import HeaderBlock from './blocks/HeaderBlock'
import LimitsBlock from './blocks/LimitsBlock'
import MetaFooterBlock from './blocks/MetaFooterBlock'
import SpecialsBlock from './blocks/SpecialsBlock'
import TagsBlock from './blocks/TagsBlock'
import ThreatsBlock from './blocks/ThreatsBlock'
import './challengeTheme.css'

export function ChallengePreview() {
    const ui = useOtherscapeChallengeViewStore()
    // Read through the store so the card repaints on every edit, even where the
    // blocks below read the document themselves.
    const { otherscapeChallenge } = useOtherscapeChallengeStore()

    /* No theme-type modifier: a Challenge belongs to no theme type, so the card
       takes the accent its own stylesheet sets rather than one of the four. */
    return (
        <div>
            <div
                className={cn(
                    'challenge-sheet os-card',
                    ui.background === 'plain' ? 'bg-plain' : 'bg-neon'
                )}
                style={{
                    transform: `scale(${ui.zoom})`,
                    transformOrigin: 'top center',
                }}
            >
                {/* The band and the name run the full width of the card: they
                    are its top edge rather than a region of its body. */}
                <HeaderBlock />

                <div className="challenge-sheet__body">
                    <SectionGate
                        show={shouldShow(
                            otherscapeChallenge,
                            'tagsStatuses',
                            ui
                        )}
                    >
                        <TagsBlock />
                    </SectionGate>

                    {/* Two columns: what the Crew can do to the Challenge on
                        the left, what the Challenge does to the Crew on the
                        right. */}
                    <div className="challenge-sheet__columns">
                        <div className="challenge-sheet__column">
                            <SectionGate
                                show={shouldShow(
                                    otherscapeChallenge,
                                    'limits',
                                    ui
                                )}
                            >
                                <LimitsBlock />
                            </SectionGate>

                            <SectionGate
                                show={shouldShow(
                                    otherscapeChallenge,
                                    'specials',
                                    ui
                                )}
                            >
                                <SpecialsBlock />
                            </SectionGate>
                        </div>

                        <div className="challenge-sheet__column">
                            <SectionGate
                                show={shouldShow(
                                    otherscapeChallenge,
                                    'threats',
                                    ui
                                )}
                            >
                                <ThreatsBlock />
                            </SectionGate>

                            <SectionGate
                                show={shouldShow(
                                    otherscapeChallenge,
                                    'generalConsequences',
                                    ui
                                )}
                            >
                                <ConsequencesBlock />
                            </SectionGate>
                        </div>
                    </div>
                </div>
            </div>

            {/* Meta footer sits under the card, on the page rather than on the
                card frame, so the exported image stays the printed object. */}
            <SectionGate show={shouldShow(otherscapeChallenge, 'meta', ui)}>
                <MetaFooterBlock />
            </SectionGate>
        </div>
    )
}
