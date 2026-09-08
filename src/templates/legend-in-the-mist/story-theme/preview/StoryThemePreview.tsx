import { cn } from '@/utils/cn'
import {
    useLegendInTheMistStoryThemeStore,
    useLegendInTheMistStoryThemeViewStore,
} from '../hooks'
import HeaderBlock from './blocks/HeaderBlock'
import MetaFooterBlock from './blocks/MetaFooterBlock'
import QuestBlock from './blocks/QuestBlock'
import TagsBlock from './blocks/TagsBlock'
import { SectionGate, SectionGroupGate } from './components/SectionGate'
import './storyThemeTheme.css'

export function StoryThemePreview() {
    const { legendInTheMistStoryTheme } = useLegendInTheMistStoryThemeStore()
    const ui = useLegendInTheMistStoryThemeViewStore()

    return (
        // `litm-doc` scopes this game's stylesheet. Legend in the Mist and
        // :Otherscape print several documents of the same name and share class
        // names for them (`theme-kit-sheet`, `section-title`, `meta-footer`),
        // and every sheet is loaded at once, so without a per-game root the two
        // games' rules land on each other's cards.
        <div className="litm-doc">
            <div
                className={cn(
                    'story-theme-sheet',
                    `story-theme-sheet--${legendInTheMistStoryTheme.level}`,
                    ui.background === 'parchment' ? 'bg-parchment' : 'bg-plain'
                )}
                style={{
                    transform: `scale(${ui.zoom})`,
                    transformOrigin: 'top center',
                }}
            >
                <div className="story-theme-sheet__inner">
                    <HeaderBlock />

                    <SectionGroupGate ids={['powerTags', 'weaknessTags']}>
                        <TagsBlock />
                    </SectionGroupGate>

                    <SectionGate id="quest">
                        <div className="mt-3 w-full">
                            <QuestBlock />
                        </div>
                    </SectionGate>
                </div>
            </div>

            {/* Meta footer sits under the card, on the page rather than on the sheet */}
            <SectionGate id="meta">
                <MetaFooterBlock />
            </SectionGate>
        </div>
    )
}
