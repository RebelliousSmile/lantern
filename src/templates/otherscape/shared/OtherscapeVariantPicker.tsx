import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { type UiText, useUiText } from '@/i18n/text'
import { otherscapeVariants } from './variants'

/* The variant choice of the "General appearance" panel. The variant names are
   the book's own (Metro, Cairo, Tokyo) and are printed as published. */
export function OtherscapeVariantPicker({
    idPrefix,
    heading,
    value,
    onChange,
}: {
    idPrefix: string
    heading: UiText
    value: string
    onChange: (id: string) => void
}) {
    const text = useUiText()

    return (
        <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {text(heading)}
            </p>
            <RadioGroup
                value={value}
                onValueChange={onChange}
                className="flex flex-wrap items-center gap-3"
            >
                {otherscapeVariants.map((variant) => (
                    <label
                        key={variant.id}
                        className="flex cursor-pointer items-center gap-2"
                    >
                        <RadioGroupItem
                            value={variant.id}
                            id={`${idPrefix}-variant-${variant.id}`}
                        />
                        <span className="text-xs">{variant.label}</span>
                    </label>
                ))}
            </RadioGroup>
        </div>
    )
}
