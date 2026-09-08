import { cn } from '@/utils/cn'
import { SectionGate } from '../../shared/preview/components/SectionGate'
import {
    groupShouldShow,
    shouldShow,
    useOtherscapeThemeKitStore,
    useOtherscapeThemeKitViewStore,
} from '../hooks'
import HeaderBlock from './blocks/HeaderBlock'
import MetaFooterBlock from './blocks/MetaFooterBlock'
import QuestBlock from './blocks/QuestBlock'
import TagsBlock from './blocks/TagsBlock'
import './themeKitTheme.css'

export function ThemeKitPreview() {
    const ui = useOtherscapeThemeKitViewStore()
    // Read through the store so the card re-renders on every edit, even where
    // the blocks below read the document themselves.
    const { otherscapeThemeKit } = useOtherscapeThemeKitStore()

    return (
        <div>
            <div
                className={cn(
                    'theme-kit-sheet os-card',
                    `os-card--${otherscapeThemeKit.theme_type}`,
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

                <div className="theme-kit-sheet__body">
                    <SectionGate
                        show={groupShouldShow(
                            otherscapeThemeKit,
                            ['powerTags', 'weaknessTags'],
                            ui
                        )}
                    >
                        <TagsBlock />
                    </SectionGate>

                    <SectionGate
                        show={shouldShow(otherscapeThemeKit, 'quest', ui)}
                    >
                        <QuestBlock />
                    </SectionGate>
                </div>
            </div>

            {/* Meta footer sits under the card, on the page rather than on the
                card frame, so the exported image stays the printed object. */}
            <SectionGate show={shouldShow(otherscapeThemeKit, 'meta', ui)}>
                <MetaFooterBlock />
            </SectionGate>
        </div>
    )
}
