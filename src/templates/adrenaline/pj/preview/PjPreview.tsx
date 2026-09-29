import { useEffect } from 'react'
import { PJ_PRESENTATION } from 'schema-adrenaline/presentation'
import { useAdrenalineDocument } from '../../shared/hooks'
import {
    adrenalineSheetTokens,
    appearanceClasses,
    editTarget,
    installAdrenalineFontFaces,
    sortedBlocks,
    sortedSections,
} from '../../shared/presentation'
import {
    PresentationBlock,
    PresentationBrand,
    PresentationSection,
} from '../../shared/preview/PresentationBlocks'
import '../../shared/preview/adrenalineTheme.css'
import '../../shared/preview/presentationSheet.css'
import { blankPj } from '../sample'

/*
 * The sheet is laid out by the published presentation: sections, block order, placements,
 * decorations and appearance all come from schema-adrenaline, colours and fonts from its pack.
 */
export function PjPreview() {
    const { document, openSection } = useAdrenalineDocument(
        'adrenaline.pj',
        blankPj() as unknown as Record<string, unknown>
    )
    const { appearance, sheet } = PJ_PRESENTATION
    useEffect(installAdrenalineFontFaces, [])
    return (
        <article
            className={['adr-pj', ...appearanceClasses(PJ_PRESENTATION)].join(
                ' '
            )}
            style={adrenalineSheetTokens}
        >
            {sortedSections(PJ_PRESENTATION).map((section) => (
                <PresentationSection key={section.id} section={section}>
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
            ))}
        </article>
    )
}
