import { ClickableSection } from '../../../shared/preview/components/Clickable'
import type { ThemeType } from '../../schema'

/* The banner is the first thing the page says, and it says the family rather
   than the name: a player picks a themebook by its type before reading a word
   of it. All four types print, including `crew`, which the books head the same
   way even though it carries no motivation. */
const BANNER: Record<ThemeType, string> = {
    mythos: 'Mythos Themebook',
    logos: 'Logos Themebook',
    extra: 'Extra Themebook',
    crew: 'Crew Themebook',
}

type Props = {
    themeType: ThemeType
    name: string
    keywords: string[]
    onClick: () => void
}

export default function ThemebookHeader({
    themeType,
    name,
    keywords,
    onClick,
}: Props) {
    return (
        <header className="city-kit-header">
            <ClickableSection
                onClick={onClick}
                ariaLabel="Edit themebook identity"
            >
                <div className="city-kit-banner">{BANNER[themeType]}</div>
                <h2 className="city-kit-title">
                    {name || (
                        <span className="city-kit-placeholder">
                            Untitled Themebook
                        </span>
                    )}
                </h2>
                <div className="city-kit-keywords">
                    {keywords.length ? (
                        keywords.join(' · ')
                    ) : (
                        <span className="city-kit-placeholder">
                            add keywords
                        </span>
                    )}
                </div>
            </ClickableSection>
        </header>
    )
}
