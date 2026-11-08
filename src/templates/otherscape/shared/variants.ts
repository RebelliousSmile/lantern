/* The variants of :Otherscape (Metro, Cairo, Tokyo) as the published Handbook
   pack declares them. Lantern reads the list and the default from the pinned
   package rather than keeping its own: a variant added upstream shows up in
   the picker, and none is invented here. */
import pack from 'schema-in-the-mist/handbook/otherscape/pack.json'

export type OtherscapeVariant = { id: string; label: string }

export const otherscapeVariants: ReadonlyArray<OtherscapeVariant> =
    pack.variants.map((variant) => ({ id: variant.id, label: variant.label }))

export const defaultOtherscapeVariantId: string = pack.defaultVariantId

/* An unknown or missing id (a tab saved before variants, a variant withdrawn
   upstream) falls back on the published default. */
export function normalizeOtherscapeVariant(id: string | undefined): string {
    return otherscapeVariants.some((variant) => variant.id === id)
        ? (id as string)
        : defaultOtherscapeVariantId
}

/* The class a card root takes for its variant; a card without a drawing of
   its own for that variant simply has no rule under it. */
export function otherscapeVariantClass(id: string): string {
    return `os-variant-${normalizeOtherscapeVariant(id)}`
}
