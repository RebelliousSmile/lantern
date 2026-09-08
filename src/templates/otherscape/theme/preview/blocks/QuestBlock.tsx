import { renderLitmMarkdown } from '@/utils/markdown'
import { ClickableSection } from '../../../shared/preview/components/Clickable'
import {
    useOtherscapeThemeSheetStore,
    useOtherscapeThemeStore,
} from '../../hooks'
import { QUEST_LABEL } from '../../model'

export default function QuestBlock() {
    const { otherscapeTheme } = useOtherscapeThemeStore()
    const { openSheet } = useOtherscapeThemeSheetStore()

    const openQuest = () => openSheet({ kind: 'quest', mode: 'edit' })

    /* The quest is the one region the card names, and it names it after the
       theme type: a Self theme sets an identity where a Mythos theme sets a ritual.
       So the label is read from the document rather than printed as "Quest". */
    return (
        <ClickableSection onClick={openQuest} ariaLabel="Edit the quest">
            <div className="theme-quest">
                <span className="os-label theme-quest__label">
                    {QUEST_LABEL[otherscapeTheme.theme_type]}
                </span>
                {otherscapeTheme.quest ? (
                    <div
                        className="theme-quest__text"
                        dangerouslySetInnerHTML={{
                            __html: renderLitmMarkdown(otherscapeTheme.quest),
                        }}
                    />
                ) : (
                    <span className="text-xs underline decoration-dotted cursor-pointer">
                        add the quest this theme sets
                    </span>
                )}
            </div>
        </ClickableSection>
    )
}
