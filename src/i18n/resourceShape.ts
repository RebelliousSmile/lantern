/** The shape a translation must follow: the English namespace's keys, any string as value. */
export type ResourceShape<T> = {
    [K in keyof T]: T[K] extends string ? string : ResourceShape<T[K]>
}
