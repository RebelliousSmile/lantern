import { cn } from '@/utils/cn'
import { SectionGate } from '../../shared/preview/components/SectionGate'
import {
    shouldShow,
    useOtherscapeCharacterStore,
    useOtherscapeCharacterViewStore,
} from '../hooks'
import CombosBlock from './blocks/CombosBlock'
import LoadoutBlock from './blocks/LoadoutBlock'
import MetaFooterBlock from './blocks/MetaFooterBlock'
import NameBlock from './blocks/NameBlock'
import ThemesBlock from './blocks/ThemesBlock'
import UpgradesBlock from './blocks/UpgradesBlock'
import './characterTheme.css'

/* The sheet: the name, then Upgrades, Tag combos and Loadout stacked in that
   order, then the grid of theme cards. The frame has a neutral accent; each
   theme card re-declares its own from its type. */
export function CharacterPreview() {
    const ui = useOtherscapeCharacterViewStore()
    const { otherscapeCharacter } = useOtherscapeCharacterStore()

    return (
        <div>
            <div
                className={cn(
                    'os-card os-character',
                    ui.background === 'plain' ? 'bg-plain' : 'bg-neon'
                )}
                style={
                    ui.zoom === 1
                        ? undefined
                        : {
                              transform: `scale(${ui.zoom})`,
                              transformOrigin: 'top center',
                          }
                }
            >
                <NameBlock />

                <div className="os-character__body">
                    <SectionGate
                        show={shouldShow(otherscapeCharacter, 'upgrades', ui)}
                    >
                        <UpgradesBlock />
                    </SectionGate>

                    <SectionGate
                        show={shouldShow(otherscapeCharacter, 'combos', ui)}
                    >
                        <CombosBlock />
                    </SectionGate>

                    <SectionGate
                        show={shouldShow(otherscapeCharacter, 'loadout', ui)}
                    >
                        <LoadoutBlock />
                    </SectionGate>

                    <SectionGate
                        show={shouldShow(otherscapeCharacter, 'themes', ui)}
                    >
                        <ThemesBlock />
                    </SectionGate>
                </div>
            </div>

            {/* The meta footer sits under the sheet, on the page rather than on
                the frame, so the exported image stays the printed object. */}
            <SectionGate show={shouldShow(otherscapeCharacter, 'meta', ui)}>
                <MetaFooterBlock />
            </SectionGate>
        </div>
    )
}
