export type AdrenalineExportPrefs = {
    scale: 1 | 2 | 3
}

export type AdrenalineViewState = {
    zoom: number
    previewWidth: number
    exportPrefs: AdrenalineExportPrefs
}

export const ADRENALINE_PREVIEW_WIDTH_MIN = 360
export const ADRENALINE_PREVIEW_WIDTH_MAX = 960

export const defaultAdrenalineView: AdrenalineViewState = {
    zoom: 1,
    previewWidth: 680,
    exportPrefs: { scale: 2 },
}

export type AdrenalineSheetState<TTarget extends string = string> = {
    open: boolean
    target: TTarget | null
}

export const emptyAdrenalineSheetState: AdrenalineSheetState = {
    open: false,
    target: null,
}
