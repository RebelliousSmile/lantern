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
        <div>
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
