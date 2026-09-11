import { SectionGate } from '../../shared/preview/components/SectionGate'
import { SectionHeader } from '../../shared/preview/components/SectionHeader'
import {
    shouldShow,
    useGameDefinitionSheetStore,
    useGameDefinitionStore,
    useGameDefinitionViewStore,
} from '../hooks'
import CharacterBlock from './blocks/CharacterBlock'
import DefHeader from './blocks/DefHeader'
import FrontsBlock from './blocks/FrontsBlock'
import McBlock from './blocks/McBlock'
import NpcBlock from './blocks/NpcBlock'
import RollBlock from './blocks/RollBlock'
import './gameDefinitionTheme.css'

export function GameDefinitionPreview() {
    const { gameDefinition } = useGameDefinitionStore()
    const { openSheet } = useGameDefinitionSheetStore()
    const view = useGameDefinitionViewStore()
    const { zoom, showSeparators } = view

    const showRoll = shouldShow(gameDefinition, 'roll', view)
    const showCharacter = shouldShow(gameDefinition, 'character', view)
    const showNpc = shouldShow(gameDefinition, 'npc', view)
    const showMc = shouldShow(gameDefinition, 'mc', view)
    const showFronts = shouldShow(gameDefinition, 'fronts', view)

    return (
        <div className="w-full">
            <div
                className="inline-flex w-full flex-col items-start"
                style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: 'top left',
                }}
            >
                <div className="pbta-card pbta-game-definition-sheet">
                    <DefHeader
                        onClick={() =>
                            openSheet({ kind: 'basic', mode: 'edit' })
                        }
                    />
                    <div className="pbta-def-flow">
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
                        <SectionGate
                            show={showSeparators && showRoll && showCharacter}
                        >
                            <hr className="pbta-def-separator" />
                        </SectionGate>

                        <SectionGate show={showCharacter}>
                            <SectionHeader
                                title="Character"
                                onClick={() =>
                                    openSheet({
                                        kind: 'character',
                                        mode: 'edit',
                                    })
                                }
                            />
                            <CharacterBlock
                                onClick={() =>
                                    openSheet({
                                        kind: 'character',
                                        mode: 'edit',
                                    })
                                }
                            />
                        </SectionGate>
                        <SectionGate
                            show={showSeparators && showCharacter && showNpc}
                        >
                            <hr className="pbta-def-separator" />
                        </SectionGate>

                        <SectionGate show={showNpc}>
                            <SectionHeader
                                title="NPC"
                                onClick={() =>
                                    openSheet({ kind: 'npc', mode: 'edit' })
                                }
                            />
                            <NpcBlock
                                onClick={() =>
                                    openSheet({ kind: 'npc', mode: 'edit' })
                                }
                            />
                        </SectionGate>
                        <SectionGate show={showSeparators && showNpc && showMc}>
                            <hr className="pbta-def-separator" />
                        </SectionGate>

                        <SectionGate show={showMc}>
                            <SectionHeader
                                title="MC"
                                onClick={() =>
                                    openSheet({ kind: 'mc', mode: 'edit' })
                                }
                            />
                            <McBlock
                                onClick={() =>
                                    openSheet({ kind: 'mc', mode: 'edit' })
                                }
                            />
                        </SectionGate>
                        <SectionGate
                            show={showSeparators && showMc && showFronts}
                        >
                            <hr className="pbta-def-separator" />
                        </SectionGate>

                        <SectionGate show={showFronts}>
                            <SectionHeader
                                title="Fronts"
                                onClick={() =>
                                    openSheet({ kind: 'fronts', mode: 'edit' })
                                }
                            />
                            <FrontsBlock
                                onClick={() =>
                                    openSheet({ kind: 'fronts', mode: 'edit' })
                                }
                            />
                        </SectionGate>
                    </div>
                </div>
            </div>
        </div>
    )
}
