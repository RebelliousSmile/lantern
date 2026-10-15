import { type ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

/*
 * What an editor writes, proved field by field through its rendered panels.
 *
 * Each field of a panel is used as a person would (a text typed, a box ticked, an option picked),
 * from a start document, and the document is read back. Five things are then required of it:
 *
 *  - every path the field wrote is declared by the schema of the document (a field that proposes
 *    what the contract does not declare fails here, the inverse of "every leaf has a field");
 *  - a real export of the document after that one typing raises no error the start document did not
 *    already raise (so an enumeration typed as free text, or a key the schema forbids, fails);
 *  - what was typed is shown back by the field (a value written to another path is not);
 *  - nothing is written behind the typing: a second path changes only when it is a value the schema
 *    requires, set to its neutral value, or when the field points (aria-describedby) at a status or alert that signals it;
 *  - a typing never adds a line nobody typed in.
 */
type Control = Record<string, unknown> & { kind: string }
type Probe = Record<string, unknown>

export type Panel = { name: string; target: string; keys?: string[] }
export type Node = {
    type?: string
    properties?: Record<string, Node>
    items?: Node
    oneOf?: Node[]
    anyOf?: Node[]
    required?: string[]
    enum?: unknown[]
}
export type Surface = {
    name: string
    schema: Node
    /** The real export: throws when the document is not one the contract accepts. */
    validate: (document: Record<string, unknown>) => void
    /**
     * The document as the export writes it (after the editor's drafts are left out): what the
     * preview shows of a document is compared with it, leaf by leaf.
     */
    exported?: (document: Record<string, unknown>) => unknown
    /**
     * Paths a field clears along with the one it writes, because the value they held no longer
     * means anything (the location of a state, once its side changes). Declared by pointer.
     */
    clears?: string[]
    /**
     * Pointer prefixes where the contract itself spells "this owner has no value" as an empty form
     * (a state's `delta`): there the empty form is the value, not a hollow leftover.
     */
    emptyForms?: string[]
    /**
     * Keys a new line holds because of where it is or what it must be (the column a formation sits
     * in, the generated id of a state): required by the contract and not something to type.
     */
    identity?: string[]
    /** The label of the button that adds a line to a list: pressing it adds a line nobody filled. */
    addLabel?: string
    element: (
        panel: Panel,
        state: { doc: Record<string, unknown> }
    ) => ReactElement
}

const hooks = globalThis as unknown as {
    __lanternControls?: Control[]
    __lanternSlots?: { values: unknown[]; cursor: number }
    __lanternEdit?: unknown
}

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T

/* The leaves of a document, by indexed path. */
const flat = (value: unknown, path = '', out = new Map<string, unknown>()) => {
    if (Array.isArray(value)) {
        /* A list of plain values is one value: ticking a box moves its neighbours. */
        if (value.every((item) => item === null || typeof item !== 'object'))
            out.set(path, value)
        else value.forEach((item, i) => flat(item, `${path}[${i}]`, out))
    } else if (value && typeof value === 'object') {
        const keys = Object.keys(value)
        if (keys.length === 0) out.set(path, {})
        else
            keys.forEach((key) =>
                flat((value as Probe)[key], `${path}/${key}`, out)
            )
    } else out.set(path, value)
    return out
}
export const pointerOf = (path: string) => path.replace(/\[\d+\]/g, '[]')
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)
const changed = (
    before: Record<string, unknown>,
    after: Record<string, unknown>
) => {
    const a = flat(before)
    const b = flat(after)
    const paths = new Set([...a.keys(), ...b.keys()])
    return [...paths]
        .filter((path) => !same(a.get(path), b.get(path)))
        .map((path) => ({ path, value: b.get(path), had: a.get(path) }))
}

const stepsOf = (pointer: string) =>
    pointer
        .split('/')
        .filter(Boolean)
        .reduce<string[]>((all, part) => {
            const bare = part.replace(/\[\]/g, '')
            const arrays = (part.length - bare.length) / 2
            return all.concat(bare, ...Array<string>(arrays).fill('[]'))
        }, [])
