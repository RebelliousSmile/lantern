import { renderLitmInline } from '@/utils/markdown'
import { ClickableSection } from '../../../shared/preview/components/Clickable'
import { SectionHeader } from '../../../shared/preview/components/SectionHeader'
import {
    useOtherscapeChallengeSheetStore,
    useOtherscapeChallengeStore,
} from '../../hooks'

export default function LimitsBlock() {
    const { otherscapeChallenge } = useOtherscapeChallengeStore()
    const { openSheet } = useOtherscapeChallengeSheetStore()

    const limits = otherscapeChallenge.limits

    return (
        <div className="challenge-limits">
            <SectionHeader
                title="Limits"
                onClick={() => openSheet({ kind: 'limits', mode: 'create' })}
            />

            {limits.length ? (
                <ul className="challenge-limits__list">
                    {limits.map((limit, index) => (
                        <li key={`limit-${index}-${limit.name}`}>
                            <ClickableSection
                                onClick={() =>
                                    openSheet({
                                        kind: 'limits',
                                        index,
                                        mode: 'edit',
                                    })
                                }
                                ariaLabel={`Edit limit ${limit.name}`}
                            >
                                <div className="challenge-limit os-bar">
                                    <div className="challenge-limit__inner">
                                        <span className="challenge-limit__name">
                                            {limit.name}
                                        </span>
                                        {/* Two flags, two marks: a polar Limit
                                            runs both ways, a progress Limit
                                            fills up. A Limit carrying both
                                            prints both. */}
                                        {limit.is_polar && (
                                            <span
                                                className="challenge-limit__mark challenge-limit__mark--polar"
                                                title="Polar limit"
                                            >
                                                {'\u21C4'}
                                            </span>
                                        )}
                                        {limit.is_progress && (
                                            <span
                                                className="challenge-limit__mark challenge-limit__mark--progress"
                                                title="Progress limit"
                                            >
                                                {'\u25B6'}
                                            </span>
                                        )}
                                        <span className="challenge-limit__level">
                                            {limit.level}
                                        </span>
                                    </div>
                                </div>

                                {/* Printed only when the Limit says what
                                    filling it up costs: an empty row would read
                                    as an outcome the card does not carry. */}
                                {limit.on_max?.trim() ? (
                                    <div
                                        className="challenge-limit__outcome"
                                        dangerouslySetInnerHTML={{
                                            __html: renderLitmInline(
                                                limit.on_max
                                            ),
                                        }}
                                    />
                                ) : null}
                            </ClickableSection>
                        </li>
                    ))}
                </ul>
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
