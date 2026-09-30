import type { CSSProperties } from 'react'
import darkOrganicUrl from 'schema-adrenaline/handbook/adrenaline/assets/dark-organic.webp?url&no-inline'
import bodyFontUrl from 'schema-adrenaline/handbook/adrenaline/assets/fonts/adrenaline-body.woff2?url&no-inline'
import displayFontUrl from 'schema-adrenaline/handbook/adrenaline/assets/fonts/adrenaline-display.woff2?url&no-inline'
import handwritingFontUrl from 'schema-adrenaline/handbook/adrenaline/assets/fonts/adrenaline-handwriting.ttf?url&no-inline'
import paperGrainUrl from 'schema-adrenaline/handbook/adrenaline/assets/paper-grain.webp?url&no-inline'
import warningStripeUrl from 'schema-adrenaline/handbook/adrenaline/assets/warning-stripe.webp?url&no-inline'
import packSource from 'schema-adrenaline/handbook/adrenaline/pack.json?raw'
import type {
    AdrenalinePresentation,
    AdrenalinePresentationBlock,
    AdrenalinePresentationSection,
} from 'schema-adrenaline/presentation'
import type { PjSection } from './sections'

/*
 * The published Handbook pack owns every colour, typeface and texture of the Adrenaline sheets.
 * Lantern reads it as data: the light polarity is the printed paper sheet, and its images and
 * fonts are the files published beside it. A file the pack names and this map does not know is
 * left out rather than replaced by a local value.
 */
type PackFont = { file: string; weight?: string }
type PackLayer = { note?: Record<string, string> }
type Pack = {
    pack: {
        style: { base?: PackLayer; light?: PackLayer }
        assets?: {
            images?: Record<string, string>
            fonts?: Record<string, PackFont>
        }
    }
}

const pack = (JSON.parse(packSource) as Pack).pack

const publishedFiles: Record<string, string> = {
    'paper-grain.webp': paperGrainUrl,
    'dark-organic.webp': darkOrganicUrl,
    'warning-stripe.webp': warningStripeUrl,
    'fonts/adrenaline-body.woff2': bodyFontUrl,
    'fonts/adrenaline-display.woff2': displayFontUrl,
    'fonts/adrenaline-handwriting.ttf': handwritingFontUrl,
}

/** Custom properties of the paper sheet, images exposed under the role the pack gives them. */
export const adrenalineSheetTokens = (() => {
    const tokens: Record<string, string> = {
        ...pack.style.base?.note,
        ...pack.style.light?.note,
    }
    for (const [role, file] of Object.entries(pack.assets?.images ?? {})) {
        const url = publishedFiles[file]
        if (url) tokens[`--brumes-image-${role}`] = `url('${url}')`
    }
    return tokens as CSSProperties
})()

const fontFormats: Record<string, string> = {
    woff2: 'woff2',
    woff: 'woff',
    ttf: 'truetype',
    otf: 'opentype',
}

const adrenalineFontFaces = Object.entries(pack.assets?.fonts ?? {})
    .map(([family, font]) => {
        const url = publishedFiles[font.file]
        const format = fontFormats[font.file.split('.').pop() ?? '']
        if (!url || !format) return ''
        return `@font-face { font-family: '${family}'; src: url('${url}') format('${format}'); font-weight: ${font.weight ?? '400'}; font-display: swap; }`
    })
    .filter(Boolean)
    .join(' ')

const FONT_FACES_ID = 'adrenaline-font-faces'

/*
 * The faces live in the document head, never inside the sheet: the PNG export clones the sheet
 * into an SVG image, where a <style> carried along keeps its raw URLs, cannot load them, and
 * leaves every line of text blank. Declared in the head, snapdom inlines them as data.
 */
export function installAdrenalineFontFaces() {
    if (document.getElementById(FONT_FACES_ID)) return
    const style = document.createElement('style')
    style.id = FONT_FACES_ID
    style.textContent = adrenalineFontFaces
    document.head.appendChild(style)
}

export function asRecord(value: unknown): Record<string, unknown> | undefined {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : undefined
}

/** Reads a JSON Pointer of the published presentation. */
export function at(source: unknown, pointer: string): unknown {
    return pointer
        .slice(1)
        .split('/')
        .reduce<unknown>((value, key) => asRecord(value)?.[key], source)
}

export function lastSegment(pointer: string): string {
    return pointer.split('/').pop() ?? ''
}

export function sortedBlocks(
    section: AdrenalinePresentationSection
): AdrenalinePresentationBlock[] {
    return [...section.blocks].sort((a, b) => a.order - b.order)
}

export function sortedSections(
    presentation: AdrenalinePresentation
): AdrenalinePresentationSection[] {
    return [...presentation.sections].sort((a, b) => a.order - b.order)
}

/*
 * Two optional fields arrived with presentation 2.7.0: a section `row` shared with its neighbours,
 * and a block `fieldRows`. They are read through these accessors so that a sheet published without
 * them keeps its one-section-per-row layout.
 */
type SheetRowShare = { id: string; span: number }

export type SheetRow = {
    id: string
    sections: { section: AdrenalinePresentationSection; span: number }[]
}

/** Consecutive sections sharing a published row, each with its share of the sheet in thirds. */
export function sheetRows(presentation: AdrenalinePresentation): SheetRow[] {
    const rows: SheetRow[] = []
    for (const section of sortedSections(presentation)) {
        const share = (section as { row?: SheetRowShare }).row
        const last = rows[rows.length - 1]
        if (share && last?.id === share.id)
            last.sections.push({ section, span: share.span })
        else
            rows.push({
                id: share?.id ?? '',
                sections: [{ section, span: share?.span ?? 3 }],
            })
    }
    return rows
}

/** Printed rows of a field grid, or none when the presentation does not publish them. */
export function fieldRows(
    block: AdrenalinePresentationBlock
): readonly (readonly string[])[] | undefined {
    return (block as { fieldRows?: readonly (readonly string[])[] }).fieldRows
}

/** Root classes derived from the published appearance. */
export function appearanceClasses(presentation: AdrenalinePresentation) {
    const { appearance } = presentation
    return [
        `adr-pj--variant-${appearance.variant}`,
        `adr-pj--surface-${appearance.surface}`,
        `adr-pj--titles-${appearance.sectionTitles.align}`,
        `adr-pj--values-${appearance.values.align}`,
        `adr-pj--values-${appearance.values.font}`,
        appearance.outerRule ? 'adr-pj--outer-rule' : '',
    ].filter(Boolean)
}

/* The edit sheet a block opens, read from the first document path it shows. */
export const editTargets = {
    nom: 'parameters',
    parametresDuJeu: 'parameters',
    formations: 'formations',
    identite: 'identity',
    caracteristiques: 'characteristics',
    equipement: 'equipment',
    protections: 'protections',
    sante: 'health',
    etatDePartie: 'health',
} as const

export function editTarget(block: AdrenalinePresentationBlock): PjSection {
    const root = block.paths[0]?.split('/')[1] ?? ''
    return (
        (editTargets as Record<string, PjSection | undefined>)[root] ?? 'meta'
    )
}
