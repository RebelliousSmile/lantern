export type VisibilityMap = Record<string, boolean>

export const mergeVisibility = <T extends VisibilityMap>(
    defaults: T,
    persisted?: Partial<T>
): T => ({ ...defaults, ...persisted })

export const setVisibility = <T extends VisibilityMap>(
    visibility: T,
    key: keyof T,
    value: boolean
): T => ({ ...visibility, [key]: value })

export const toggleVisibility = <T extends VisibilityMap>(
    visibility: T,
    key: keyof T
): T => setVisibility(visibility, key, !visibility[key])
