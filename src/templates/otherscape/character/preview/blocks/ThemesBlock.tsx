import { ThemeScopeProvider } from '../../../theme/hooks'
import { ThemeCard } from '../../../theme/preview/ThemePreview'
import {
    isThemeLimitReached,
    useCharacterThemeScope,
    useOtherscapeCharacterSheetStore,
    useOtherscapeCharacterStore,
    useOtherscapeCharacterViewStore,
} from '../../hooks'
import { PREVIEW_WIDTH_FOUR_COLUMNS } from '../../model'

/* One of the sheet's four theme cards. The card is the theme's own, drawn by
   the theme's blocks; the scope points them at this character's theme. */
function ThemeSlot({ index }: { index: number }) {
    const scope = useCharacterThemeScope(index)
    if (!scope) return null

    return (
        <ThemeScopeProvider value={scope}>
            <ThemeCard />
        </ThemeScopeProvider>
    )
}

/* The columns are decided here, from the preview width, rather than by a
   media query: the exported image is rendered at the same width and has to
   come out with the same layout. */
export default function ThemesBlock() {
    const { otherscapeCharacter } = useOtherscapeCharacterStore()
    const { previewWidth } = useOtherscapeCharacterViewStore()
    const { openSheet } = useOtherscapeCharacterSheetStore()

    const columns = previewWidth >= PREVIEW_WIDTH_FOUR_COLUMNS ? 4 : 2

    return (
        <div
            className="os-character-themes"
            style={{
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
        >
            {otherscapeCharacter.themes.map((_, index) => (
                <ThemeSlot key={index} index={index} />
            ))}
            {!isThemeLimitReached(otherscapeCharacter) && (
                <button
                    type="button"
                    className="os-character-themes__add"
                    onClick={() => openSheet({ kind: 'themes', mode: 'edit' })}
                >
                    add a theme
                </button>
            )}
        </div>
    )
}
