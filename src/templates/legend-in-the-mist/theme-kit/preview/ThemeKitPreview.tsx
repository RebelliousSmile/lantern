import { cn } from '@/utils/cn'
import {
    useLegendInTheMistThemeKitStore,
    useLegendInTheMistThemeKitViewStore,
} from '../hooks'
import HeaderBlock from './blocks/HeaderBlock'
import ImprovementsBlock from './blocks/ImprovementsBlock'
import MetaFooterBlock from './blocks/MetaFooterBlock'
import QuestBlock from './blocks/QuestBlock'
import TagsBlock from './blocks/TagsBlock'
import { SectionGate, SectionGroupGate } from './components/SectionGate'
import './themeKitTheme.css'

export function ThemeKitPreview() {
    const ui = useLegendInTheMistThemeKitViewStore()
    // Read through the store so the card re-renders on every edit, even where
    // the blocks below read the document themselves.
    useLegendInTheMistThemeKitStore()

    return (
        <div>
            <div
                className={cn(
                    'theme-kit-sheet',
                    ui.background === 'parchment' ? 'bg-parchment' : 'bg-plain'
                )}
                style={{
                    transform: `scale(${ui.zoom})`,
                    transformOrigin: 'top center',
                }}
            >
                {/* The bar and the name sit outside the padded body: the bar is
                    the card's top edge and runs the full width. */}
                <HeaderBlock />

                <div className="theme-kit-sheet__body">
                    <SectionGroupGate ids={['powerTags', 'weaknessTags']}>
                        <TagsBlock />
                    </SectionGroupGate>

                    <SectionGate id="quest">
                        <QuestBlock />
                    </SectionGate>

                    <SectionGate id="improvements">
                        <ImprovementsBlock />
                    </SectionGate>
                </div>
            </div>

            {/* Meta footer sits under the card, on the page rather than on the
                card frame, so the exported image stays the printed object. */}
            <SectionGate id="meta">
                <MetaFooterBlock />
            </SectionGate>
        </div>
    )
}
