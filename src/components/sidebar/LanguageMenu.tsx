import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenuAction } from '@/components/ui/sidebar'
import { chooseLanguage } from '@/i18n'
import { isSupportedLanguage, SUPPORTED_LANGUAGES } from '@/i18n/languages'
import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'

/* Sits on the Feedback row and opens upward, since that row is the bottom of the sidebar. */
export function LanguageMenu() {
    const { t, i18n } = useTranslation()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarMenuAction title={t('language.choose')}>
                    <Languages />
                    <span className="sr-only">{t('language.choose')}</span>
                </SidebarMenuAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="end">
                <DropdownMenuRadioGroup
                    value={i18n.resolvedLanguage}
                    onValueChange={(code) => {
                        if (isSupportedLanguage(code)) void chooseLanguage(code)
                    }}
                >
                    {SUPPORTED_LANGUAGES.map((language) => (
                        <DropdownMenuRadioItem
                            key={language.code}
                            value={language.code}
                            lang={language.code}
                        >
                            {language.nativeName}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
