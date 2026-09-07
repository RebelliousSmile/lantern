import { renderLitmMarkdown } from '@/utils/markdown'
import {
    useLegendInTheMistThemeKitSheetStore,
    useLegendInTheMistThemeKitStore,
} from '../../hooks'
import { ClickableSection } from '../components/Clickable'

export default function QuestBlock() {
    const { legendInTheMistThemeKit } = useLegendInTheMistThemeKitStore()
    const { openSheet } = useLegendInTheMistThemeKitSheetStore()

    const openQuest = () => openSheet({ kind: 'quest', mode: 'edit' })

    /* No section header: the book separates the quest from the tags with a
       hairline rule and nothing else, and its upright face is already what
       tells it apart from a tag. */
    return (
        <ClickableSection onClick={openQuest} ariaLabel="Edit the quest">
            <div className="theme-kit-quest">
                {legendInTheMistThemeKit.quest ? (
                    <div
                        dangerouslySetInnerHTML={{
                            __html: renderLitmMarkdown(
                                legendInTheMistThemeKit.quest
                            ),
                        }}
                    />
                ) : (
                    <span className="underline decoration-dotted cursor-pointer">
                        add the quest this kit suggests
                    </span>
                )}
            </div>
        </ClickableSection>
    )
}
