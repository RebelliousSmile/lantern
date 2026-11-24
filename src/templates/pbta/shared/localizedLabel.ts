import i18n from '@/i18n'

/** A label a pack prints in both languages, or one it never translated. */
export type PublishedLabel = string | { readonly fr: string; readonly en: string }

/**
 * A published label in the reader's language: French in a French interface, English otherwise. The
 * language is read on each call, so a caller that renders again follows a change of language.
 */
export const localizedLabel = (
    label: PublishedLabel,
    language: string | undefined = i18n.language
): string => {
    if (typeof label === 'string') return label
    return language?.startsWith('fr') ? label.fr : label.en
}

/**
 * The heading of an editorial region: the player's own words win, but a heading that is only the
 * published label of the region, in either language, is read in the interface language.
 */
export const localizedHeading = (
    label: PublishedLabel,
    typed: string,
    language: string | undefined = i18n.language
): string => {
    if (typeof label === 'string') return typed
    const folded = typed.trim().toLowerCase()
    return folded === label.fr.toLowerCase() || folded === label.en.toLowerCase()
        ? localizedLabel(label, language)
        : typed
}
