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
        // `litm-doc` scopes this game's stylesheet. Legend in the Mist and
        // :Otherscape print several documents of the same name and share class
        // names for them (`theme-kit-sheet`, `section-title`, `meta-footer`),
        // and every sheet is loaded at once, so without a per-game root the two
        // games' rules land on each other's cards.
        <div className="litm-doc">
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
