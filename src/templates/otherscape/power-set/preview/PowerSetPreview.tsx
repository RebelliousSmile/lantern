import { cn } from '@/utils/cn'
import { SectionGate } from '../../shared/preview/components/SectionGate'
import {
    shouldShow,
    useOtherscapePowerSetStore,
    useOtherscapePowerSetViewStore,
} from '../hooks'
import ConsequencesBlock from './blocks/ConsequencesBlock'
import HeaderBlock from './blocks/HeaderBlock'
import MetaFooterBlock from './blocks/MetaFooterBlock'
import SpecialsBlock from './blocks/SpecialsBlock'
import ThreatsBlock from './blocks/ThreatsBlock'
import './powerSetTheme.css'

export function PowerSetPreview() {
    const ui = useOtherscapePowerSetViewStore()
    // Read through the store so the card repaints on every edit, even where the
    // blocks below read the document themselves.
    const { otherscapePowerSet } = useOtherscapePowerSetStore()

    /* The type is what colours the sheet, so the modifier is driven by the
       document rather than by the view: a Mythos Power Set is purple wherever
       it is printed. */
    return (
        <div>
            <div
                className={cn(
                    'power-set-sheet os-card',
                    `os-card--${otherscapePowerSet.type}`,
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

                <div className="power-set-sheet__body">
                    {/* One column rather than the Challenge's two: a Power Set
                        holds nothing the Crew acts on, only what the sheet
                        hands out, so there is no second side to face. */}
                    <SectionGate
                        show={shouldShow(otherscapePowerSet, 'specials', ui)}
                    >
                        <SpecialsBlock />
                    </SectionGate>

                    <SectionGate
                        show={shouldShow(otherscapePowerSet, 'threats', ui)}
                    >
                        <ThreatsBlock />
                    </SectionGate>

                    <SectionGate
                        show={shouldShow(
                            otherscapePowerSet,
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
            <SectionGate show={shouldShow(otherscapePowerSet, 'meta', ui)}>
                <MetaFooterBlock />
            </SectionGate>
        </div>
    )
}
