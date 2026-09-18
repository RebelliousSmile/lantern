import { cn } from '@/utils/cn'
import { RadioGroup, RadioGroupItem } from './radio-group'

export type SegmentedRadioOption = {
    value: string
    label: string
    disabled?: boolean
}

/**
 * Compact visual treatment for a short, mutually-exclusive list. It retains
 * RadioGroup keyboard behavior and announces each option as a radio.
 */
export function SegmentedRadioGroup({
    id,
    value,
    onValueChange,
    options,
    ariaLabel,
    className,
}: {
    id: string
    value: string
    onValueChange: (value: string) => void
    options: readonly SegmentedRadioOption[]
    ariaLabel: string
    className?: string
}) {
    return (
        <RadioGroup
            value={value}
            onValueChange={onValueChange}
            aria-label={ariaLabel}
            className={cn(
                'grid gap-0 overflow-hidden rounded-md border',
                className
            )}
            style={{
                gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
            }}
        >
            {options.map((option) => {
                const optionId = `${id}-${option.value}`
                const selected = value === option.value
                return (
                    <label
                        key={option.value}
                        htmlFor={optionId}
                        className={cn(
                            'flex h-8 cursor-pointer items-center justify-center px-2 text-center text-xs transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
                            selected
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-background hover:bg-accent hover:text-accent-foreground',
                            option.disabled && 'cursor-not-allowed opacity-50'
                        )}
                    >
                        <RadioGroupItem
                            id={optionId}
                            value={option.value}
                            disabled={option.disabled}
                            className="sr-only"
                        />
                        {option.label}
                    </label>
                )
            })}
        </RadioGroup>
    )
}
