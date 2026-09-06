import { renderLitmMarkdown } from '@/utils/markdown'
import {
    useLegendInTheMistStoryThemeSheetStore,
    useLegendInTheMistStoryThemeStore,
} from '../../hooks'
import { ClickableSection } from '../components/Clickable'
import { SectionHeader } from '../components/SectionHeader'

/* A theme's tracks fill three boxes at play, but the schema sets no ceiling:
   a card that carries more still shows every box it has earned. */
const TRACK_SLOTS = 3

function Track({ label, value }: { label: string; value: number }) {
    const slots = Math.max(TRACK_SLOTS, value)

    return (
        <span className="story-theme-track">
            <span>{label}</span>
            <span className="story-theme-track__boxes">
                {Array.from({ length: slots }).map((_, index) => (
                    <span
                        key={index}
                        className={
                            index < value
                                ? 'story-theme-box story-theme-box--filled'
                                : 'story-theme-box'
                        }
                        aria-hidden
                    />
                ))}
            </span>
            <span className="sr-only">
                {value} of {slots}
            </span>
        </span>
    )
}

export default function QuestBlock() {
    const { legendInTheMistStoryTheme } = useLegendInTheMistStoryThemeStore()
    const { openSheet } = useLegendInTheMistStoryThemeSheetStore()

    const openQuest = () => openSheet({ kind: 'quest', mode: 'edit' })

    return (
        <div className="space-y-1 w-full">
            <SectionHeader title="Quest" onClick={openQuest} />

            <ClickableSection onClick={openQuest} ariaLabel="Edit quest">
                <div className="story-theme-quest">
                    {legendInTheMistStoryTheme.quest ? (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: renderLitmMarkdown(
                                    legendInTheMistStoryTheme.quest
                                ),
                            }}
                        />
                    ) : (
                        <span className="underline decoration-dotted cursor-pointer">
                            add the quest this theme sets
                        </span>
                    )}
                </div>
            </ClickableSection>

            <ClickableSection
                onClick={openQuest}
                ariaLabel="Edit improve, abandon and milestone"
            >
                <div className="story-theme-tracks mt-1">
                    <Track
                        label="Improve"
                        value={legendInTheMistStoryTheme.improve}
                    />
                    <Track
                        label="Abandon"
                        value={legendInTheMistStoryTheme.abandon}
                    />
                    <span
                        className={
                            legendInTheMistStoryTheme.milestone
                                ? 'story-theme-milestone'
                                : 'story-theme-milestone story-theme-milestone--off'
                        }
                    >
                        Milestone
                    </span>
                </div>
            </ClickableSection>
        </div>
    )
}
