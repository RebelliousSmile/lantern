import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/utils/cn'
import { useState } from 'react'
import {
    useCityOfMistCustomMoveStore,
    type MoveTemplate,
    type Outcome,
} from '../../hooks'

type Blank = {
    key: string
    label: string
    placeholder: string
}

type Gabarit = {
    value: Exclude<MoveTemplate, 'freeform'>
    label: string
    summary: string
    blanks: [Blank, Blank]
    build: (values: Record<string, string>) => {
        trigger: string
        outcomes: Outcome[]
    }
}

/* The five families the MC Toolkit prints, each written here as the two blanks
   it actually asks the author to fill and a builder turning them into the prose
   the book would have printed. The result is ordinary text in the ordinary
   fields: nothing downstream reads `template` to decide how a move renders, so
   rewriting a generated line by hand is expected rather than a corruption. */
const GABARITS: Gabarit[] = [
    {
        value: 'active_shield',
        label: 'Active Shield',
        summary: 'A status that defends on its own against one kind of attack.',
        blanks: [
            {
                key: 'status',
                label: 'Shield status',
                placeholder: 'e.g., warded',
            },
            {
                key: 'threat',
                label: 'What it defends against',
                placeholder: 'e.g., a supernatural attack',
            },
        ],
        build: ({ status, threat }) => ({
            trigger: `When ${threat} would reach you while you carry {${status}},`,
            outcomes: [
                {
                    tier: 'hit',
                    text: `The {${status}} status absorbs the attack up to its tier, then burns down by as much as it absorbed.`,
                },
            ],
        }),
    },
    {
        value: 'countdown_outcome',
        label: 'Countdown Outcome',
        summary:
            'A recurring situation whose cost rises as a status climbs its tiers.',
        blanks: [
            {
                key: 'event',
                label: 'What the players do',
                placeholder: 'e.g., spend a day in the war-torn city',
            },
            {
                key: 'status',
                label: 'Status that counts up',
                placeholder: 'e.g., war-torn',
            },
        ],
        build: ({ event, status }) => ({
            trigger: `When you ${event},`,
            outcomes: [
                {
                    tier: '10+',
                    text: 'It costs you little. Choose one:',
                    options: ['First cost', 'Second cost'],
                    pick_count: 1,
                },
                {
                    tier: '7-9',
                    text: 'It takes its due. Choose two:',
                    options: ['First cost', 'Second cost'],
                    pick_count: 2,
                },
                {
                    tier: 'miss',
                    text: `The {${status}} status catches up with you. The MC chooses.`,
                },
            ],
        }),
    },
    {
        value: 'starting_status',
        label: 'Starting Status',
        summary:
            'A scene or a situation that hands out a status before anything is rolled.',
        blanks: [
            {
                key: 'situation',
                label: 'When it applies',
                placeholder: 'e.g., you enter the flooded district',
            },
            {
                key: 'status',
                label: 'Status handed out',
                placeholder: 'e.g., soaked-2',
            },
        ],
        build: ({ situation, status }) => ({
            trigger: `When ${situation},`,
            outcomes: [
                {
                    tier: 'hit',
                    text: `You take a {${status}} status for as long as the situation lasts.`,
                },
            ],
        }),
    },
    {
        value: 'status_filter',
        label: 'Status Filter',
        summary: 'A status that changes what another move is allowed to do.',
        blanks: [
            {
                key: 'status',
                label: 'Status doing the filtering',
                placeholder: 'e.g., unseen',
            },
            {
                key: 'effect',
                label: 'What it blocks or allows',
                placeholder: 'e.g., no one can target you directly',
            },
        ],
        build: ({ status, effect }) => ({
            trigger: `While you carry {${status}},`,
            outcomes: [
                {
                    tier: 'hit',
                    text: `${effect
                        .charAt(0)
                        .toUpperCase()}${effect.slice(1)}, until the status is burned or removed.`,
                },
            ],
        }),
    },
    {
        value: 'status_payload',
        label: 'Status Payload',
        summary:
            'A status that fires something off once it reaches a given tier.',
        blanks: [
            {
                key: 'status',
                label: 'Status carrying the payload',
                placeholder: 'e.g., overloaded',
            },
            {
                key: 'payload',
                label: 'What it does when it goes off',
                placeholder: 'e.g., it detonates and hits everyone nearby',
            },
        ],
        build: ({ status, payload }) => ({
            trigger: `When {${status}} reaches its highest tier,`,
            outcomes: [
                {
                    tier: 'hit',
                    text: `${payload
                        .charAt(0)
                        .toUpperCase()}${payload.slice(1)}. The status is spent and removed.`,
                },
            ],
        }),
    },
]

export default function TemplateGuideForm() {
    const { cityOfMistCustomMove, setCityOfMistCustomMove } =
        useCityOfMistCustomMoveStore()
    const [picked, setPicked] = useState<Exclude<MoveTemplate, 'freeform'>>(
        cityOfMistCustomMove.template === 'freeform'
            ? 'active_shield'
            : cityOfMistCustomMove.template
    )
    const [values, setValues] = useState<Record<string, string>>({})

    const gabarit = GABARITS.find((entry) => entry.value === picked)!
    const filled = gabarit.blanks.every((blank) =>
        (values[blank.key] ?? '').trim()
    )

    function generate() {
        const trimmed: Record<string, string> = {}
        for (const blank of gabarit.blanks) {
            trimmed[blank.key] = (values[blank.key] ?? '').trim()
        }

        const built = gabarit.build(trimmed)
        setCityOfMistCustomMove({
            template: gabarit.value,
            trigger: built.trigger,
            outcomes: built.outcomes,
        })
    }

    return (
        <div className="space-y-3 rounded-md border border-dashed px-3 py-3">
            <div className="space-y-1">
                <Label>Start from a Toolkit template</Label>
                <div className="grid grid-cols-2 overflow-hidden rounded-md border sm:grid-cols-5">
                    {GABARITS.map((entry) => (
                        <Button
                            key={entry.value}
                            type="button"
                            variant={
                                picked === entry.value ? 'default' : 'ghost'
                            }
                            className={cn(
                                'h-8 rounded-none border-none px-2 text-xs',
                                picked === entry.value ? '' : 'bg-background'
                            )}
                            onClick={() => {
                                setPicked(entry.value)
                                setValues({})
                            }}
                        >
                            {entry.label}
                        </Button>
                    ))}
                </div>
                <p className="text-xs text-muted-foreground">
                    {gabarit.summary}
                </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                {gabarit.blanks.map((blank) => (
                    <div key={blank.key} className="grid gap-1">
                        <Label htmlFor={`move-blank-${blank.key}`}>
                            {blank.label}
                        </Label>
                        <Input
                            id={`move-blank-${blank.key}`}
                            className="h-8 px-2 text-sm"
                            value={values[blank.key] ?? ''}
                            onChange={(event) =>
                                setValues((current) => ({
                                    ...current,
                                    [blank.key]: event.target.value,
                                }))
                            }
                            placeholder={blank.placeholder}
                        />
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-3">
                <Button
                    type="button"
                    size="sm"
                    className="h-8"
                    disabled={!filled}
                    onClick={generate}
                >
                    Generate trigger and outcomes
                </Button>
                <p className="text-xs text-muted-foreground">
                    Overwrites the trigger and the outcomes with editable text.
                </p>
            </div>
        </div>
    )
}
