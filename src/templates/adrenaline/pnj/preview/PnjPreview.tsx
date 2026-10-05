import { useEffect } from 'react'
import {
    PNJ_PRESENTATION,
    type AdrenalinePresentation,
    type AdrenalinePresentationBlock,
} from 'schema-adrenaline/presentation'
import { useAdrenalineDocument } from '../../shared/hooks'
import {
    adrenalineSheetTokens,
    installAdrenalineFontFaces,
    sortedSections,
} from '../../shared/presentation'
import {
    CompactSection,
    compactCardClasses,
} from '../../shared/preview/CompactCard'
import '../../shared/preview/compactCard.css'
import type { PnjSection } from '../../shared/sections'
import { blankPnj } from '../sample'

const PRESENTATION: AdrenalinePresentation = PNJ_PRESENTATION

/* The edit sheet a block opens, read from the first document path it shows. */
const editTargets: Record<string, PnjSection | undefined> = {
    nom: 'basic',
    categorie: 'basic',
    niveauDeDanger: 'basic',
    description: 'basic',
    caracteristiques: 'statistics',
    sante: 'health',
    pistes: 'health',
    etatDePartie: 'health',
    protections: 'protections',
    formations: 'formations',
    competences: 'formations',
    equipement: 'equipment',
    narratif: 'narrative',
}

function editTarget(block: AdrenalinePresentationBlock): PnjSection {
    return editTargets[block.paths[0]?.split('/')[1] ?? ''] ?? 'meta'
}

/*
 * The card is laid out by the published presentation: sections, block order, forms and banner
 * category all come from schema-adrenaline, colours and fonts from its pack.
 */
export function PnjPreview() {
    const { document, openSection } = useAdrenalineDocument<
        Record<string, unknown>,
        PnjSection
    >('adrenaline.pnj', blankPnj() as unknown as Record<string, unknown>)
    useEffect(installAdrenalineFontFaces, [])
    return (
        <article
            className={compactCardClasses(PRESENTATION, document)}
            style={adrenalineSheetTokens}
        >
            {sortedSections(PRESENTATION).map((section) => (
                <CompactSection
                    key={section.id}
                    presentation={PRESENTATION}
                    section={section}
                    source={document}
                    onOpen={(block) => openSection(editTarget(block))}
                />
            ))}
        </article>
    )
}
