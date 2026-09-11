import { SectionGate } from '../../shared/preview/components/SectionGate'
import { SectionHeader } from '../../shared/preview/components/SectionHeader'
import {
    shouldShow,
    usePlaybookSheetStore,
    usePlaybookStore,
    usePlaybookViewStore,
} from '../hooks'
import AdvancementBlock from './blocks/AdvancementBlock'
import ChoiceSetsBlock from './blocks/ChoiceSetsBlock'
import CreationBlock from './blocks/CreationBlock'
import GearBlock from './blocks/GearBlock'
import MovesBlock from './blocks/MovesBlock'
import PbHeader from './blocks/PbHeader'
import StatsBlock from './blocks/StatsBlock'
import './playbookTheme.css'

export function PlaybookPreview() {
    const { playbook } = usePlaybookStore()
    const { openSheet } = usePlaybookSheetStore()
    const view = usePlaybookViewStore()
    const { zoom, showSeparators } = view

    const showStats = shouldShow(playbook, 'stats', view)
    const showMoves = shouldShow(playbook, 'moves', view)
    const showChoiceSets = shouldShow(playbook, 'choiceSets', view)
    const showAdvancement = shouldShow(playbook, 'advancement', view)
    const showCreation = shouldShow(playbook, 'creation', view)
    const showGear = shouldShow(playbook, 'gear', view)

    return (
        <div className="w-full">
            <div
                className="inline-flex w-full flex-col items-start"
                style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: 'top left',
                }}
            >
                <div className="pbta-card pbta-playbook-sheet">
                    <PbHeader
                        onClick={() =>
                            openSheet({ kind: 'basic', mode: 'edit' })
                        }
                    />
                    <div className="pbta-pb-flow">
                        <SectionGate show={showStats}>
                            <SectionHeader
                                title="Stats"
                                onClick={() =>
                                    openSheet({ kind: 'stats', mode: 'edit' })
                                }
                            />
                            <StatsBlock
                                onClick={() =>
                                    openSheet({ kind: 'stats', mode: 'edit' })
                                }
                            />
                        </SectionGate>
                        <SectionGate
                            show={showSeparators && showStats && showMoves}
                        >
                            <hr className="pbta-pb-separator" />
                        </SectionGate>

                        <SectionGate show={showMoves}>
                            <SectionHeader
                                title="Moves"
                                onClick={() =>
                                    openSheet({ kind: 'moves', mode: 'edit' })
                                }
                            />
                            <MovesBlock
                                onClick={() =>
                                    openSheet({ kind: 'moves', mode: 'edit' })
                                }
                            />
                        </SectionGate>
                        <SectionGate
                            show={showSeparators && showMoves && showChoiceSets}
                        >
                            <hr className="pbta-pb-separator" />
                        </SectionGate>

                        <SectionGate show={showChoiceSets}>
                            <SectionHeader
                                title="Choice Sets"
                                onClick={() =>
                                    openSheet({
                                        kind: 'choiceSets',
                                        mode: 'edit',
                                    })
                                }
                            />
                            <ChoiceSetsBlock
                                onClick={() =>
                                    openSheet({
                                        kind: 'choiceSets',
                                        mode: 'edit',
                                    })
                                }
                            />
                        </SectionGate>
                        <SectionGate
                            show={
                                showSeparators &&
                                showChoiceSets &&
                                showAdvancement
                            }
                        >
                            <hr className="pbta-pb-separator" />
                        </SectionGate>

                        <SectionGate show={showAdvancement}>
                            <SectionHeader
                                title="Advancement"
                                onClick={() =>
                                    openSheet({
                                        kind: 'advancement',
                                        mode: 'edit',
                                    })
                                }
                            />
                            <AdvancementBlock
                                onClick={() =>
                                    openSheet({
                                        kind: 'advancement',
                                        mode: 'edit',
                                    })
                                }
                            />
                        </SectionGate>
                        <SectionGate
                            show={
                                showSeparators &&
                                showAdvancement &&
                                showCreation
                            }
                        >
                            <hr className="pbta-pb-separator" />
                        </SectionGate>

                        <SectionGate show={showCreation}>
                            <SectionHeader
                                title="Creation"
                                onClick={() =>
                                    openSheet({
                                        kind: 'creation',
                                        mode: 'edit',
                                    })
                                }
                            />
                            <CreationBlock
                                onClick={() =>
                                    openSheet({
                                        kind: 'creation',
                                        mode: 'edit',
                                    })
                                }
                            />
                        </SectionGate>
                        <SectionGate
                            show={showSeparators && showCreation && showGear}
                        >
                            <hr className="pbta-pb-separator" />
                        </SectionGate>

                        <SectionGate show={showGear}>
                            <SectionHeader
                                title="Gear"
                                onClick={() =>
                                    openSheet({ kind: 'gear', mode: 'edit' })
                                }
                            />
                            <GearBlock
                                onClick={() =>
                                    openSheet({ kind: 'gear', mode: 'edit' })
                                }
                            />
                        </SectionGate>
                    </div>
                </div>
            </div>
        </div>
    )
}
