import { cn } from '@/utils/cn'
import { renderLitmInline } from '@/utils/markdown'
import { ClickableInline } from '../../../shared/preview/components/Clickable'
import { SectionHeader } from '../../../shared/preview/components/SectionHeader'
import {
    shouldShow,
    useOtherscapePowerSetSheetStore,
    useOtherscapePowerSetStore,
    useOtherscapePowerSetViewStore,
} from '../../hooks'

/* The list the Power Set can spend regardless of which Threat is in play. It is
   a region of its own rather than a tail on the threats block: a consequence
   printed here belongs to the Power Set, not to whichever threat happens to sit
   above it. The book prints it as the last group of the Threats' list, ruled
   off and unlabelled; it only takes a label of its own when no Threat is
   printed above it. */
export default function ConsequencesBlock() {
    const { otherscapePowerSet } = useOtherscapePowerSetStore()
    const { openSheet } = useOtherscapePowerSetSheetStore()

    const view = useOtherscapePowerSetViewStore()

    const consequences = otherscapePowerSet.general_consequences
    const continued =
        shouldShow(otherscapePowerSet, 'threats', view) &&
        otherscapePowerSet.threats.length > 0

    return (
        <div
            className={cn(
                'power-set-consequences',
                continued && 'power-set-consequences--continued'
            )}
        >
            {!continued && (
                <SectionHeader
                    title="General Consequences"
                    align="end"
                    onClick={() =>
                        openSheet({ kind: 'consequences', mode: 'create' })
                    }
                />
            )}

            {consequences.length ? (
                <ul className="power-set-consequences__list">
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
                                className="power-set-consequence w-full"
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
