import { ClickableSection } from '../../../shared/preview/components/Clickable'
import { SectionHeader } from '../../../shared/preview/components/SectionHeader'
import {
    useOtherscapeCharacterTropeSheetStore,
    useOtherscapeCharacterTropeStore,
} from '../../hooks'

/* What the trope hands over outright. The title tag prints as plain text: here
   it is the name of a kit record, not a tag anyone invokes. */
export default function ThemeKitsBlock() {
    const { otherscapeCharacterTrope } = useOtherscapeCharacterTropeStore()
    const { openSheet } = useOtherscapeCharacterTropeSheetStore()

    const themeKits = otherscapeCharacterTrope.theme_kits

    return (
        <div className="character-trope-kits">
            <SectionHeader
                title="Theme kits granted"
                onClick={() => openSheet({ kind: 'themeKits', mode: 'create' })}
            />

            {themeKits.length ? (
                <ul className="character-trope-kits__list">
                    {themeKits.map((kit, index) => (
                        <li key={`theme-kit-${index}-${kit.title_tag}`}>
                            <ClickableSection
                                onClick={() =>
                                    openSheet({
                                        kind: 'themeKits',
                                        index,
                                        mode: 'edit',
                                    })
                                }
                                ariaLabel={`Edit granted theme kit ${kit.title_tag}`}
                            >
                                <div className="character-trope-kit">
                                    <span className="character-trope-kit__title">
                                        {kit.title_tag}
                                    </span>
                                    <span className="character-trope-kit__category">
                                        {kit.category}
                                    </span>
                                </div>
                            </ClickableSection>
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
