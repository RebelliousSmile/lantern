/**
 * Stand-in for `@/components/ui/select` in the PJ harness only.
 *
 * The Radix select renders nothing on the server, so a panel's selectors would be invisible to a
 * markup proof. This double keeps the same exports and serialises the selector as a native
 * `<select>` whose `<option>` for the current value is `selected`: what the panel hands the
 * selector (its value and its options) is then readable in the markup. It also records the value,
 * the offered values and the change handler, numbered by `data-control`, so the harness can pick
 * an option as a user would.
 */
import {
    Children,
    createElement,
    isValidElement,
    type ReactElement,
    type ReactNode,
} from 'react'

type Children = { children?: ReactNode }

/** Every `value` of a `SelectItem` below `node`. */
function offered(node: ReactNode): string[] {
    return Children.toArray(node).reduce<string[]>((all, child) => {
        if (!isValidElement(child)) return all
        const element = child as ReactElement<{
            value?: string
            children?: ReactNode
        }>
        return element.type === SelectItem
            ? all.concat(String(element.props.value))
            : all.concat(offered(element.props.children))
    }, [])
}

export function Select({
    value,
    onValueChange,
    children,
}: Children & { value?: string; onValueChange?: (value: string) => void }) {
    const controls = (
        globalThis as { __lanternControls?: Record<string, unknown>[] }
    ).__lanternControls
    const number = controls
        ? controls.push({
              kind: 'select',
              value,
              onValueChange,
              options: offered(children),
          }) - 1
        : undefined
    return createElement(
        'select',
        {
            'data-double': 'select',
            value,
            onChange: () => undefined,
            ...(number === undefined ? {} : { 'data-control': number }),
        },
        children
    )
}

export function SelectContent({ children }: Children) {
    return createElement('optgroup', null, children)
}

export function SelectItem({ value, children }: Children & { value: string }) {
    return createElement('option', { value }, children)
}

/* The trigger carries the field's aria-describedby: it is recorded on the select it belongs to. */
export function SelectTrigger(props: Record<string, unknown>) {
    const controls = (
        globalThis as { __lanternControls?: Record<string, unknown>[] }
    ).__lanternControls
    const last = controls?.[controls.length - 1]
    if (last && last.kind === 'select')
        last.describedBy = props['aria-describedby']
    return null
}
export const SelectValue = () => null
export const SelectGroup = ({ children }: Children) =>
    createElement('optgroup', null, children)
export const SelectLabel = () => null
export const SelectSeparator = () => null
export const SelectScrollUpButton = () => null
export const SelectScrollDownButton = () => null
