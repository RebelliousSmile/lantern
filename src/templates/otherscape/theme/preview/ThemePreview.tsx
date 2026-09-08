import { cn } from '@/utils/cn'
import { SectionGate } from '../../shared/preview/components/SectionGate'
import {
    groupShouldShow,
    shouldShow,
    useOtherscapeThemeStore,
    useOtherscapeThemeViewStore,
} from '../hooks'
import HeaderBlock from './blocks/HeaderBlock'
import MetaFooterBlock from './blocks/MetaFooterBlock'
import QuestBlock from './blocks/QuestBlock'
import TagsBlock from './blocks/TagsBlock'
import TracksBlock from './blocks/TracksBlock'
import './themeTheme.css'

export function ThemePreview() {
    const ui = useOtherscapeThemeViewStore()
    // Read through the store so the card re-renders on every edit, even where
    // the blocks below read the document themselves.
    const { otherscapeTheme } = useOtherscapeThemeStore()

    return (
        <div>
            <div
                className={cn(
                    'theme-sheet os-card',
                    `os-card--${otherscapeTheme.theme_type}`,
                    ui.background === 'plain' ? 'bg-plain' : 'bg-neon'
                )}
                style={{
                    transform: `scale(${ui.zoom})`,
                    transformOrigin: 'top center',
                }}
            >
                {/* The band, the legend and the title tag sit outside the padded
                    body: they are the card's top edge and run its full width. */}
                <HeaderBlock />

                <div className="theme-sheet__body">
                    <SectionGate
                        show={groupShouldShow(
                            otherscapeTheme,
                            ['powerTags', 'weaknessTags'],
                            ui
                        )}
                    >
                        <TagsBlock />
                    </SectionGate>

                    <SectionGate
                        show={shouldShow(otherscapeTheme, 'quest', ui)}
                    >
                        <QuestBlock />
                    </SectionGate>

                    <SectionGate
                        show={shouldShow(otherscapeTheme, 'tracks', ui)}
                    >
                        <TracksBlock />
                    </SectionGate>
                </div>
            </div>

            {/* Meta footer sits under the card, on the page rather than on the
                card frame, so the exported image stays the printed object. */}
            <SectionGate show={shouldShow(otherscapeTheme, 'meta', ui)}>
                <MetaFooterBlock />
            </SectionGate>
        </div>
    )
}
