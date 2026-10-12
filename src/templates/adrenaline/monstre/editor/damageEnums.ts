import { Monstre } from 'schema-adrenaline'

/* A Zod node seen through its wrappers (optional, default, array element...) down to the node that carries `shape`, `element` or `options`. */
type Node = {
    shape?: Record<string, Node>
    element?: Node
    options?: readonly string[]
    def?: { innerType?: Node; schema?: Node }
}

function unwrap(node: Node | undefined): Node | undefined {
    let current = node
    while (
        current &&
        !current.shape &&
        !current.element &&
        !current.options &&
        (current.def?.innerType ?? current.def?.schema)
    )
        current = current.def?.innerType ?? current.def?.schema
    return current
}

/* The damage a published action carries, as the contract declares it: the contract does not export its enumerations by name. */
function damageShape(): Record<string, Node> | undefined {
    const actions = unwrap(
        (Monstre.shape as unknown as Record<string, Node>).actions
    )
    const action = unwrap(actions?.element)
    return unwrap(action?.shape?.degats)?.shape
}

/** The sides a damage may touch (`versant`), read from the published contract. */
export function damageSides(): readonly string[] {
    return unwrap(damageShape()?.versant)?.options ?? []
}

/** The natures a damage profile may take, read from the published contract. */
export function damageNatures(): readonly string[] {
    const profile = unwrap(unwrap(damageShape()?.profils)?.element)
    return unwrap(profile?.shape?.nature)?.options ?? []
}
