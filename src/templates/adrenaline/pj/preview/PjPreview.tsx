import { useEffect } from 'react'
import { PJ_PRESENTATION } from 'schema-adrenaline/presentation'
import { useAdrenalineDocument } from '../../shared/hooks'
import {
    adrenalineSheetTokens,
    appearanceClasses,
    at,
    editTarget,
    hasContent,
    installAdrenalineFontFaces,
    sheetRows,
    sortedBlocks,
} from '../../shared/presentation'
import {
    parametersSubtitle,
    PresentationBlock,
    PresentationBrand,
    PresentationSection,
} from '../../shared/preview/PresentationBlocks'
import '../../shared/preview/adrenalineTheme.css'
import '../../shared/preview/presentationSheet.css'
import type { PjSection } from '../../shared/sections'
import { blankPj } from '../sample'

/* In a section of several columns, a block's note spans all of them instead of hanging under its own column. */
const liftsNotes = (
    section: { layout?: string; columns?: number },
    block: { placement?: { columnSpan?: number } }
) =>
    section.layout === 'columns' &&
    (section.columns ?? 1) > 1 &&
    block.placement !== undefined &&
    (block.placement.columnSpan ?? 1) < (section.columns ?? 1)

type Row = ReturnType<typeof sheetRows>[number]
type Document = Record<string, unknown>
type Open = (
    section: PjSection,
    side?: undefined,
    keys?: readonly string[]
) => void

/** One published row of a page: its sections side by side, a folding section with nothing entered left out. */
function PjRow({
    row,
    document,
    openSection,
}: {
    row: Row
    document: Document
    openSection: Open
}) {
    const { appearance, sheet } = PJ_PRESENTATION
    /* A folding section with nothing entered is not drawn (nor printed): the editor panel offers the way in. */
    const sections = row.sections.filter(
        ({ section }) =>
            !section.collapsible ||
            section.blocks.some((block) =>
                block.paths.some((path) => hasContent(at(document, path)))
            )
    )
    if (sections.length === 0) return null
    const rendered = sections.map(({ section, span }) => (
        <PresentationSection
            key={section.id}
            section={section}
            span={sections.length > 1 ? span : undefined}
        >
            {sortedBlocks(section).map((block) => [
                block.form === 'game-parameters' ? (
                    <PresentationBrand
                        key={`${block.id}-brand`}
                        sheetLabel={sheet.label}
                        subtitle={parametersSubtitle(block, document)}
                        variant={appearance.variant}
                    />
                ) : null,
                <PresentationBlock
                    block={block}
                    withNotes={!liftsNotes(section, block)}
                    key={block.id}
                    source={document}
                    onOpen={
                        block.paths.length > 0
                            ? (zone) =>
                                  openSection(
                                      editTarget(block),
                                      undefined,
                                      zone ? [block.id, zone] : [block.id]
                                  )
                            : undefined
                    }
                />,
            ])}
            {sortedBlocks(section)
                .filter((block) => liftsNotes(section, block))
                .flatMap((block) =>
                    (block.notes ?? []).map((note) => (
                        <p
                            className="adr-pj__note adr-pj__block-note"
                            key={`${block.id}:${note}`}
                        >
                            {note}
                        </p>
                    ))
                )}
        </PresentationSection>
    ))
    return sections.length > 1 ? (
        <div className={`adr-pj__row adr-pj--row-${row.id}`}>{rendered}</div>
    ) : (
        <>{rendered}</>
    )
}

/*
 * The sheet is laid out by the published presentation: sections, block order, placements,
 * decorations and appearance all come from schema-adrenaline, colours and fonts from its pack. It
 * is drawn page by page as the presentation declares the pages: each page is a node of its own, so
 * it leaves as one image and prints on one sheet.
 */
export function PjPreview() {
    const { document, openSection } = useAdrenalineDocument<
        Document,
        PjSection
    >('adrenaline.pj', blankPj() as unknown as Document)
    useEffect(installAdrenalineFontFaces, [])
    const classes = ['adr-pj', ...appearanceClasses(PJ_PRESENTATION)].join(' ')
    const rows = sheetRows(PJ_PRESENTATION)
    return (
        <div className="adr-pj-pages">
            {PJ_PRESENTATION.pages.map((page) => {
                const ids = page.sections as readonly string[]
                return (
                    <article
                        key={page.id}
                        className={classes}
                        style={adrenalineSheetTokens}
                        data-export-page={page.id}
                    >
                        {rows
                            .map((row) => ({
                                ...row,
                                sections: row.sections.filter(({ section }) =>
                                    ids.includes(section.id)
                                ),
                            }))
                            .filter(({ sections }) => sections.length > 0)
                            .map((row) => (
                                <PjRow
                                    key={row.sections[0].section.id}
                                    row={row}
                                    document={document}
                                    openSection={openSection as Open}
                                />
                            ))}
                    </article>
                )
            })}
        </div>
    )
}
