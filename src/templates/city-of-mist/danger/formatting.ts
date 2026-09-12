import type { Spectrum } from './model'

export function formatSpectrumLabel(
    spectrum: Pick<Spectrum, 'name' | 'maximum'> & {
        is_immune?: boolean
    }
) {
    /* `maximum` is optional before the schema applies its default of 1. */
    return `${spectrum.name} ${spectrum.is_immune ? '-' : (spectrum.maximum ?? 1)}`
}
