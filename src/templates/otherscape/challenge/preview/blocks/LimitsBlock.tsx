import { renderLitmInline } from '@/utils/markdown'
import { ClickableSection } from '../../../shared/preview/components/Clickable'
import { SectionHeader } from '../../../shared/preview/components/SectionHeader'
import {
    useOtherscapeChallengeSheetStore,
    useOtherscapeChallengeStore,
} from '../../hooks'

/* The book sets the Limits as a row of tabs, the name and a large level on
   each, and prints under the row, in one box hanging off the first tab, what
   maxing out each Limit does. */
export default function LimitsBlock() {
    const { otherscapeChallenge } = useOtherscapeChallengeStore()
    const { openSheet } = useOtherscapeChallengeSheetStore()

    const limits = otherscapeChallenge.limits
    const outcomes = limits
        .map((limit, index) => ({ limit, index }))
        .filter(({ limit }) => limit.on_max?.trim())

    const edit = (index: number) =>
        openSheet({ kind: 'limits', index, mode: 'edit' })

    return (
        <div className="challenge-limits">
            <SectionHeader
                title="Limits"
                align="end"
                onClick={() => openSheet({ kind: 'limits', mode: 'create' })}
            />

            {limits.length ? (
                <>
                    <ul className="challenge-limits__list">
                        {limits.map((limit, index) => (
                            <li key={`limit-${index}-${limit.name}`}>
                                <ClickableSection
                                    onClick={() => edit(index)}
                                    ariaLabel={`Edit limit ${limit.name}`}
                                >
                                    <div className="challenge-limit">
                                        <span className="challenge-limit__name">
                                            {limit.name}
                                        </span>
                                        {/* Two flags, two marks: a polar
                                            Limit runs both ways, a progress
                                            Limit fills up. */}
                                        {limit.is_polar && (
                                            <span
                                                className="challenge-limit__mark"
                                                title="Polar limit"
                                            >
                                                {'\u21C4'}
                                            </span>
                                        )}
                                        {limit.is_progress && (
                                            <span
                                                className="challenge-limit__mark"
                                                title="Progress limit"
                                            >
                                                {'\u25B6'}
                                            </span>
                                        )}
                                        <span className="challenge-limit__level">
                                            {limit.level}
                                        </span>
                                    </div>
                                </ClickableSection>
                            </li>
                        ))}
                    </ul>

                    {/* Printed only when a Limit says what maxing it out
                        does: an empty box would read as an outcome the card
                        does not carry. */}
                    {outcomes.length ? (
                        <ul className="challenge-limits__outcomes">
                            {outcomes.map(({ limit, index }) => (
                                <li key={`outcome-${index}-${limit.name}`}>
                                    <ClickableSection
                                        onClick={() => edit(index)}
                                        ariaLabel={`Edit limit ${limit.name}`}
                                    >
                                        <div className="challenge-limit__outcome">
                                            <span className="challenge-limit__outcome-name">
                                                {limit.name}
                                            </span>
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: renderLitmInline(
                                                        limit.on_max ?? ''
                                                    ),
                                                }}
                                            />
                                        </div>
                                    </ClickableSection>
                                </li>
                            ))}
                        </ul>
                    ) : null}
                </>
            ) : (
                <button
                    type="button"
                    className="text-xs underline decoration-dotted opacity-80 hover:opacity-100 cursor-pointer"
                    onClick={() =>
                        openSheet({ kind: 'limits', mode: 'create' })
                    }
                >
                    add limits
                </button>
            )}
        </div>
    )
}
