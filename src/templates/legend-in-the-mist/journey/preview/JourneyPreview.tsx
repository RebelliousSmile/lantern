import { cn } from '@/utils/cn'
import {
    useLegendInTheMistJourneyStore,
    useLegendInTheMistJourneyViewStore,
} from '../hooks'
import BenefitsBlock from './blocks/BenefitsBlock'
import ConsequencesBlock from './blocks/ConsequencesBlock'
import DescriptionBlock from './blocks/DescriptionBlock'
import HeaderBlock from './blocks/HeaderBlock'
import MetaFooterBlock from './blocks/MetaFooterBlock'
import TagsBlock from './blocks/TagsBlock'
import VignettesBlock from './blocks/VignettesBlock'
import { SectionGate, SectionGroupGate } from './components/SectionGate'
import './journeyTheme.css'

export function JourneyPreview() {
    const ui = useLegendInTheMistJourneyViewStore()
    // Read through the store so the spread re-renders on every edit, even where
    // the blocks below read the document themselves.
    const { legendInTheMistJourney } = useLegendInTheMistJourneyStore()

    return (
        <div>
            <div
                className={cn(
                    'journey-sheet',
                    // The type tint is a modifier on the root rather than an
                    // inline style, so the three kinds stay in the stylesheet
                    // and the exported image carries the same rule the screen
                    // does.
                    `journey-sheet--${legendInTheMistJourney.type}`,
                    ui.background === 'parchment' ? 'bg-parchment' : 'bg-plain'
                )}
                style={{
                    transform: `scale(${ui.zoom})`,
                    transformOrigin: 'top center',
                }}
            >
                {/* The band always renders: it carries the tint that tells a
                    landscape from an occasion, so it is the one region with no
                    visibility toggle. */}
                <div className="journey-band">
                    <HeaderBlock />
                    <SectionGate id="description">
                        <DescriptionBlock />
                    </SectionGate>
                </div>

                <div className="journey-rule" />
                <div className="journey-rule__tear" aria-hidden />

                <div className="journey-body">
                    <SectionGroupGate ids={['tags', 'benefits', 'consequences']}>
                        <div className="journey-col journey-col--left">
                            <SectionGate id="tags">
                                <TagsBlock />
                            </SectionGate>
                            <SectionGate id="benefits">
                                <BenefitsBlock />
                            </SectionGate>
                            <SectionGate id="consequences">
                                <ConsequencesBlock />
                            </SectionGate>
                        </div>
                    </SectionGroupGate>

                    <SectionGate id="vignettes">
                        <div className="journey-col journey-col--right">
                            <VignettesBlock />
                        </div>
                    </SectionGate>
                </div>
            </div>

            {/* Meta footer sits under the spread, on the page rather than on the
                sheet frame, so the exported image stays the printed object. */}
            <SectionGate id="meta">
                <MetaFooterBlock />
            </SectionGate>
        </div>
    )
}
