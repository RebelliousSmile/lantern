import { parseToken } from '@/utils/tags'
import type { LegendInTheMistJourney } from './model'

// Tags are stored bare: the braces are display syntax added when the sheet is
// rendered, so they should not reach the document. None of this blocks an
// import; it only flags content that will not render the way its author
// expects.
function collectTagWarnings(tags: string[], warnings: string[]) {
    const braced = tags.filter((tag) => /^\{[\s\S]*\}$/.test(tag.trim()))
    if (braced.length > 0) {
        warnings.push(
            `Tags written with braces: ${braced.join(', ')}. They are added when the sheet is rendered, so the braces will show up twice.`
        )
    }

    const statusLike = tags.filter((tag) => {
        const parsed = parseToken(tag)
        return parsed?.kind === 'status' || parsed?.kind === 'limit'
    })
    if (statusLike.length > 0) {
        warnings.push(
            `Tags that read as a status or a limit: ${statusLike.join(', ')}. A trailing "-<n>" or ":<n>" makes a tag render as a tracker rather than as a tag. A status the Journey hands out belongs in its Consequences.`
        )
    }
}

export function computeLegendInTheMistJourneyWarnings(
    legendInTheMistJourney: LegendInTheMistJourney
): string[] {
    const warnings: string[] = []

    collectTagWarnings(legendInTheMistJourney.tags, warnings)

    // The schema demands at least one Consequence per vignette, so this is the
    // one warning that precedes a hard failure rather than a rendering
    // surprise: name the vignette here, while the author can still see which
    // one it is, instead of letting the export throw a path like
    // "vignettes.1.consequences".
    const emptyVignettes = legendInTheMistJourney.vignettes
        .filter((vignette) => !vignette.consequences.length)
        .map((vignette) => vignette.name.trim() || 'an unnamed vignette')
    if (emptyVignettes.length > 0) {
        warnings.push(
            `Vignettes with no Consequence: ${emptyVignettes.join(', ')}. A vignette carries at least one, and the file cannot be exported until each of these does.`
        )
    }

    if (
        !legendInTheMistJourney.consequences.length &&
        !legendInTheMistJourney.vignettes.length
    ) {
        warnings.push(
            'This Journey costs nothing anywhere along it: no general Consequence and no vignette to draw one from.'
        )
    }

    if (!legendInTheMistJourney.tags.length) {
        warnings.push(
            'This Journey offers no tag, so there is nothing for a Hero to invoke while crossing it.'
        )
    }

    return warnings
}
