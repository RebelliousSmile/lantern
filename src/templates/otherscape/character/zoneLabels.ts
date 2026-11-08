import { OTHERSCAPE_ZONE_LABELS } from 'schema-in-the-mist'

/* The text the sheet prints in its fixed zones (the Upgrades rule, the band
   titles) is not part of the file: the published schema carries it in both
   languages, so a rename upstream reaches the editor and the preview without
   an edit here. */
const labels = OTHERSCAPE_ZONE_LABELS.character

export type ZoneLabelKey = keyof typeof labels

export type ZoneLabelLanguage = 'en' | 'fr'

/** The label in the reader's language; any other language reads the English. */
export function zoneLabel(
    key: ZoneLabelKey,
    language: string | undefined
): string {
    return language === 'fr' ? labels[key].fr : labels[key].en
}

/** What the printed sheet and the exported image say: always English. */
export function printedZoneLabel(key: ZoneLabelKey): string {
    return labels[key].en
}
