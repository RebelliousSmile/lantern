import { Button } from '@/components/ui/button'
import { useUiText } from '@/i18n/text'
import { Trash2 } from 'lucide-react'
import { ThemeZoneForm } from '../../../theme/editor/ThemeEditorPanel'
import { ThemeScopeProvider } from '../../../theme/hooks'
import type { SheetTarget as ThemeSheetTarget } from '../../../theme/model'
import {
    useCharacterThemeScope,
    useOtherscapeCharacterSheetStore,
    useOtherscapeCharacterStore,
} from '../../hooks'

/* One zone of one of the character's themes. The theme's own form runs
   unchanged: the scope hands it `themes[index]` instead of a theme tab. */
export default function ThemeZone({
    index,
    zone,
}: {
    index: number
    zone: ThemeSheetTarget
}) {
    const text = useUiText()
    const scope = useCharacterThemeScope(index)
    const { removeThemeAt } = useOtherscapeCharacterStore()
    const { closeSheet } = useOtherscapeCharacterSheetStore()

    if (!scope) {
        return (
            <p className="text-sm text-muted-foreground">
                {text('otherscape:forms.character.themes.notFound')}
            </p>
        )
    }

    return (
        <ThemeScopeProvider value={scope}>
            <div className="space-y-4">
                <ThemeZoneForm target={zone} />
                {zone.kind === 'basic' && (
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => {
                            removeThemeAt(index)
                            closeSheet()
                        }}
                    >
                        <Trash2 className="size-3.5" aria-hidden />
                        {text('otherscape:forms.character.themes.removeButton')}
                    </Button>
                )}
            </div>
        </ThemeScopeProvider>
    )
}
