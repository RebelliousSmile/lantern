export const SUPPORTED_LANGUAGES = [
    { code: 'en', nativeName: 'English' },
    { code: 'fr', nativeName: 'Français' },
] as const

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code']

export const DEFAULT_LANGUAGE: LanguageCode = 'en'

export const LANGUAGE_STORAGE_KEY = 'mist:language:v1'

export function isSupportedLanguage(value: unknown): value is LanguageCode {
    return SUPPORTED_LANGUAGES.some((language) => language.code === value)
}
