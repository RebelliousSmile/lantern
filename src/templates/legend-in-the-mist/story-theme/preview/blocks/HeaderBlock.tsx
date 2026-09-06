import {
    useLegendInTheMistStoryThemeSheetStore,
    useLegendInTheMistStoryThemeStore,
    type ThemeLevel,
} from '../../hooks'
import { ClickableSection } from '../components/Clickable'
import { SectionGate } from '../components/SectionGate'

const LEVEL_ICON: Record<ThemeLevel, string> = {
    origin: 'ico-might-origin',
    adventure: 'ico-might-adventure',
    greatness: 'ico-might-greatness',
}

const LEVEL_LABEL: Record<ThemeLevel, string> = {
    origin: 'Origin',
    adventure: 'Adventure',
    greatness: 'Greatness',
}

export default function HeaderBlock() {
    const { legendInTheMistStoryTheme } = useLegendInTheMistStoryThemeStore()
    const { openSheet } = useLegendInTheMistStoryThemeSheetStore()

    const level = legendInTheMistStoryTheme.level

    return (
        <>
            {/* Level badge, in the corner the card art leaves for it */}
            <div
                className="story-theme-level"
                title={`${LEVEL_LABEL[level]} theme`}
            >
                <span
                    className={`ico ${LEVEL_ICON[level]}`}
                    aria-label={`${LEVEL_LABEL[level]} theme`}
                    role="img"
                />
            </div>

            <SectionGate id="category">
                <ClickableSection
                    onClick={() => openSheet({ kind: 'basic', mode: 'edit' })}
                    ariaLabel="Edit category"
                >
                    <div className="story-theme-category">
                        {legendInTheMistStoryTheme.category || (
                            <span className="underline decoration-dotted cursor-pointer">
                                add a category
                            </span>
                        )}
                    </div>
                </ClickableSection>
            </SectionGate>

            <ClickableSection
                onClick={() => openSheet({ kind: 'basic', mode: 'edit' })}
                ariaLabel="Edit title tag and level"
            >
                <div className="story-theme-title-box">
                    <span className="story-theme-title">
                        {legendInTheMistStoryTheme.title_tag ||
                            'Untitled Story Theme'}
                    </span>
                </div>
            </ClickableSection>
        </>
    )
}
