import { useEffect } from 'react'
import { PJ_PRESENTATION } from 'schema-adrenaline/presentation'
import { useAdrenalineDocument } from '../../shared/hooks'
import {
    adrenalineSheetTokens,
    appearanceClasses,
    editTarget,
    installAdrenalineFontFaces,
    sheetRows,
    sortedBlocks,
} from '../../shared/presentation'
import {
    PresentationBlock,
    PresentationBrand,
    PresentationSection,
} from '../../shared/preview/PresentationBlocks'
import '../../shared/preview/adrenalineTheme.css'
import '../../shared/preview/presentationSheet.css'
import type { PjSection } from '../../shared/sections'
import { blankPj } from '../sample'

/*
 * The sheet is laid out by the published presentation: sections, block order, placements,
 * decorations and appearance all come from schema-adrenaline, colours and fonts from its pack.
 */
export function PjPreview() {
    const { document, openSection } = useAdrenalineDocument<
        Record<string, unknown>,
        PjSection
    >('adrenaline.pj', blankPj() as unknown as Record<string, unknown>)
    const { appearance, sheet } = PJ_PRESENTATION
    useEffect(installAdrenalineFontFaces, [])
    return (
        <article
            className={['adr-pj', ...appearanceClasses(PJ_PRESENTATION)].join(
                ' '
            )}
            style={adrenalineSheetTokens}
        >
            {sheetRows(PJ_PRESENTATION).map(({ id, sections }) => {
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
                                    variant={appearance.variant}
                                />
                            ) : null,
                            <PresentationBlock
                                block={block}
                                key={block.id}
                                source={document}
                                onOpen={() => openSection(editTarget(block))}
                            />,
                        ])}
                    </PresentationSection>
                ))
                return sections.length > 1 ? (
                    <div className={`adr-pj__row adr-pj--row-${id}`} key={id}>
                        {rendered}
                    </div>
                ) : (
                    rendered
                )
            })}
        </article>
    )
}
