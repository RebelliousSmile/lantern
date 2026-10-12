import type { TranslationKey } from '@/i18n/text'

export type Entry = Record<string, unknown>
export const record = (value: unknown): Entry =>
    value && typeof value === 'object' && !Array.isArray(value)
        ? (value as Entry)
        : {}
export const records = (value: unknown): Entry[] =>
    Array.isArray(value)
        ? value.filter(
              (entry): entry is Entry =>
                  Boolean(entry) &&
                  typeof entry === 'object' &&
                  !Array.isArray(entry)
          )
        : []
export const strings = (value: unknown): string[] =>
    Array.isArray(value)
        ? value.filter((entry): entry is string => typeof entry === 'string')
        : []

export const creatureFields: [string, TranslationKey][] = [
    ['nom', 'fields.name'],
    ['typeDeCorps', 'adrenaline:monstre.form.bodyType'],
    ['instinct', 'adrenaline:monstre.form.instinct'],
    ['typeInfecte', 'adrenaline:monstre.form.infectedType'],
]
