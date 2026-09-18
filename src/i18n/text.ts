import type { ParseKeys } from 'i18next'
import { useTranslation } from 'react-i18next'
import i18n from './index'
import { NAMESPACES } from './namespaces'

/** Any key of any namespace: `common` keys bare, the others prefixed (`legend:challenge.label`). */
export type TranslationKey = ParseKeys<typeof NAMESPACES>

export type TranslationValues = Record<string, string | number>

/**
 * Text a template declares for the shell. A key in the usual case; `{ key, values }` when a
 * factory shares one sentence across games; `{ text }` only for labels that arrive at runtime from
 * a published package and therefore cannot be keyed ahead of time.
 */
export type UiText =
    | TranslationKey
    | { key: TranslationKey; values: TranslationValues }
    | { text: string }

/*
 * Keys are checked where they are declared, so the lookup itself takes a plain string: handing
 * the union of every key to i18next's overloaded `t` costs far more type-checking than it buys.
 */
const lookup = i18n.t as unknown as (
    key: string,
    options?: TranslationValues & { lng?: string }
) => string

export function translate(
    value: UiText,
    values?: TranslationValues,
    language?: string
): string {
    if (typeof value !== 'string') {
        if ('text' in value) return value.text
        return translate(value.key, { ...value.values, ...values }, language)
    }
    return lookup(value, language ? { ...values, lng: language } : values)
}

/**
 * English whatever the UI language: for text that ends up in a file or on a printed sheet
 * (export file names, labels a preview reads), which must not change with the reader's locale.
 */
export function translateEnglish(value: UiText, values?: TranslationValues) {
    return translate(value, values, 'en')
}

/** `translate` bound to the component's render, so it re-renders on a language change. */
export function useUiText() {
    useTranslation()
    return translate
}
