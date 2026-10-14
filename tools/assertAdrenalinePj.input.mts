/**
 * Stand-ins for `@/components/ui/input`, `textarea`, `checkbox` and `button` in the PJ harness only.
 *
 * Each serialises the same element and, when the harness asks for it, records the props the field
 * hands it (its handlers included), numbered in the markup by `data-control`. The harness can then
 * type into a field of the rendered panel and read the document the panel wrote.
 */
import { createElement, type ComponentProps } from 'react'

type Recorded = Record<string, unknown>
const record = (entry: Recorded) => {
    const controls = (globalThis as { __lanternControls?: Recorded[] })
        .__lanternControls
    return controls ? controls.push(entry) - 1 : undefined
}
const numbered = (number: number | undefined) =>
    number === undefined ? {} : { 'data-control': number }

export function Input(props: ComponentProps<'input'>) {
    const number = record({ ...props, kind: 'input' })
    return createElement('input', {
        ...props,
        'data-slot': 'input',
        ...numbered(number),
    })
}

export function Button(props: ComponentProps<'button'>) {
    const number = record({ ...props, kind: 'button' })
    return createElement('button', {
        ...props,
        'data-slot': 'button',
        ...numbered(number),
    })
}

export function Textarea(props: ComponentProps<'textarea'>) {
    const number = record({ ...props, kind: 'textarea' })
    return createElement('textarea', {
        ...props,
        'data-slot': 'textarea',
        ...numbered(number),
    })
}

export function Checkbox({
    checked,
    onCheckedChange,
    ...props
}: {
    checked?: boolean
    onCheckedChange?: (checked: boolean) => void
} & Omit<ComponentProps<'input'>, 'checked' | 'onChange'>) {
    const number = record({
        ...props,
        checked,
        onCheckedChange,
        kind: 'checkbox',
    })
    return createElement('input', {
        ...props,
        type: 'checkbox',
        checked: Boolean(checked),
        readOnly: true,
        'data-slot': 'checkbox',
        ...numbered(number),
    })
}
