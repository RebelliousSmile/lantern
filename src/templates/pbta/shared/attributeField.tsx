import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import type { GameDefinition } from 'schema-pbta'

type AttributesRecord = NonNullable<GameDefinition['character']['attributes']>
export type Attribute = AttributesRecord[string]
export type AttributeType = Attribute['type']

export type AttributeValue = string | number | boolean | string[] | undefined

export type AttributeFieldProps = {
    id: string
    attribute: Attribute
    value: AttributeValue
    onChange: (value: AttributeValue) => void
    readOnly?: boolean
    /**
     * `visibleFor` can name a condition (a stat toggle key, or a list of
     * them) that only the caller can resolve against live character state.
     * Not supplying it means every non-boolean condition renders visible.
     */
    isConditionMet?: (condition: string | string[]) => boolean
    labelOverride?: string
    onLabelOverrideChange?: (label: string) => void
}

function isVisible(
    attribute: Attribute,
    isConditionMet?: AttributeFieldProps['isConditionMet']
): boolean {
    const { visibleFor } = attribute
    if (visibleFor === undefined || visibleFor === true) return true
    if (visibleFor === false) return false
    return isConditionMet?.(visibleFor) ?? true
}

function AttributeLabel({
    attribute,
    labelOverride,
    onLabelOverrideChange,
    readOnly,
}: Pick<
    AttributeFieldProps,
    'attribute' | 'labelOverride' | 'onLabelOverrideChange' | 'readOnly'
>) {
    if (attribute.customLabel && onLabelOverrideChange && !readOnly) {
        return (
            <Input
                value={labelOverride ?? attribute.label}
                onChange={(event) => onLabelOverrideChange(event.target.value)}
                className="h-7 text-sm font-medium"
            />
        )
    }

    return (
        <Label className="text-sm font-medium">
            {labelOverride ?? attribute.label}
        </Label>
    )
}

function SegmentTrack({
    id,
    max,
    value,
    onChange,
    readOnly,
}: {
    id: string
    max: number
    value: number
    onChange: (value: number) => void
    readOnly?: boolean
}) {
    const segments = Array.from(
        { length: Math.max(max, 1) },
        (_, index) => index + 1
    )

    return (
        <div className="flex flex-wrap gap-1" role="group" aria-labelledby={id}>
            {segments.map((segment) => (
                <button
                    key={segment}
                    type="button"
                    disabled={readOnly}
                    aria-pressed={segment <= value}
                    onClick={() =>
                        onChange(segment === value ? segment - 1 : segment)
                    }
                    className="size-5 rounded-sm border border-input data-[filled=true]:bg-primary data-[filled=true]:border-primary disabled:cursor-not-allowed"
                    data-filled={segment <= value}
                />
            ))}
        </div>
    )
}

export function AttributeField(props: AttributeFieldProps) {
    const { id, attribute, value, onChange, readOnly } = props

    if (!isVisible(attribute, props.isConditionMet)) return null

    const wrapperClassName =
        attribute.position === 'left'
            ? 'flex flex-row items-center gap-3'
            : 'flex flex-col gap-1.5'

    return (
        <div className={wrapperClassName}>
            <div className="flex items-center gap-2">
                <AttributeLabel
                    attribute={attribute}
                    labelOverride={props.labelOverride}
                    onLabelOverrideChange={props.onLabelOverrideChange}
                    readOnly={readOnly}
                />
                {attribute.limited && (
                    <Badge variant="outline" className="text-[0.6rem]">
                        Limited
                    </Badge>
                )}
            </div>
            {attribute.description && (
                <p className="text-xs text-muted-foreground">
                    {attribute.description}
                </p>
            )}
            {renderControl(id, attribute, value, onChange, readOnly)}
        </div>
    )
}

