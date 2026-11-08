import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUiText, type TranslationKey } from '@/i18n/text'
import { cn } from '@/utils/cn'
import { useState } from 'react'
import {
    useCityOfMistCustomMoveStore,
    type MoveTemplate,
    type Outcome,
} from '../../hooks'

type Blank = {
    key: string
    label: TranslationKey
    placeholder: TranslationKey
}

type Gabarit = {
    value: Exclude<MoveTemplate, 'freeform'>
    label: TranslationKey
    summary: TranslationKey
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
        label: 'city:forms.customMove.templateGuide.activeShield.name',
        summary: 'city:forms.customMove.templateGuide.activeShield.summary',
        blanks: [
            {
                key: 'status',
                label: 'city:forms.customMove.templateGuide.activeShield.statusLabel',
                placeholder:
                    'city:forms.customMove.templateGuide.activeShield.statusPlaceholder',
            },
            {
                key: 'threat',
                label: 'city:forms.customMove.templateGuide.activeShield.threatLabel',
                placeholder:
                    'city:forms.customMove.templateGuide.activeShield.threatPlaceholder',
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
        label: 'city:forms.customMove.templateGuide.countdownOutcome.name',
        summary: 'city:forms.customMove.templateGuide.countdownOutcome.summary',
        blanks: [
            {
                key: 'event',
                label: 'city:forms.customMove.templateGuide.countdownOutcome.eventLabel',
                placeholder:
                    'city:forms.customMove.templateGuide.countdownOutcome.eventPlaceholder',
            },
            {
                key: 'status',
                label: 'city:forms.customMove.templateGuide.countdownOutcome.statusLabel',
                placeholder:
                    'city:forms.customMove.templateGuide.countdownOutcome.statusPlaceholder',
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
        label: 'city:forms.customMove.templateGuide.startingStatus.name',
        summary: 'city:forms.customMove.templateGuide.startingStatus.summary',
        blanks: [
            {
                key: 'situation',
                label: 'city:forms.customMove.templateGuide.startingStatus.situationLabel',
                placeholder:
                    'city:forms.customMove.templateGuide.startingStatus.situationPlaceholder',
            },
            {
                key: 'status',
                label: 'city:forms.customMove.templateGuide.startingStatus.statusLabel',
                placeholder:
                    'city:forms.customMove.templateGuide.startingStatus.statusPlaceholder',
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
        label: 'city:forms.customMove.templateGuide.statusFilter.name',
        summary: 'city:forms.customMove.templateGuide.statusFilter.summary',
        blanks: [
            {
                key: 'status',
                label: 'city:forms.customMove.templateGuide.statusFilter.statusLabel',
                placeholder:
                    'city:forms.customMove.templateGuide.statusFilter.statusPlaceholder',
            },
            {
                key: 'effect',
                label: 'city:forms.customMove.templateGuide.statusFilter.effectLabel',
                placeholder:
                    'city:forms.customMove.templateGuide.statusFilter.effectPlaceholder',
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
        label: 'city:forms.customMove.templateGuide.statusPayload.name',
        summary: 'city:forms.customMove.templateGuide.statusPayload.summary',
        blanks: [
            {
                key: 'status',
                label: 'city:forms.customMove.templateGuide.statusPayload.statusLabel',
                placeholder:
                    'city:forms.customMove.templateGuide.statusPayload.statusPlaceholder',
            },
            {
                key: 'payload',
                label: 'city:forms.customMove.templateGuide.statusPayload.payloadLabel',
                placeholder:
                    'city:forms.customMove.templateGuide.statusPayload.payloadPlaceholder',
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
    const text = useUiText()
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
                <Label>
                    {text('city:forms.customMove.templateGuide.label')}
                </Label>
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
                            {text(entry.label)}
                        </Button>
                    ))}
                </div>
                <p className="text-xs text-muted-foreground">
                    {text(gabarit.summary)}
                </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                {gabarit.blanks.map((blank) => (
                    <div key={blank.key} className="grid gap-1">
                        <Label htmlFor={`move-blank-${blank.key}`}>
                            {text(blank.label)}
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
                            placeholder={text(blank.placeholder)}
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
                    {text('city:forms.customMove.templateGuide.generate')}
                </Button>
                <p className="text-xs text-muted-foreground">
                    {text('city:forms.customMove.templateGuide.overwriteHelp')}
                </p>
            </div>
        </div>
    )
}
