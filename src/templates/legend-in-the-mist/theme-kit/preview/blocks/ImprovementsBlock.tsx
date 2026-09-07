import { renderLitmInline } from '@/utils/markdown'
import {
    useLegendInTheMistThemeKitSheetStore,
    useLegendInTheMistThemeKitStore,
} from '../../hooks'
import { ClickableSection } from '../components/Clickable'
import { SectionHeader } from '../components/SectionHeader'

export default function ImprovementsBlock() {
    const { legendInTheMistThemeKit } = useLegendInTheMistThemeKitStore()
    const { openSheet } = useLegendInTheMistThemeKitSheetStore()

    const improvements = legendInTheMistThemeKit.improvements

    /* The printed card carries no improvements: the book collects them a level
       up, for the whole themebook. The schema hangs them on the kit, so they do
       render, but as a secondary band under the quest rather than as another
       highlighted run. */
    if (!improvements.length) {
        return (
            <div className="theme-kit-improvements">
                <button
                    type="button"
                    className="text-xs underline decoration-dotted opacity-80 hover:opacity-100 cursor-pointer"
                    onClick={() =>
                        openSheet({ kind: 'improvements', mode: 'create' })
                    }
                >
                    add an improvement
                </button>
            </div>
        )
    }

    return (
        <div className="theme-kit-improvements">
            <SectionHeader
                title="Improvements"
                onClick={() =>
                    openSheet({ kind: 'improvements', mode: 'create' })
                }
            />

            <ul className="theme-kit-improvements__list">
                {improvements.map((improvement, index) => (
                    <li key={`${improvement.name}-${index}`}>
                        <ClickableSection
                            onClick={() =>
                                openSheet({
                                    kind: 'improvements',
                                    index,
                                    mode: 'edit',
                                })
                            }
                            ariaLabel={`Edit improvement ${improvement.name}`}
                        >
                            <span className="theme-kit-improvement__name">
                                {improvement.name}
                            </span>
                            {improvement.effect &&
                                improvement.effect.trim() && (
                                    <span
                                        className="theme-kit-improvement__effect"
                                        dangerouslySetInnerHTML={{
                                            __html: renderLitmInline(
                                                improvement.effect
                                            ),
                                        }}
                                    />
                                )}
                        </ClickableSection>
                    </li>
                ))}
            </ul>
        </div>
    )
}
