/**
 * Stand-in for `react` in the PJ harness only.
 *
 * The harness types into a rendered panel with the server renderer, which keeps no state between
 * renders. While `globalThis.__lanternSlots` is set, `useState` reads and writes that store by call
 * order, so a field's draft survives from one render of the same panel to the next. Every other
 * hook is React's own. Outside a typing session this is `react` unchanged.
 */
import React from '../node_modules/react/index.js'

export * from '../node_modules/react/index.js'

type Store = { values: unknown[]; cursor: number }

export function useState<T>(initial: T | (() => T)) {
    const store = (globalThis as { __lanternSlots?: Store }).__lanternSlots
    if (!store) return React.useState(initial)
    const at = store.cursor++
    if (!(at in store.values))
        store.values[at] =
            typeof initial === 'function' ? (initial as () => T)() : initial
    const set = (next: T | ((previous: T) => T)) => {
        const previous = store.values[at] as T
        store.values[at] =
            typeof next === 'function'
                ? (next as (previous: T) => T)(previous)
                : next
    }
    return [store.values[at] as T, set] as const
}

export default { ...React, useState }
