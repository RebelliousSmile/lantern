import { useEffect } from 'react'
import { RELATIONS_PRESENTATION } from 'schema-adrenaline/presentation'
import { useAdrenalineDocument } from '../../shared/hooks'
import {
    adrenalineSheetTokens,
    appearanceClasses,
    installAdrenalineFontFaces,
    sheetRows,
    sortedBlocks,
} from '../../shared/presentation'
import {
    PresentationBlock,
    PresentationSection,
} from '../../shared/preview/PresentationBlocks'
import '../../shared/preview/adrenalineTheme.css'
import '../../shared/preview/presentationSheet.css'
import type { RelationsSection } from '../../shared/sections'
import { blankRelations } from '../sample'
import './relationsSheet.css'

type Document = Record<string, unknown>

/*
 * The sheet is laid out by the published presentation: sections, block order and appearance all
 * come from schema-adrenaline, colours and fonts from its pack. It is one page: a node of its own,
 * so it leaves as one image and prints on one sheet. A click on a block opens the section the
 * presentation puts it in, and a click on one entry of a list opens that entry alone.
 */
export function RelationsPreview() {
    const { document, openSection } = useAdrenalineDocument<
        Document,
        RelationsSection
    >('adrenaline.relations', blankRelations() as unknown as Document)
    useEffect(installAdrenalineFontFaces, [])
    const classes = [
        'adr-pj',
        'adr-pj-relations',
        ...appearanceClasses(RELATIONS_PRESENTATION),
    ].join(' ')
    return (
        <div className="adr-pj-pages">
            <article
                className={classes}
                style={adrenalineSheetTokens}
                data-export-page={RELATIONS_PRESENTATION.sheet.id}
            >
                {sheetRows(RELATIONS_PRESENTATION).map((row) =>
                    row.sections.map(({ section }) => (
                        <PresentationSection key={section.id} section={section}>
                            {sortedBlocks(section).map((block) => (
                                <PresentationBlock
                                    block={block}
                                    key={block.id}
                                    source={document}
                                    onOpen={
                                        block.paths.length > 0
                                            ? (zone) =>
                                                  openSection(
                                                      section.id as RelationsSection,
                                                      undefined,
                                                      zone
                                                          ? [block.id, zone]
                                                          : [block.id]
                                                  )
                                            : undefined
                                    }
                                />
                            ))}
                        </PresentationSection>
                    ))
                )}
            </article>
        </div>
    )
}
