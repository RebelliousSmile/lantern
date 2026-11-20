import i18n from '@/i18n'
import { cn } from '@/utils/cn'
import { NotesPage } from '../../../shared/notes/NotesPage'
import { SectionGate } from '../../shared/preview/components/SectionGate'
import {
    shouldShow,
    useOtherscapeCharacterSheetStore,
    useOtherscapeCharacterStore,
    useOtherscapeCharacterViewStore,
} from '../hooks'
import { isNotesPage, OTHERSCAPE_CHARACTER_PAGES, pageLabel } from '../pages'
import CombosBlock from './blocks/CombosBlock'
import LoadoutBlock from './blocks/LoadoutBlock'
import MetaFooterBlock from './blocks/MetaFooterBlock'
import NameBlock from './blocks/NameBlock'
import ThemesBlock from './blocks/ThemesBlock'
import UpgradesBlock from './blocks/UpgradesBlock'
import './characterTheme.css'

/* The sheet is drawn page by page, the pages being the ones the published schema declares: the
   name, Upgrades, Tag combos and Loadout on the first, the grid of theme cards on the second, the
   session notes on the last. Each page is a frame of its own with a neutral accent (each theme
   card re-declares its own from its type), so it leaves as one image and prints on one sheet. */
export function CharacterPreview() {
    const ui = useOtherscapeCharacterViewStore()
    const { otherscapeCharacter } = useOtherscapeCharacterStore()
    const { openSheet } = useOtherscapeCharacterSheetStore()

    const frame = cn(
        'os-card os-character',
        ui.background === 'plain' ? 'bg-plain' : 'bg-neon'
    )
    const zoomed =
        ui.zoom === 1
            ? undefined
            : {
                  transform: `scale(${ui.zoom})`,
                  transformOrigin: 'top center',
              }

    return (
        <div className="os-character-pages">
            {OTHERSCAPE_CHARACTER_PAGES.map((page) => {
                if (isNotesPage(page))
                    return (
                        <NotesPage
                            key={page.id}
                            id={page.id}
                            title={pageLabel(page, i18n.language)}
                            value={otherscapeCharacter.session_notes}
                            className={frame}
                            style={zoomed}
                            onOpen={() =>
                                openSheet({ kind: 'notes', mode: 'edit' })
                            }
                        />
                    )
                const first = page.id === OTHERSCAPE_CHARACTER_PAGES[0].id
                return (
                    <div key={page.id}>
                        <article
                            className={frame}
                            style={zoomed}
                            data-export-page={page.id}
                        >
                            {first && <NameBlock />}

                            <div className="os-character__body">
                                {first && (
                                    <>
                                        <SectionGate
                                            show={shouldShow(
                                                otherscapeCharacter,
                                                'upgrades',
                                                ui
                                            )}
                                        >
                                            <UpgradesBlock />
                                        </SectionGate>

                                        <SectionGate
                                            show={shouldShow(
                                                otherscapeCharacter,
                                                'combos',
                                                ui
                                            )}
                                        >
                                            <CombosBlock />
                                        </SectionGate>

                                        <SectionGate
                                            show={shouldShow(
                                                otherscapeCharacter,
                                                'loadout',
                                                ui
                                            )}
                                        >
                                            <LoadoutBlock />
                                        </SectionGate>
                                    </>
                                )}

                                {!first && (
                                    <SectionGate
                                        show={shouldShow(
                                            otherscapeCharacter,
                                            'themes',
                                            ui
                                        )}
                                    >
                                        <ThemesBlock />
                                    </SectionGate>
                                )}
                            </div>
                        </article>

                        {/* The meta footer sits under the sheet, on the page rather than on
                            the frame, so the exported image stays the printed object. */}
                        {!first && (
                            <SectionGate
                                show={shouldShow(
                                    otherscapeCharacter,
                                    'meta',
                                    ui
                                )}
                            >
                                <MetaFooterBlock />
                            </SectionGate>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
