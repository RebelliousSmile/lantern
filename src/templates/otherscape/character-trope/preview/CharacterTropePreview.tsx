import { cn } from '@/utils/cn'
import { SectionGate } from '../../shared/preview/components/SectionGate'
import {
    shouldShow,
    useOtherscapeCharacterTropeStore,
    useOtherscapeCharacterTropeViewStore,
} from '../hooks'
import ChoicesBlock from './blocks/ChoicesBlock'
import HeaderBlock from './blocks/HeaderBlock'
import LoadoutBlock from './blocks/LoadoutBlock'
import MetaFooterBlock from './blocks/MetaFooterBlock'
import ThemeKitsBlock from './blocks/ThemeKitsBlock'
import './characterTropeTheme.css'

export function CharacterTropePreview() {
    const ui = useOtherscapeCharacterTropeViewStore()
    // Read through the store so the card repaints on every edit, even where the
    // blocks below read the document themselves.
    const { otherscapeCharacterTrope } = useOtherscapeCharacterTropeStore()

    /* A trope carries no theme type of its own, so the card takes the one
       accent its stylesheet pins rather than a modifier driven by the
       document. */
    return (
        <div>
            <div
                className={cn(
                    'character-trope-sheet os-card',
                    ui.background === 'plain' ? 'bg-plain' : 'bg-neon'
                )}
                style={{
                    transform: `scale(${ui.zoom})`,
                    transformOrigin: 'top center',
                }}
            >
                {/* The band and the name run the full width of the card: they
                    are its top edge rather than a region of its body. */}
                <HeaderBlock />

                <div className="character-trope-sheet__body">
                    {/* One column, in the order a player reads the package:
                        what they are given, what they pick, what they carry. */}
                    <SectionGate
                        show={shouldShow(
                            otherscapeCharacterTrope,
                            'themeKits',
                            ui
                        )}
                    >
                        <ThemeKitsBlock />
                    </SectionGate>

                    <SectionGate
                        show={shouldShow(
                            otherscapeCharacterTrope,
                            'choices',
                            ui
                        )}
                    >
                        <ChoicesBlock />
                    </SectionGate>

                    <SectionGate
                        show={shouldShow(
                            otherscapeCharacterTrope,
                            'loadout',
                            ui
                        )}
                    >
                        <LoadoutBlock />
                    </SectionGate>
                </div>
            </div>

            {/* Meta footer sits under the card, on the page rather than on the
                card frame, so the exported image stays the printed object. */}
            <SectionGate
                show={shouldShow(otherscapeCharacterTrope, 'meta', ui)}
            >
                <MetaFooterBlock />
            </SectionGate>
        </div>
    )
}
