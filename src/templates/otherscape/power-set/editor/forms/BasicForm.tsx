import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SegmentedRadioGroup } from '@/components/ui/segmented-radio-group'
import { Textarea } from '@/components/ui/textarea'
import { useUiText } from '@/i18n/text'
import { useOtherscapePowerSetStore } from '../../hooks'
import { powerSetTypeOptions } from '../../metadata'

export default function BasicForm() {
    const text = useUiText()
    const { otherscapePowerSet, setOtherscapePowerSet } =
        useOtherscapePowerSetStore()

    /* The stored value and the printed card label stay English (see
       metadata.ts); only the label shown in this form is translated. */
    const typeLabels: Record<
        (typeof powerSetTypeOptions)[number]['value'],
        string
    > = {
        self: text('otherscape:forms.powerSet.basic.typeOptions.self'),
        mythos: text('otherscape:forms.powerSet.basic.typeOptions.mythos'),
        noise: text('otherscape:forms.powerSet.basic.typeOptions.noise'),
    }
    const typeOptions = powerSetTypeOptions.map((option) => ({
        value: option.value,
        label: typeLabels[option.value],
    }))
    /* An empty value stands for "no stars printed"; the others count them. */
    const ratingOptions = (max: number) => [
        {
            value: '',
            label: text('otherscape:forms.powerSet.basic.ratingNone'),
        },
        ...Array.from({ length: max }, (_, index) => ({
            value: String(index + 1),
            label: '⊕'.repeat(index + 1),
        })),
    ]

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label htmlFor="os-power-set-name">
                    {text('otherscape:forms.powerSet.basic.nameLabel')}
                </Label>
                <Input
                    id="os-power-set-name"
                    className="h-8 px-2 text-sm"
                    placeholder={text(
                        'otherscape:forms.powerSet.basic.namePlaceholder'
                    )}
                    value={otherscapePowerSet.name}
                    onChange={(event) =>
                        setOtherscapePowerSet({
                            name: event.target.value || 'Untitled Power Set',
                        })
                    }
                />
            </div>

            <div className="space-y-2">
                <Label>
                    {text('otherscape:forms.powerSet.basic.typeLabel')}
                </Label>
                <SegmentedRadioGroup
                    id="os-power-set-type"
                    value={otherscapePowerSet.type}
                    onValueChange={(type) =>
                        setOtherscapePowerSet({
                            type: type as (typeof powerSetTypeOptions)[number]['value'],
                        })
                    }
                    options={typeOptions}
                    ariaLabel={text(
                        'otherscape:forms.powerSet.basic.typeLabel'
                    )}
                    className="sm:inline-grid"
                />
                <p className="text-xs text-muted-foreground">
                    {text('otherscape:forms.powerSet.basic.typeHint')}
                </p>
            </div>

            <div className="space-y-2">
                <Label>
                    {text('otherscape:forms.powerSet.basic.ratingLabel')}
                </Label>
                <SegmentedRadioGroup
                    id="os-power-set-rating"
                    value={String(otherscapePowerSet.rating ?? '')}
                    onValueChange={(value) =>
                        setOtherscapePowerSet(
                            value
                                ? { rating: Number(value) }
                                : // Optional stars mean nothing without a
                                  // rating, so they go with it.
                                  { rating: null, optional_rating: null }
                        )
                    }
                    options={ratingOptions(5)}
                    ariaLabel={text(
                        'otherscape:forms.powerSet.basic.ratingLabel'
                    )}
                    className="sm:inline-grid"
                />
                {otherscapePowerSet.rating != null && (
                    <>
                        <Label>
                            {text(
                                'otherscape:forms.powerSet.basic.optionalRatingLabel'
                            )}
                        </Label>
                        <SegmentedRadioGroup
                            id="os-power-set-optional-rating"
                            value={String(
                                otherscapePowerSet.optional_rating ?? ''
                            )}
                            onValueChange={(value) =>
                                setOtherscapePowerSet({
                                    optional_rating: value
                                        ? Number(value)
                                        : null,
                                })
                            }
                            options={ratingOptions(4)}
                            ariaLabel={text(
                                'otherscape:forms.powerSet.basic.optionalRatingLabel'
                            )}
                            className="sm:inline-grid"
                        />
                    </>
                )}
                <p className="text-xs text-muted-foreground">
                    {text('otherscape:forms.powerSet.basic.ratingHint')}
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="os-power-set-description">
                    {text('fields.description')}
                </Label>
                <Textarea
                    id="os-power-set-description"
                    rows={4}
                    className="px-2 py-1 text-sm"
                    placeholder={text(
                        'otherscape:forms.powerSet.basic.descriptionPlaceholder'
                    )}
                    value={otherscapePowerSet.description}
                    onChange={(event) =>
                        setOtherscapePowerSet({
                            description: event.target.value,
                        })
                    }
                />
            </div>
        </div>
    )
}
