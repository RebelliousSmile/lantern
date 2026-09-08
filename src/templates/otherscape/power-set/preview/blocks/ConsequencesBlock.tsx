import { renderLitmInline } from '@/utils/markdown'
import { ClickableInline } from '../../../shared/preview/components/Clickable'
import { SectionHeader } from '../../../shared/preview/components/SectionHeader'
import {
    useOtherscapePowerSetSheetStore,
    useOtherscapePowerSetStore,
} from '../../hooks'

/* The list the Power Set can spend regardless of which Threat is in play. It is
   a region of its own rather than a tail on the threats block: a consequence
   printed here belongs to the Power Set, not to whichever threat happens to sit
   above it. */
export default function ConsequencesBlock() {
    const { otherscapePowerSet } = useOtherscapePowerSetStore()
    const { openSheet } = useOtherscapePowerSetSheetStore()

    const consequences = otherscapePowerSet.general_consequences

    return (
        <div className="power-set-consequences">
            <SectionHeader
                title="General Consequences"
                onClick={() =>
                    openSheet({ kind: 'consequences', mode: 'create' })
                }
            />

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