const withVariants = (node: Node): Node[] =>
    node.oneOf || node.anyOf
        ? [...(node.oneOf ?? []), ...(node.anyOf ?? [])].flatMap(withVariants)
        : [node]

/** The schema nodes a pointer names (several when a list holds variants); none when it declares nothing there. */
export const nodesAt = (root: Node, pointer: string): Node[] =>
    stepsOf(pointer).reduce<Node[]>(
        (nodes, step) =>
            nodes.flatMap((node) =>
                withVariants(node).flatMap((variant) => {
                    const next =
                        step === '[]'
                            ? variant.items
                            : variant.properties?.[step]
                    return next ? [next] : []
                })
            ),
        [root]
    )

/** Whether the value written at `pointer` is one the schema requires of its parent, at its neutral value. */
const neutralRequired = (root: Node, pointer: string, value: unknown) => {
    const parts = stepsOf(pointer)
    const key = parts[parts.length - 1]
    const parentPointer = parts
        .slice(0, -1)
        .reduce(
            (all, step) => (step === '[]' ? `${all}[]` : `${all}/${step}`),
            ''
        )
    const parents = nodesAt(root, parentPointer)
    const required = parents.some((node) =>
        withVariants(node).some((variant) => variant.required?.includes(key))
    )
    if (!required) return false
    const node = nodesAt(root, pointer)[0]
    return (
        value === 0 ||
        value === false ||
        (Array.isArray(value) && value.length === 0) ||
        (node?.enum !== undefined && node.enum.indexOf(value) >= 0)
    )
}

const blank = (value: unknown) =>
    value === '' ||
    value === undefined ||
    value === null ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value) &&
        Object.keys(value).length === 0)

/* The non-blank leaves of a document, by pointer without indexes, as a multiset (trimmed strings). */
const leafBag = (value: unknown): Map<string, number> => {
    const bag = new Map<string, number>()
    flat(value).forEach((leaf, path) => {
        if (blank(leaf)) return
        const shown = typeof leaf === 'string' ? leaf.trim() : leaf
        if (shown === '') return
        const key = `${pointerOf(path)}=${JSON.stringify(shown)}`
        bag.set(key, (bag.get(key) ?? 0) + 1)
    })
    return bag
}
/** What `raw` holds that `kept` does not: the leaves an export leaves out. */
const lostLeaves = (raw: unknown, kept: unknown): Map<string, number> => {
    const have = leafBag(kept)
    const lost = new Map<string, number>()
    leafBag(raw).forEach((count, key) => {
        const left = count - (have.get(key) ?? 0)
        if (left > 0) lost.set(key, left)
    })
    return lost
}
/** What is lost in `after` and was not in `before`. */
const newlyLost = (
    before: Map<string, number>,
    after: Map<string, number>
): string[] =>
    [...after.entries()]
        .filter(([key, count]) => count > (before.get(key) ?? 0))
        .map(([key]) => key)

/** Whether `markup` holds a status or an alert with this id. */
const hasStatus = (markup: string, id: string) => {
    const escaped = id
        .split('')
        .map((char) => (/[A-Za-z0-9_-]/.test(char) ? char : `\\${char}`))
        .join('')
    const open = '<[^>]*'
    const rest = '[^>]*'
    return new RegExp(
        `${open} id="${escaped}"${rest}role="(?:status|alert)"|${open}role="(?:status|alert)"${rest} id="${escaped}"`
    ).test(markup)
}
/** Whether the control points, by `aria-describedby`, at a status or alert of the page. */
export const linkedStatus = (control: Control | undefined, markup: string) => {
    if (!control) return false
    const ids = String(control['aria-describedby'] ?? control.describedBy ?? '')
        .split(/\s+/)
        .filter(Boolean)
    return ids.some((id) => hasStatus(markup, id))
}

