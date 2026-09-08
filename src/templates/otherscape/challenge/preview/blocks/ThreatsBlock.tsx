import { renderLitmInline } from '@/utils/markdown'
import { ClickableSection } from '../../../shared/preview/components/Clickable'
import { SectionHeader } from '../../../shared/preview/components/SectionHeader'
import {
    useOtherscapeChallengeSheetStore,
    useOtherscapeChallengeStore,
} from '../../hooks'

export default function ThreatsBlock() {
    const { otherscapeChallenge } = useOtherscapeChallengeStore()
    const { openSheet } = useOtherscapeChallengeSheetStore()

    const threats = otherscapeChallenge.threats

    return (
        <div className="challenge-threats">
            <SectionHeader
                title="Threats"
                onClick={() => openSheet({ kind: 'threats', mode: 'create' })}
            />

            {threats.length ? (
                <ul className="challenge-threats__list">
                    {threats.map((threat, index) => (
                        <li key={`threat-${index}-${threat.name}`}>
                            <ClickableSection
                                onClick={() =>
                                    openSheet({
                                        kind: 'threats',
                                        index,
                                        mode: 'edit',
                                    })
                                }
                                ariaLabel={`Edit threat ${threat.name}`}
                            >
                                <div className="challenge-threat">
                                    <div className="challenge-threat__head">
                                        <span className="challenge-threat__name os-bar">
                                            <span>{threat.name}</span>
                                        </span>
                                        <span
                                            className="challenge-threat__text"
                                            dangerouslySetInnerHTML={{
                                                __html: renderLitmInline(
                                                    threat.description
                                                ),
                                            }}
                                        />
                                    </div>

                                    {/* Indented under the threat that owns
                                        them, so a reader never mistakes one
                                        threat's cost for the sheet-wide list
                                        below. */}
                                    {threat.consequences?.length ? (
                                        <ul className="challenge-threat__consequences">
                                            {(threat.consequences ?? []).map(
                                                (consequence, cIndex) => (
                                                    <li
                                                        key={`consequence-${cIndex}`}
                                                        className="challenge-consequence"
                                                        dangerouslySetInnerHTML={{
                                                            __html: renderLitmInline(
                                                                consequence
                                                            ),
                                                        }}
                                                    />
                                                )
                                            )}
                                        </ul>
                                    ) : null}
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
                        openSheet({ kind: 'threats', mode: 'create' })
                    }
                >
                    add threats
                </button>
            )}
        </div>
    )
}