function renderControl(
    id: string,
    attribute: Attribute,
    value: AttributeValue,
    onChange: (value: AttributeValue) => void,
    readOnly?: boolean
) {
    switch (attribute.type) {
        case 'Number': {
            const current =
                typeof value === 'number' ? value : (attribute.default ?? 0)
            return (
                <Input
                    id={id}
                    type="number"
                    value={current}
                    disabled={readOnly}
                    onChange={(event) => onChange(Number(event.target.value))}
                />
            )
        }
        case 'Text': {
            const current =
                typeof value === 'string' ? value : (attribute.default ?? '')
            return (
                <Input
                    id={id}
                    type="text"
                    value={current}
                    disabled={readOnly}
                    onChange={(event) => onChange(event.target.value)}
                />
            )
        }
        case 'LongText': {
            const current =
                typeof value === 'string' ? value : (attribute.default ?? '')
            return (
                <Textarea
                    id={id}
                    value={current}
                    disabled={readOnly}
                    onChange={(event) => onChange(event.target.value)}
                />
            )
        }
        case 'Resource': {
            const max = attribute.max ?? 0
            const current =
                typeof value === 'number' ? value : (attribute.default ?? 0)
            return (
                <div className="flex items-center gap-2">
                    <SegmentTrack
                        id={id}
                        max={max}
                        value={current}
                        onChange={onChange}
                        readOnly={readOnly}
                    />
                    <span className="text-xs text-muted-foreground">
                        {current} / {max}
                    </span>
                </div>
            )
        }
        case 'Clock': {
            const max = attribute.max ?? 0
            const current =
                typeof value === 'number' ? value : (attribute.default ?? 0)
            return (
                <SegmentTrack
                    id={id}
                    max={max}
                    value={current}
                    onChange={onChange}
                    readOnly={readOnly}
                />
            )
        }
        case 'Xp': {
            const max = attribute.max ?? 0
            const current =
                typeof value === 'number' ? value : (attribute.default ?? 0)
            return (
                <SegmentTrack
                    id={id}
                    max={max}
                    value={current}
                    onChange={onChange}
                    readOnly={readOnly}
                />
            )
        }
        case 'Checkbox': {
            const current =
                typeof value === 'boolean'
                    ? value
                    : (attribute.default ?? false)
            return (
                <div className="flex items-center gap-2">
                    <Checkbox
                        id={id}
                        checked={current}
                        disabled={readOnly}
                        onCheckedChange={(checked) =>
                            onChange(checked === true)
                        }
                    />
                    {attribute.checkboxLabel && (
                        <Label htmlFor={id} className="text-sm">
                            {attribute.checkboxLabel}
                        </Label>
                    )}
                </div>
            )
        }
        case 'ListOne': {
            const options = attribute.options
            const current =
                typeof value === 'number' ? value : (attribute.default ?? 0)
            return (
                <RadioGroup
                    value={String(current)}
                    onValueChange={(next) => onChange(Number(next))}
                    className="gap-2"
                >
                    {options.map((option, index) => (
                        <div key={option} className="flex items-center gap-2">
                            <RadioGroupItem
                                id={`${id}-${index}`}
                                value={String(index)}
                                disabled={readOnly}
                            />
                            <Label
                                htmlFor={`${id}-${index}`}
                                className="text-sm"
                            >
                                {option}
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            )
        }
        case 'ListMany': {
            const options = attribute.options ?? []
            const current = Array.isArray(value) ? value : []
            return (
                <div className="flex flex-col gap-2">
                    {options.map((option, index) => {
                        const checked = current.includes(option)
                        return (
                            <div
                                key={option}
                                className="flex items-center gap-2"
                            >
                                <Checkbox
                                    id={`${id}-${index}`}
                                    checked={checked}
                                    disabled={readOnly}
                                    onCheckedChange={(next) =>
                                        onChange(
                                            next === true
                                                ? [...current, option]
                                                : current.filter(
                                                      (item) => item !== option
                                                  )
                                        )
                                    }
                                />
                                <Label
                                    htmlFor={`${id}-${index}`}
                                    className="text-sm"
                                >
                                    {option}
                                </Label>
                            </div>
                        )
                    })}
                </div>
            )
        }
        case 'Roll': {
            const current =
                typeof value === 'string' ? value : (attribute.default ?? '')
            return (
                <div className="flex items-center gap-2">
                    <Input
                        id={id}
                        type="text"
                        value={current}
                        disabled={readOnly}
                        onChange={(event) => onChange(event.target.value)}
                    />
                    {attribute.showResults && (
                        <span className="text-xs text-muted-foreground">
                            Results shown
                        </span>
                    )}
                </div>
            )
        }
        case 'Track': {
            const loose = attribute as Attribute & { max?: unknown }
            const max = Number(loose.max) || 6
            const current = typeof value === 'number' ? value : 0
            return (
                <SegmentTrack
                    id={id}
                    max={max}
                    value={current}
                    onChange={onChange}
                    readOnly={readOnly}
                />
            )
        }
        default: {
            const unknownType: never = attribute
            throw new Error(
                `Unknown PbtA attribute type: ${(unknownType as Attribute).type}`
            )
        }
    }
}
