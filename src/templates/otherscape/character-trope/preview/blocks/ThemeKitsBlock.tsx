import { ClickableInline } from '../../../shared/preview/components/Clickable'
import { SectionHeader } from '../../../shared/preview/components/SectionHeader'
import {
    useOtherscapeCharacterTropeSheetStore,
    useOtherscapeCharacterTropeStore,
} from '../../hooks'
import { KitLine } from './KitLine'

/* What the trope hands over outright, one plain line a kit. The title tag
   prints as plain text: here it is the name of a kit record, not a tag anyone
   invokes. */
export default function ThemeKitsBlock() {
    const { otherscapeCharacterTrope } = useOtherscapeCharacterTropeStore()
    const { openSheet } = useOtherscapeCharacterTropeSheetStore()

    const themeKits = otherscapeCharacterTrope.theme_kits

    return (
        <div className="character-trope-kits">
            <SectionHeader
                title="Theme Kits"
                align="end"
                onClick={() => openSheet({ kind: 'themeKits', mode: 'create' })}
            />

            {themeKits.length ? (
                <ul className="character-trope-kits__list">
                    {themeKits.map((kit, index) => (
                        <li key={`theme-kit-${index}-${kit.title_tag}`}>
                            <ClickableInline
                                onClick={() =>
                                    openSheet({
                                        kind: 'themeKits',
                                        index,
                                        mode: 'edit',
                                    })
                                }
                                ariaLabel={`Edit granted theme kit ${kit.title_tag}`}
                            >
                                <KitLine
                                    title={kit.title_tag}
                                    category={kit.category}
                                    page={kit.page}
                                />
                            </ClickableInline>
                        </li>
                    ))}
                </ul>
            ) : (
                <button
                    type="button"
                    className="text-xs underline decoration-dotted opacity-80 hover:opacity-100 cursor-pointer"
                    onClick={() =>
                        openSheet({ kind: 'themeKits', mode: 'create' })
                    }
                >
                    add granted theme kits
                </button>
            )}
        </div>
    )
}
