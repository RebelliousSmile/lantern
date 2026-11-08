import { Button } from '@/components/ui/button'
import { useUiText, type TranslationKey } from '@/i18n/text'
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from 'lucide-react'
import type { ThemeType } from '../../../theme/model'
import {
    isThemeLimitReached,
    useOtherscapeCharacterSheetStore,
    useOtherscapeCharacterStore,
} from '../../hooks'
import { CHARACTER_THEME_TYPES } from '../../model'

/* A Crew theme belongs to the crew, so a character offers the other three. */
const ADD_KEY: Partial<Record<ThemeType, TranslationKey>> = {
    self: 'otherscape:forms.character.themes.addType.self',
    mythos: 'otherscape:forms.character.themes.addType.mythos',
    noise: 'otherscape:forms.character.themes.addType.noise',
}

const TYPE_KEY: Record<ThemeType, TranslationKey> = {
    self: 'otherscape:forms.theme.themeType.self',
    mythos: 'otherscape:forms.theme.themeType.mythos',
    noise: 'otherscape:forms.theme.themeType.noise',
    crew: 'otherscape:forms.theme.themeType.crew',
}

/* The list of the character's themes: the place to add one (while there are
   fewer than four), reorder them, remove one, or jump into a theme's own
   fields. Adding is refused in the store as well, so the limit holds even if
   this control is bypassed. */
export default function ThemesForm() {
    const text = useUiText()
    const { otherscapeCharacter, addTheme, removeThemeAt, moveTheme } =
        useOtherscapeCharacterStore()
    const { openSheet } = useOtherscapeCharacterSheetStore()

    const themes = otherscapeCharacter.themes
    const limitReached = isThemeLimitReached(otherscapeCharacter)

    return (
        <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
                {text('otherscape:forms.character.themes.hint')}
            </p>

            {themes.length === 0 && (
                <p className="text-sm text-muted-foreground">
                    {text('otherscape:forms.character.themes.empty')}
                </p>
            )}

            <ul className="space-y-2">
                {themes.map((theme, index) => {
                    const title =
                        theme.title_tag.trim() ||
                        text('otherscape:forms.character.themes.itemTitle', {
                            position: index + 1,
                        })
                    return (
                        <li
                            key={index}
                            className="flex items-center gap-1.5 rounded-md border bg-card px-2 py-1.5"
                        >
                            <span className="min-w-0 flex-1 truncate text-sm">
                                {title}
                                <span className="ml-2 text-xs text-muted-foreground">
                                    {text(TYPE_KEY[theme.theme_type])}
                                </span>
                            </span>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-7"
                                aria-label={text(
                                    'otherscape:forms.character.themes.editAriaLabel',
                                    { title }
                                )}
                                onClick={() =>
                                    openSheet({
                                        kind: 'theme',
                                        index,
                                        zone: { kind: 'basic', mode: 'edit' },
                                    })
                                }
                            >
                                <Pencil className="size-3.5" aria-hidden />
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-7"
                                disabled={index === 0}
                                aria-label={text(
                                    'otherscape:forms.character.themes.moveUpAriaLabel',
                                    { title }
                                )}
                                onClick={() => moveTheme(index, index - 1)}
                            >
                                <ChevronUp className="size-3.5" aria-hidden />
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-7"
                                disabled={index === themes.length - 1}
                                aria-label={text(
                                    'otherscape:forms.character.themes.moveDownAriaLabel',
                                    { title }
                                )}
                                onClick={() => moveTheme(index, index + 1)}
                            >
                                <ChevronDown className="size-3.5" aria-hidden />
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-7"
                                aria-label={text(
                                    'otherscape:forms.character.themes.removeAriaLabel',
                                    { title }
                                )}
                                onClick={() => removeThemeAt(index)}
                            >
                                <Trash2 className="size-3.5" aria-hidden />
                            </Button>
                        </li>
                    )
                })}
            </ul>

            <div className="flex flex-wrap gap-2">
                {CHARACTER_THEME_TYPES.map((type) => {
                    const label = ADD_KEY[type]
                    if (!label) return null
                    return (
                        <Button
                            key={type}
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="h-8 text-xs"
                            disabled={limitReached}
                            onClick={() => {
                                if (addTheme(type)) {
                                    openSheet({
                                        kind: 'theme',
                                        index: themes.length,
                                        zone: { kind: 'basic', mode: 'edit' },
                                    })
                                }
                            }}
                        >
                            <Plus className="size-3.5" aria-hidden />
                            {text(label)}
                        </Button>
                    )
                })}
            </div>

            {limitReached && (
                <p
                    role="status"
                    className="text-xs text-muted-foreground"
                    data-testid="os-character-theme-limit"
                >
                    {text('otherscape:forms.character.themes.limitReached')}
                </p>
            )}
        </div>
    )
}
