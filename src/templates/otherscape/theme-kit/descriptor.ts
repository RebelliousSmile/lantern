import type { StaticTemplateDefinition } from '@/core/templates/types'
import { cloneValue } from '@/utils/clone'
import { themeKitSections } from './metadata'
import { blankOtherscapeThemeKit, defaultOtherscapeThemeKitSheetState, defaultOtherscapeThemeKitView, type OtherscapeThemeKit, type OtherscapeThemeKitSheetState, type OtherscapeThemeKitViewState } from './model'
import { getSampleOtherscapeThemeKit } from './sample'

const descriptor: StaticTemplateDefinition<OtherscapeThemeKit, OtherscapeThemeKitViewState, OtherscapeThemeKitSheetState> = {
    id: 'otherscape.themeKit', gameId: 'otherscape', gameLabel: ':Otherscape', label: 'otherscape:themeKit.label', implemented: true,
    contractKey: 'mist/otherscape/theme-kit', createBlank: blankOtherscapeThemeKit, createExample: getSampleOtherscapeThemeKit,
    createInitialView: () => cloneValue(defaultOtherscapeThemeKitView), createInitialSheet: () => cloneValue(defaultOtherscapeThemeKitSheetState),
    getTabTitle: (doc: OtherscapeThemeKit) => doc.title_tag.trim() || 'Theme Kit', sections: themeKitSections,
    landing: { newTitle: 'otherscape:themeKit.newTitle', description: 'otherscape:themeKit.description' },
}

export default descriptor
