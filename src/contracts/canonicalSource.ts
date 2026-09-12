const SOURCE = '__canonicalSource'

export function carryCanonicalSource<
    Form extends object,
    Canonical extends object,
>(form: Form, source: Canonical): Form {
    return Object.assign(form, { [SOURCE]: source })
}

export function overlayCanonicalSource<
    Form extends object,
    Owned extends object = Form,
>(form: Form, owned: Owned = form as unknown as Owned): Owned {
    const carrier = form as Form & { [SOURCE]?: object }
    const { [SOURCE]: source } = carrier
    const clean = { ...owned } as Owned & { [SOURCE]?: object }
    delete clean[SOURCE]
    return { ...source, ...clean } as Owned
}

/* True once a document carries an import's canonical source. Use it to warn
   a form when clearing an optional field will not survive export:
   `overlayCanonicalSource` re-injects the original key from that source. */
export function hasCanonicalSource(form: object): boolean {
    return SOURCE in form
}

export function stringifyCanonical(
    codec: { stringifyToml(value: any): string },
    form: object,
    owned: object = form
): string {
    return codec.stringifyToml(overlayCanonicalSource(form, owned))
}
