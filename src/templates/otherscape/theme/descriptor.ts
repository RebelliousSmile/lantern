import type { StaticTemplateDefinition } from '@/core/templates/types'
import { cloneValue } from '@/utils/clone'
import { themeSections } from './metadata'
import { blankOtherscapeTheme, defaultOtherscapeThemeSheetState, defaultOtherscapeThemeView, type OtherscapeTheme, type OtherscapeThemeSheetState, type OtherscapeThemeViewState } from './model'
import { getSampleOtherscapeTheme } from './sample'

const descriptor: StaticTemplateDefinition<OtherscapeTheme, OtherscapeThemeViewState, OtherscapeThemeSheetState> = {
    id: 'otherscape.theme', gameId: 'otherscape', gameLabel: ':Otherscape', label: 'otherscape:theme.label', implemented: true,
    contractKey: 'mist/otherscape/theme', createBlank: blankOtherscapeTheme, createExample: getSampleOtherscapeTheme,
    createInitialView: () => cloneValue(defaultOtherscapeThemeView), createInitialSheet: () => cloneValue(defaultOtherscapeThemeSheetState),
    getTabTitle: (doc: OtherscapeTheme) => doc.title_tag.trim() || 'Theme', sections: themeSections,
    landing: { newTitle: 'otherscape:theme.newTitle', description: 'otherscape:theme.description' },
}

export default descriptor
