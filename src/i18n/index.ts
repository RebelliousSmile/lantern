import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { z } from 'zod'
import {
    DEFAULT_LANGUAGE,
    isSupportedLanguage,
    LANGUAGE_STORAGE_KEY,
    type LanguageCode,
} from './languages'
import enCommon from './locales/en/common'
import frCommon from './locales/fr/common'

export const resources = {
    en: { common: enCommon },
    fr: { common: frCommon },
} as const

function readStoredLanguage(): LanguageCode | null {
    try {
        const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
        return isSupportedLanguage(stored) ? stored : null
    } catch {
        return null
    }
}

function detectLanguage(): LanguageCode {
    if (typeof window === 'undefined') return DEFAULT_LANGUAGE
    const stored = readStoredLanguage()
    if (stored) return stored
    const prefix = window.navigator.language?.slice(0, 2).toLowerCase()
    return isSupportedLanguage(prefix) ? prefix : DEFAULT_LANGUAGE
}

/*
 * Zod keeps its config on `globalThis`, so this one call also localises the messages raised by
 * the published schema packages.
 */
function applyLanguage(code: string) {
    const language = isSupportedLanguage(code) ? code : DEFAULT_LANGUAGE
    z.config(language === 'fr' ? z.locales.fr() : z.locales.en())
    if (typeof document !== 'undefined') {
        document.documentElement.lang = language
    }
}

i18n.on('languageChanged', applyLanguage)

/*
 * Only an explicit choice is stored: persisting the detected language would pin a first visit to
 * the browser locale it happened to have.
 */
export function chooseLanguage(code: LanguageCode) {
    try {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, code)
    } catch {
        // Same silent policy as the workspace store: the choice just won't survive a reload.
    }
    return i18n.changeLanguage(code)
}

const initialLanguage = detectLanguage()
applyLanguage(initialLanguage)

void i18n.use(initReactI18next).init({
    resources,
    lng: initialLanguage,
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: ['en', 'fr'],
    defaultNS: 'common',
    ns: ['common'],
    interpolation: { escapeValue: false },
    // Resources are bundled: initialise synchronously so the first render never suspends.
    initAsync: false,
})

export default i18n
