import { renderLitmMarkdown } from '@/utils/markdown'
import { ClickableSection } from '../../../shared/preview/components/Clickable'
import {
    useOtherscapeThemeKitSheetStore,
    useOtherscapeThemeKitStore,
} from '../../hooks'
import { QUEST_LABEL } from '../../model'

export default function QuestBlock() {
    const { otherscapeThemeKit } = useOtherscapeThemeKitStore()
    const { openSheet } = useOtherscapeThemeKitSheetStore()

    const openQuest = () => openSheet({ kind: 'quest', mode: 'edit' })

    /* The quest is the one region the card names, and it names it after the
       theme type: a Self kit sets an identity where a Mythos kit sets a ritual.
       So the label is read from the document rather than printed as "Quest". */
    return (
        <ClickableSection onClick={openQuest} ariaLabel="Edit the quest">
            <div className="theme-kit-quest">
                <span className="os-label theme-kit-quest__label">
                    {QUEST_LABEL[otherscapeThemeKit.theme_type]}
                </span>
                {otherscapeThemeKit.quest ? (
                    <div
                        className="theme-kit-quest__text"
                        dangerouslySetInnerHTML={{
                            __html: renderLitmMarkdown(
                                otherscapeThemeKit.quest
                            ),
                        }}
                    />
                ) : (
                    <span className="text-xs underline decoration-dotted cursor-pointer">
                        add the quest this kit sets
                    </span>
                )}
            </div>
        </ClickableSection>
    )
}
