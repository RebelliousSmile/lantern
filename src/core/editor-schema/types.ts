export type EditorPathSegment = string | number
export type EditorPath = readonly EditorPathSegment[]

export type EditorTarget = {
    descriptorId: string
    path: EditorPath
}

export type FieldCondition = {
    path: EditorPath
    equals: unknown
    clearWhenHidden?: boolean
}

type BaseDescriptor = {
    id: string
    label: string
    description?: string
    condition?: FieldCondition
    readOnly?: boolean
}

export type ScalarKind = 'text' | 'textarea' | 'number' | 'boolean'

export type ScalarDescriptor = BaseDescriptor & {
    kind: 'scalar'
    scalar: ScalarKind
    placeholder?: string
}

export type ObjectDescriptor = BaseDescriptor & {
    kind: 'object'
    fields: EditorDescriptor[]
}

export type CollectionDescriptor = BaseDescriptor & {
    kind: 'collection'
    item: EditorDescriptor
    createEmpty: () => unknown
    minItems?: number
    reorderable?: boolean
}

export type VariantDescriptor = BaseDescriptor & {
    kind: 'variant'
    discriminator: string
    options: Array<{
        value: string
        label: string
        createEmpty: () => Record<string, unknown>
        fields: EditorDescriptor[]
    }>
}

export type EditorDescriptor =
    | ScalarDescriptor
    | ObjectDescriptor
    | CollectionDescriptor
    | VariantDescriptor

export type TemplateEditorSchema = ObjectDescriptor
