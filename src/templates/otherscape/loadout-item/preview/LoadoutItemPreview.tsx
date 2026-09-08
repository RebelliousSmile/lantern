import { cn } from '@/utils/cn'
import { SectionGate } from '../../shared/preview/components/SectionGate'
import {
    groupShouldShow,
    shouldShow,
    useOtherscapeLoadoutItemStore,
    useOtherscapeLoadoutItemViewStore,
} from '../hooks'
import DescriptionBlock from './blocks/DescriptionBlock'
import HeaderBlock from './blocks/HeaderBlock'
import MetaFooterBlock from './blocks/MetaFooterBlock'
import TagsBlock from './blocks/TagsBlock'
import './loadoutItemTheme.css'

export function LoadoutItemPreview() {
    const ui = useOtherscapeLoadoutItemViewStore()
    // Read through the store so the card re-renders on every edit, even where
    // the blocks below read the document themselves.
    const { otherscapeLoadoutItem } = useOtherscapeLoadoutItemStore()

    /* No theme-type modifier: a catalog entry belongs to no theme type, so the
       card takes the accent its own stylesheet sets rather than one of the
       four. */
    return (
        <div>
            <div
                className={cn(
                    'loadout-item-sheet os-card',
                    ui.background === 'plain' ? 'bg-plain' : 'bg-neon'
                )}
                style={{
                    transform: `scale(${ui.zoom})`,
                    transformOrigin: 'top center',
                }}
            >
                {/* The band and the title sit outside the padded body: they are
                    the card's top edge and run its full width. */}
                <HeaderBlock />

                <div className="loadout-item-sheet__body">
                    <SectionGate
                        show={shouldShow(
                            otherscapeLoadoutItem,
                            'description',
                            ui
                        )}
                    >
                        <DescriptionBlock />
                    </SectionGate>

                    <SectionGate
                        show={groupShouldShow(
                            otherscapeLoadoutItem,
                            ['featureTags', 'weaknessTag'],
                            ui
                        )}
                    >
                        <TagsBlock />
                    </SectionGate>
                </div>
            </div>

            {/* Meta footer sits under the card, on the page rather than on the
                card frame, so the exported image stays the printed object. */}
            <SectionGate show={shouldShow(otherscapeLoadoutItem, 'meta', ui)}>
                <MetaFooterBlock />
            </SectionGate>
        </div>
    )
}
