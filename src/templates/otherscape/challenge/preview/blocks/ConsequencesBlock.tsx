import { renderLitmInline } from '@/utils/markdown'
import { ClickableInline } from '../../../shared/preview/components/Clickable'
import { SectionHeader } from '../../../shared/preview/components/SectionHeader'
import {
    useOtherscapeChallengeSheetStore,
    useOtherscapeChallengeStore,
} from '../../hooks'

/* The list the Challenge can spend regardless of which Threat is in play. It is
   a region of its own rather than a tail on the threats block: a consequence
   printed here belongs to the Challenge, not to whichever threat happens to sit
   above it. */
export default function ConsequencesBlock() {
    const { otherscapeChallenge } = useOtherscapeChallengeStore()
    const { openSheet } = useOtherscapeChallengeSheetStore()

    const consequences = otherscapeChallenge.general_consequences

    return (
        <div className="challenge-consequences">
            <SectionHeader
                title="General Consequences"
                onClick={() =>
                    openSheet({ kind: 'consequences', mode: 'create' })
                }
            />

            {consequences.length ? (
                <ul className="challenge-consequences__list">
                    {consequences.map((consequence, index) => (
                        <li key={`general-consequence-${index}`}>
                            <ClickableInline
                                onClick={() =>
                                    openSheet({
                                        kind: 'consequences',
                                        index,
                                        mode: 'edit',
                                    })
                                }
                                ariaLabel={`Edit general consequence ${index + 1}`}
                                className="challenge-consequence w-full"
                            >
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: renderLitmInline(consequence),
                                    }}
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
                        openSheet({ kind: 'consequences', mode: 'create' })
                    }
                >
                    add general consequences
                </button>
            )}
        </div>
    )
}
