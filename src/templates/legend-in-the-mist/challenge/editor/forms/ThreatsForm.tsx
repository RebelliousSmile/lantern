import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useEffect, useMemo, useState } from 'react'
import { useLegendInTheMistChallengeStore } from '../../hooks'
import { ConsequencesPanel } from './ConsequencesPanel'
import { ThreatListPanel } from './ThreatListPanel'

type Panel =
    | { kind: 'threats' }
    | { kind: 'cons'; tIdx: number }
    | { kind: 'general' }

const DEFAULT_THREAT_DESCRIPTION = 'Describe how this threat escalates.'
const DEFAULT_CONSEQUENCE = 'Describe a consequence.'

export default function ThreatsForm({ focusIndex }: { focusIndex?: number }) {
    const {
        legendInTheMistChallenge,
        addThreat,
        updateThreatAt,
        removeThreatAt,
        moveThreat,
        addConsequence,
        updateConsequence,
        removeConsequence,
        moveConsequence,
        addGeneralConsequence,
        updateGeneralConsequence,
        removeGeneralConsequence,
        moveGeneralConsequence,
    } = useLegendInTheMistChallengeStore()
    const [panel, setPanel] = useState<Panel>({ kind: 'threats' })
    const [editingThreat, setEditingThreat] = useState<number | null>(null)
    const [editingCons, setEditingCons] = useState<number | null>(null)
    const [editingGeneralCons, setEditingGeneralCons] = useState<number | null>(
        null
    )
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )
    const currentThreatIndex = panel.kind === 'cons' ? panel.tIdx : null
    const threatIds = useMemo(
        () =>
            legendInTheMistChallenge.threats.map(
                (threat, index) => `t:${index}:${threat.name || 'threat'}`
            ),
        [legendInTheMistChallenge.threats]
    )
    const consIds = useMemo(() => {
        const threat =
            currentThreatIndex == null
                ? null
                : legendInTheMistChallenge.threats[currentThreatIndex]
        return threat?.consequences.map((_, index) => `c:${index}`) ?? []
    }, [currentThreatIndex, legendInTheMistChallenge.threats])
    const generalIds = useMemo(
        () =>
            legendInTheMistChallenge.general_consequences.map(
                (_, index) => `gc:${index}`
            ),
        [legendInTheMistChallenge.general_consequences]
    )
    const dragDisabled =
        editingThreat !== null ||
        editingCons !== null ||
        editingGeneralCons !== null

    function startEditThreat(index: number) {
        if (legendInTheMistChallenge.threats[index]) setEditingThreat(index)
    }

    useEffect(() => {
        if (
            typeof focusIndex === 'number' &&
            legendInTheMistChallenge.threats[focusIndex]
        ) {
            startEditThreat(focusIndex)
            setPanel({ kind: 'threats' })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focusIndex])

    function uniqueThreatName() {
        const used = new Set(
            legendInTheMistChallenge.threats.map((threat) =>
                threat.name.toLowerCase()
            )
        )
        if (!used.has('new threat')) return 'New Threat'
        let suffix = 2
        while (used.has(`new threat ${suffix}`)) suffix++
        return `New Threat ${suffix}`
    }

    function onDragEnd({ active, over }: DragEndEvent) {
        if (!over || active.id === over.id) return
        const from = Number(String(active.id).split(':')[1] || -1)
        const to = Number(String(over.id).split(':')[1] || -1)
        if (from < 0 || to < 0 || from === to) return
        if (
            panel.kind === 'threats' &&
            String(active.id).startsWith('t:') &&
            String(over.id).startsWith('t:')
        )
            moveThreat(from, to)
        if (
            panel.kind === 'cons' &&
            currentThreatIndex !== null &&
            String(active.id).startsWith('c:') &&
            String(over.id).startsWith('c:')
        )
            moveConsequence(currentThreatIndex, from, to)
        if (
            panel.kind === 'general' &&
            String(active.id).startsWith('gc:') &&
            String(over.id).startsWith('gc:')
        )
            moveGeneralConsequence(from, to)
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
        >
            <div className="relative overflow-hidden">
                <div
                    className={`grid w-[200%] grid-cols-2 transition-transform duration-300 ease-out ${panel.kind === 'threats' ? 'translate-x-0' : '-translate-x-1/2'}`}
                >
                    <ThreatListPanel
                        threats={legendInTheMistChallenge.threats}
                        threatIds={threatIds}
                        editingThreat={editingThreat}
                        dragDisabled={dragDisabled}
                        onAdd={() => {
                            const name = uniqueThreatName()
                            addThreat({
                                name,
                                description: DEFAULT_THREAT_DESCRIPTION,
                                consequences: [DEFAULT_CONSEQUENCE],
                            })
                            setEditingThreat(
                                legendInTheMistChallenge.threats.length
                            )
                        }}
                        onSave={(index, threat) => {
                            updateThreatAt(index, threat)
                            setEditingThreat(null)
                        }}
                        onCancel={() => setEditingThreat(null)}
                        onEdit={startEditThreat}
                        onRemove={(index) => {
                            if (panel.kind === 'cons' && panel.tIdx === index)
                                setPanel({ kind: 'threats' })
                            removeThreatAt(index)
                        }}
                        onOpenConsequences={(index) => {
                            setEditingCons(null)
                            setPanel({ kind: 'cons', tIdx: index })
                        }}
                        onOpenGeneral={() => {
                            setEditingGeneralCons(null)
                            setPanel({ kind: 'general' })
                        }}
                    />
                    <ConsequencesPanel
                        panel={panel}
                        threat={
                            currentThreatIndex === null
                                ? null
                                : legendInTheMistChallenge.threats[
                                      currentThreatIndex
                                  ]
                        }
                        consequenceIds={consIds}
                        generalConsequences={
                            legendInTheMistChallenge.general_consequences
                        }
                        generalIds={generalIds}
                        editingConsequence={editingCons}
                        editingGeneralConsequence={editingGeneralCons}
                        dragDisabled={dragDisabled}
                        onBack={() => setPanel({ kind: 'threats' })}
                        onAddConsequence={() => {
                            if (currentThreatIndex === null) return
                            addConsequence(
                                currentThreatIndex,
                                DEFAULT_CONSEQUENCE
                            )
                            setEditingCons(
                                legendInTheMistChallenge.threats[
                                    currentThreatIndex
                                ].consequences.length
                            )
                        }}
                        onSaveConsequence={(index, value) => {
                            if (currentThreatIndex !== null)
                                updateConsequence(
                                    currentThreatIndex,
                                    index,
                                    value
                                )
                            setEditingCons(null)
                        }}
                        onEditConsequence={setEditingCons}
                        onRemoveConsequence={(index) => {
                            if (currentThreatIndex !== null)
                                removeConsequence(currentThreatIndex, index)
                        }}
                        onAddGeneral={() => {
                            addGeneralConsequence('New consequence')
                            setEditingGeneralCons(
                                legendInTheMistChallenge.general_consequences
                                    .length
                            )
                        }}
                        onSaveGeneral={(index, value) => {
                            updateGeneralConsequence(index, value)
                            setEditingGeneralCons(null)
                        }}
                        onEditGeneral={setEditingGeneralCons}
                        onRemoveGeneral={removeGeneralConsequence}
                    />
                </div>
            </div>
        </DndContext>
    )
}
