import type { ImportWarning } from '@/core/templates/types'
import { translate } from '@/i18n/text'
import { parseToken } from '@/utils/tags'
import type { LegendInTheMistJourney } from './model'

// Tags are stored bare: the braces are display syntax added when the sheet is
// rendered, so they should not reach the document. None of this blocks an
// import; it only flags content that will not render the way its author
// expects.
function collectTagWarnings(tags: string[], warnings: ImportWarning[]) {
    const braced = tags.filter((tag) => /^\{[\s\S]*\}$/.test(tag.trim()))
    if (braced.length > 0) {
        warnings.push({
            key: 'legend:journey.warnings.bracedTags',
            values: { tags: braced.join(', ') },
        })
    }

    const statusLike = tags.filter((tag) => {
        const parsed = parseToken(tag)
        return parsed?.kind === 'status' || parsed?.kind === 'limit'
    })
    if (statusLike.length > 0) {
        warnings.push({
            key: 'legend:journey.warnings.statusLikeTags',
            values: { tags: statusLike.join(', ') },
        })
    }
}

export function computeLegendInTheMistJourneyWarnings(
    legendInTheMistJourney: LegendInTheMistJourney
): ImportWarning[] {
    const warnings: ImportWarning[] = []

    collectTagWarnings(legendInTheMistJourney.tags, warnings)

    // The schema demands at least one Consequence per vignette, so this is the
    // one warning that precedes a hard failure rather than a rendering
    // surprise: name the vignette here, while the author can still see which
    // one it is, instead of letting the export throw a path like
    // "vignettes.1.consequences".
    // The placeholder for a nameless vignette is worded in the language active
    // when the warnings are computed, since values are plain strings.
    const emptyVignettes = legendInTheMistJourney.vignettes
        .filter((vignette) => !vignette.consequences.length)
        .map(
            (vignette) =>
                vignette.name.trim() ||
                translate('legend:journey.warnings.unnamedVignette')
        )
    if (emptyVignettes.length > 0) {
        warnings.push({
            key: 'legend:journey.warnings.vignettesWithoutConsequence',
            values: { vignettes: emptyVignettes.join(', ') },
        })
    }

    if (
        !legendInTheMistJourney.consequences.length &&
        !legendInTheMistJourney.vignettes.length
    ) {
        warnings.push({ key: 'legend:journey.warnings.noConsequence' })
    }

    if (!legendInTheMistJourney.tags.length) {
        warnings.push({ key: 'legend:journey.warnings.noTags' })
    }

    return warnings
}
