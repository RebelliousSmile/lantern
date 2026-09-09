import { SectionGate } from '../../shared/preview/components/SectionGate'
import { SectionHeader } from '../../shared/preview/components/SectionHeader'
import {
    shouldShow,
    useCityOfMistCustomMoveSheetStore,
    useCityOfMistCustomMoveStore,
    useCityOfMistCustomMoveViewStore,
} from '../hooks'
import MetaFooter from './blocks/MetaFooter'
import MoveHeader from './blocks/MoveHeader'
import OutcomesBlock from './blocks/OutcomesBlock'
import RollBlock from './blocks/RollBlock'
import TriggerBlock from './blocks/TriggerBlock'
import './customMoveTheme.css'

/* The two frame elements around the card take utility classes rather than
   names of their own: they hold the zoom and the width, not the document, and
   every rule in `customMoveTheme.css` is meant to live under `.city-doc`. */
export function CustomMovePreview() {
    const { cityOfMistCustomMove } = useCityOfMistCustomMoveStore()
    const { openSheet } = useCityOfMistCustomMoveSheetStore()
    const view = useCityOfMistCustomMoveViewStore()
    const { zoom, background, showSeparators } = view

    /* The roll section answers to the appearance panel like the others, but a
       move that never rolls prints no heading either: the header is gated on
       the roll itself, not only on the checkbox. */
    const showTrigger = shouldShow(cityOfMistCustomMove, 'trigger', view)
    const showRoll =
        shouldShow(cityOfMistCustomMove, 'roll', view) &&
        !!cityOfMistCustomMove.roll
    const showOutcomes = shouldShow(cityOfMistCustomMove, 'outcomes', view)
    const showMeta = shouldShow(cityOfMistCustomMove, 'meta', view)

    return (
        <div className="w-full">
            <div
                className="inline-flex w-full flex-col items-start"
                style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: 'top left',
                }}
            >
                <div className={`city-doc city-move-card ${background}`}>
                    <MoveHeader
                        onClick={() =>
                            openSheet({ kind: 'basic', mode: 'edit' })
                        }
                    />

                    <div className="city-move-flow">
                        <SectionGate show={showTrigger}>
                            <TriggerBlock
                                onClick={() =>
                                    openSheet({ kind: 'trigger', mode: 'edit' })
                                }
                            />
                        </SectionGate>

                        <SectionGate show={showSeparators && showRoll}>
                            <hr className="city-move-separator" />
                        </SectionGate>

                        <SectionGate show={showRoll}>
                            <SectionHeader
                                title="Roll"
                                onClick={() =>
                                    openSheet({ kind: 'roll', mode: 'edit' })
                                }
                            />
                            <RollBlock
                                onClick={() =>
                                    openSheet({ kind: 'roll', mode: 'edit' })
                                }
                            />
                        </SectionGate>

                        <SectionGate show={showSeparators && showOutcomes}>
                            <hr className="city-move-separator" />
                        </SectionGate>

                        <SectionGate show={showOutcomes}>
                            <SectionHeader
                                title="Outcomes"
                                onClick={() =>
                                    openSheet({
                                        kind: 'outcomes',
                                        mode: 'edit',
                                    })
                                }
                            />
                            <OutcomesBlock
                                onAddClick={() =>
                                    openSheet({
                                        kind: 'outcomes',
                                        mode: 'create',
                                    })
                                }
                                onItemClick={(index) =>
                                    openSheet({
                                        kind: 'outcomes',
                                        mode: 'edit',
                                        index,
                                    })
                                }
                            />
                        </SectionGate>

                        <SectionGate show={showMeta}>
                            <MetaFooter
                                onClick={() =>
                                    openSheet({ kind: 'meta', mode: 'edit' })
                                }
                            />
                        </SectionGate>
                    </div>
                </div>
            </div>
        </div>
    )
}