const issuesOf = (surface: Surface, document: Record<string, unknown>) => {
    try {
        surface.validate(clone(document))
        return [] as string[]
    } catch (error) {
        const found = (error as { issues?: unknown[] }).issues
        if (!Array.isArray(found)) return [String((error as Error).message)]
        return found.map((issue) => {
            const entry = issue as {
                path?: unknown[]
                code?: string
                message?: string
            }
            return `${(entry.path ?? []).join('.')} ${entry.code ?? ''} ${entry.message ?? ''}`.trim()
        })
    }
}

export type Failure = { where: string; what: string }

export type PanelRun = {
    /** Pointers (arrays written `[]`) the fields of the panel wrote, over all the probes. */
    written: Set<string>
    controls: number
    failures: Failure[]
}

/** Uses every field of `panel` from `start`, and reads the document back. */
export function probePanel(
    surface: Surface,
    panel: Panel,
    start: Record<string, unknown>,
    startName: string
): PanelRun {
    const failures: Failure[] = []
    const written = new Set<string>()
    const baseline = new Set(issuesOf(surface, start))
    const open = () => {
        const state = {
            doc: clone(start),
            sheet: { open: true, target: panel.target, keys: panel.keys },
        }
        const store = { values: [] as unknown[], cursor: 0 }
        let markup = ''
        let controls: Control[] = []
        const draw = () => {
            const list: Control[] = []
            hooks.__lanternControls = list
            store.cursor = 0
            hooks.__lanternSlots = store
            hooks.__lanternEdit = state
            try {
                markup = renderToStaticMarkup(surface.element(panel, state))
            } finally {
                hooks.__lanternSlots = undefined
                hooks.__lanternEdit = undefined
                hooks.__lanternControls = undefined
            }
            controls = list
        }
        draw()
        return {
            state,
            draw,
            markup: () => markup,
            controls: () => controls,
        }
    }
    const count = open().controls().length
    const labelOf = (markup: string, index: number) => {
        const before = new RegExp(
            `([^<>]{1,70})</(?:span|label|legend|p)>(?:<[^>]*>)*?<(?:input|textarea|select)[^>]*data-control="${index}"`
        ).exec(markup)
        const after = new RegExp(
            `data-control="${index}"[^>]*>(?:<[^>]*>)*?<span[^>]*>([^<]{1,70})</span>`
        ).exec(markup)
        const aria = new RegExp(
            `aria-label="([^"]{1,70})"[^>]*data-control="${index}"|data-control="${index}"[^>]*aria-label="([^"]{1,70})"`
        ).exec(markup)
        return (
            aria?.[1] ??
            aria?.[2] ??
            before?.[1] ??
            after?.[1] ??
            `field #${index}`
        )
    }
    const baselineLost = surface.exported
        ? lostLeaves(start, surface.exported(clone(start)))
        : new Map<string, number>()
    type Variant = {
        name: string
        typed?: string
        pick?: 'first' | 'last' | 'none'
    }
    const variantsOf = (control: Control): Variant[] => {
        if (control.kind === 'checkbox') return [{ name: 'toggled' }]
        if (control.kind === 'select')
            return [
                { name: 'first option', pick: 'first' },
                { name: 'last option', pick: 'last' },
                { name: 'none option', pick: 'none' },
            ]
        return control.type === 'number'
            ? [
                  { name: 'typed 3', typed: '3' },
                  { name: 'cleared', typed: '' },
                  { name: 'above bounds', typed: '99999' },
                  { name: 'below bounds', typed: '-7' },
              ]
            : [
                  { name: 'typed text', typed: 'probe' },
                  { name: 'cleared', typed: '' },
                  { name: 'blanks', typed: '   ' },
              ]
    }
    /*
     * Adding a line: the button only opens an empty line. Whatever it writes beside the line is a
     * value nobody typed, so it is refused (a default side, a default type, a preset number).
     */
    const holdsNothing = (value: unknown): boolean => {
        if (typeof value === 'string') return value.trim() === ''
        if (Array.isArray(value)) return value.every(holdsNothing)
        if (value && typeof value === 'object')
            return Object.values(value).every(holdsNothing)
        return value === undefined || value === null
    }
    for (let index = 0; index < count; index++) {
        const pressed = open()
        const button = pressed.controls()[index]
        if (
            !surface.addLabel ||
            !button ||
            button.kind !== 'button' ||
            typeof button.onClick !== 'function' ||
            JSON.stringify(button.children ?? '').indexOf(surface.addLabel) < 0
        )
            continue
        try {
            ;(button.onClick as (event: unknown) => void)({})
            /* The line is drawn as a fresh panel would: its hooks start from nothing. */
            hooks.__lanternControls = []
            hooks.__lanternSlots = { values: [], cursor: 0 }
            hooks.__lanternEdit = pressed.state
            try {
                renderToStaticMarkup(surface.element(panel, pressed.state))
            } finally {
                hooks.__lanternSlots = undefined
                hooks.__lanternEdit = undefined
                hooks.__lanternControls = undefined
            }
        } catch (error) {
            failures.push({
                where: `${surface.name} / ${panel.name} / ${startName} / add line`,
                what: `adding a line breaks the panel: ${String(error)}`,
            })
            continue
        }
        changed(start, pressed.state.doc).forEach(({ path, value }) => {
            written.add(pointerOf(path))
            if ((surface.identity ?? []).indexOf(pointerOf(path)) >= 0) return
            if (!holdsNothing(value))
                failures.push({
                    where: `${surface.name} / ${panel.name} / ${startName} / add line`,
                    what: `adding a line writes ${JSON.stringify(value)} at ${pointerOf(path)}: nobody typed it`,
                })
        })
    }
    for (let index = 0; index < count; index++) {
        const first = open().controls()[index]
        if (!first || first.disabled || first.readOnly) continue
        if (first.kind === 'button') continue
        if (
            first.kind !== 'checkbox' &&
            first.kind !== 'select' &&
            (first.type === 'button' ||
                first.type === 'checkbox' ||
                first.type === 'file')
        )
            continue
        for (const variant of variantsOf(first)) {
            const session = open()
            const control = session.controls()[index]
            if (!control || control.disabled || control.readOnly) continue
            const label = labelOf(session.markup(), index)
            const isDefault =
                variant.name === 'toggled' ||
                variant.name === 'first option' ||
                variant.name === 'typed 3' ||
                variant.name === 'typed text'
            const where = `${surface.name} / ${panel.name} / ${startName} / "${label}"${isDefault ? '' : ` [${variant.name}]`}`
            let picked: string | undefined
            if (control.kind === 'checkbox') {
                const onCheckedChange = control.onCheckedChange as
                    | ((checked: boolean) => void)
                    | undefined
                if (!onCheckedChange) continue
                onCheckedChange(!control.checked)
                session.draw()
            } else if (control.kind === 'select') {
                const all = control.options as string[]
                const real = all.filter(
                    (option) =>
                        option !== control.value && option.indexOf('__') !== 0
                )
                const none = all.filter((option) => option.indexOf('__') === 0)
                const onValueChange = control.onValueChange as
                    | ((value: string) => void)
                    | undefined
                if (!onValueChange) continue
                picked =
                    variant.pick === 'first'
                        ? real[0]
                        : variant.pick === 'last'
                          ? real[real.length - 1]
                          : none.find((option) => option !== control.value)
                if (picked === undefined) continue
                if (variant.pick === 'last' && picked === real[0]) continue
                onValueChange(picked)
                session.draw()
            } else {
                const onChange = control.onChange as
                    | ((event: unknown) => void)
                    | undefined
                if (!onChange) continue
                const typed = variant.typed ?? ''
                const event = {
                    target: { value: typed },
                    currentTarget: { value: typed },
                }
                onChange(event)
                session.draw()
                const commit = (session.controls()[index]?.onKeyDown ??
                    control.onKeyDown) as ((event: unknown) => void) | undefined
                commit?.({ ...event, key: 'Enter' })
                session.draw()
                const blur = session.controls()[index]?.onBlur as
                    | ((event: unknown) => void)
                    | undefined
                blur?.(event)
                session.draw()
            }
            const after = session.state.doc
            const diff = changed(start, after)
            diff.forEach(({ path }) => written.add(pointerOf(path)))
            if (diff.length === 0) continue

            /* Declared: the schema names every path written. */
            diff.forEach(({ path }) => {
                const pointer = pointerOf(path)
                if (nodesAt(surface.schema, pointer).length === 0)
                    failures.push({
                        where,
                        what: `writes ${pointer}, which the schema does not declare`,
                    })
            })

            /*
             * What the editor writes is a value or nothing: a blank string, an empty group or an
             * empty list left in the document is a key that should have gone out of it.
             */
            const isEmptyForm = (pointer: string) =>
                (surface.emptyForms ?? []).some(
                    (prefix) => pointer.indexOf(prefix) === 0
                )
            diff.forEach(({ path, value }) => {
                const pointer = pointerOf(path)
                /* A list row is the draft its fields are typed into: its own panel says what is missing. */
                const row =
                    pointer.endsWith('[]') &&
                    typeof value === 'object' &&
                    value !== null &&
                    !Array.isArray(value)
                if (isEmptyForm(pointer) || row) return
                const hollow =
                    (typeof value === 'string' && value.trim() === '') ||
                    (Array.isArray(value) && value.length === 0) ||
                    (typeof value === 'object' &&
                        value !== null &&
                        !Array.isArray(value) &&
                        Object.keys(value).length === 0)
                if (hollow)
                    failures.push({
                        where,
                        what: `leaves an empty value at ${pointerOf(path)} in the document: the key goes out instead`,
                    })
            })

            /* Emptying a field, or choosing its "none", writes nothing new: it removes keys. */
            if (variant.name === 'cleared' || variant.name === 'none option')
                diff.forEach(({ path, value, had }) => {
                    if (value === undefined || value === had) return
                    const pointer = pointerOf(path)
                    if ((surface.clears ?? []).indexOf(pointer) >= 0) return
                    if (isEmptyForm(pointer)) return
                    /* One item of a list taken out leaves the list of the others, not a key. */
                    if (
                        Array.isArray(value) &&
                        Array.isArray(had) &&
                        value.length < had.length
                    )
                        return
                    /* A row emptied of its fields stays as the draft of its panel. */
                    if (
                        pointer.endsWith('[]') &&
                        typeof value === 'object' &&
                        value !== null &&
                        !Array.isArray(value)
                    )
                        return
                    failures.push({
                        where,
                        what: `emptying the field writes ${JSON.stringify(value)} at ${pointer} instead of removing a key`,
                    })
                })

            /* Unticking a box removes its key: `false` is not an input the user gave. */
            if (variant.name === 'toggled')
                diff.forEach(({ path, value, had }) => {
                    if (value === false && had === true)
                        failures.push({
                            where,
                            what: `unticking leaves false at ${pointerOf(path)}: the key goes out instead`,
                        })
                })

            /* Exportable: a real export after this one typing raises nothing new. */
            const raised = issuesOf(surface, after).filter(
                (issue) => !baseline.has(issue)
            )
            if (raised.length > 0)
                failures.push({
                    where,
                    what: `the export fails after typing: ${raised.slice(0, 2).join(' | ')}`,
                })

            /*
             * Nothing the sheet shows is lost silently: what the document holds and the export
             * leaves out was either lost before, or the typed field points (aria-describedby) at a
             * status or alert that says so.
             */
            if (surface.exported) {
                const lost = newlyLost(
                    baselineLost,
                    lostLeaves(after, surface.exported(clone(after)))
                )
                if (
                    lost.length > 0 &&
                    !linkedStatus(session.controls()[index], session.markup())
                )
                    failures.push({
                        where,
                        what: `the document holds ${lost
                            .slice(0, 4)
                            .join(
                                ', '
                            )} that the export leaves out, and the field points at no status or alert that says so`,
                    })
            }

            /* Nothing behind the typing: one path changes, or the others are required neutral values, or the panel signals it. */
            if (diff.length > 1) {
                /* A signal is the field's own: a status the page holds elsewhere says nothing of this typing. */
                const signalled = linkedStatus(
                    session.controls()[index],
                    session.markup()
                )
                /* The line a path is in: a line typed in may hold the neutral values the schema requires of it. */
                const lineOf = (path: string) =>
                    path.slice(0, path.lastIndexOf(']') + 1)
                const excused = (skip: number) =>
                    diff.every(
                        (entry, at) =>
                            at === skip ||
                            /* The value was written as a scalar where the document held a group: the group's leaves go with it. */
                            (entry.value === undefined &&
                                entry.path.indexOf(`${diff[skip].path}/`) ===
                                    0) ||
                            ((surface.clears ?? []).indexOf(
                                pointerOf(entry.path)
                            ) >= 0 &&
                                entry.value === undefined) ||
                            (lineOf(entry.path) === lineOf(diff[skip].path) &&
                                entry.value !== undefined &&
                                (entry.value === '' ||
                                    neutralRequired(
                                        surface.schema,
                                        pointerOf(entry.path),
                                        entry.value
                                    )))
                    )
                /* A cleared field shows a group by its current value (`ValueForm`): clearing it takes the whole group, its leaves going together. */
                const parentOf = (path: string) => path.slice(0, path.lastIndexOf('/'))
                const groupCleared =
                    variant.name === 'cleared' &&
                    diff.every(
                        (entry) =>
                            entry.value === undefined &&
                            parentOf(entry.path) === parentOf(diff[0].path)
                    )
                if (
                    !signalled &&
                    !groupCleared &&
                    !diff.some((_, at) => excused(at))
                )
                    failures.push({
                        where,
                        what: `writes ${diff.length} paths with no signal: ${diff
                            .map(
                                (entry) =>
                                    `${pointerOf(entry.path)}=${JSON.stringify(entry.value)}`
                            )
                            .slice(0, 12)
                            .join(', ')}`,
                    })
            }

            /* Shown back: the field typed in holds what the document now holds. */
            if (diff.length === 1 && isDefault) {
                const entry = diff[0]
                const now = session.controls()
                const here = now[index]
                const shown = (candidate: Control | undefined) => {
                    if (!candidate) return false
                    if (control.kind === 'checkbox')
                        return (
                            candidate.kind === 'checkbox' &&
                            Boolean(candidate.checked) === !control.checked
                        )
                    if (control.kind === 'select')
                        return (
                            candidate.kind === 'select' &&
                            candidate.value === picked
                        )
                    return (
                        candidate.kind === control.kind &&
                        (Array.isArray(entry.value)
                            ? entry.value.indexOf(
                                  String(candidate.value ?? '')
                              ) >= 0
                            : String(candidate.value ?? '') ===
                              String(entry.value))
                    )
                }
                const newLine = /\[\d+\]/.test(entry.path) && blank(entry.had)
                if (!shown(here) && !(newLine && now.some(shown)))
                    failures.push({
                        where,
                        what: `writes ${pointerOf(entry.path)}=${JSON.stringify(entry.value)} but the field does not show it back (it shows ${JSON.stringify(here?.value ?? here?.checked)})`,
                    })
            }
        }
    }
    return { written, controls: count, failures }
}

export const lines = (failures: Failure[]) => {
    const seen = new Set<string>()
    return failures
        .filter((failure) => {
            const key = `${failure.where}|${failure.what}`
            if (seen.has(key)) return false
            seen.add(key)
            return true
        })
        .map((failure) => `${failure.where}: ${failure.what}`)
}
