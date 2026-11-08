import { cn } from '@/utils/cn'
import { SectionGate } from '../../shared/preview/components/SectionGate'
import { otherscapeVariantClass } from '../../shared/variants'
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

/* The card of the core book's Challenges (pp. 302-303): one column, in the
   book's order - the name and the prose, the Limits, the tags and statuses,
   the Specials, then the Threats with their Consequences. */
export function ChallengePreview() {
    const ui = useOtherscapeChallengeViewStore()
    // Read through the store so the card repaints on every edit, even where the
    // blocks below read the document themselves.
    const { otherscapeChallenge } = useOtherscapeChallengeStore()

    /* No theme-type modifier: a Challenge belongs to no theme type, so the card
       takes the accent its own stylesheet sets for the chosen variant. */
    return (
        <div>
            <div
                className={cn(
                    'challenge-sheet os-card',
                    ui.background === 'plain' ? 'bg-plain' : 'bg-neon',
                    otherscapeVariantClass(ui.variant)
                )}
                style={{
                    transform: `scale(${ui.zoom})`,
                    transformOrigin: 'top center',
                }}
            >
                <HeaderBlock />

                <div className="challenge-sheet__body">
                    <SectionGate
                        show={shouldShow(otherscapeChallenge, 'limits', ui)}
                    >
                        <LimitsBlock />
                    </SectionGate>

                    <SectionGate
                        show={shouldShow(
                            otherscapeChallenge,
                            'tagsStatuses',
                            ui
                        )}
                    >
                        <TagsBlock />
                    </SectionGate>

                    <SectionGate
                        show={shouldShow(otherscapeChallenge, 'specials', ui)}
                    >
                        <SpecialsBlock />
                    </SectionGate>

                    <SectionGate
                        show={shouldShow(otherscapeChallenge, 'threats', ui)}
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

            {/* Meta footer sits under the card, on the page rather than on the
                card frame, so the exported image stays the printed object. */}
            <SectionGate show={shouldShow(otherscapeChallenge, 'meta', ui)}>
                <MetaFooterBlock />
            </SectionGate>
        </div>
    )
}
