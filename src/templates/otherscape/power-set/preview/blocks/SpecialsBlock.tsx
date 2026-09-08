import { renderLitmInline } from '@/utils/markdown'
import { ClickableSection } from '../../../shared/preview/components/Clickable'
import { SectionHeader } from '../../../shared/preview/components/SectionHeader'
import {
    useOtherscapePowerSetSheetStore,
    useOtherscapePowerSetStore,
} from '../../hooks'

export default function SpecialsBlock() {
    const { otherscapePowerSet } = useOtherscapePowerSetStore()
    const { openSheet } = useOtherscapePowerSetSheetStore()

    const specials = otherscapePowerSet.specials

    return (
        <div className="power-set-specials">
            <SectionHeader
                title="Specials"
                onClick={() => openSheet({ kind: 'specials', mode: 'create' })}
            />

            {specials.length ? (
                <ul className="power-set-specials__list">
                    {specials.map((special, index) => (
                        <li key={`special-${index}-${special.name}`}>
                            <ClickableSection
                                onClick={() =>
                                    openSheet({
                                        kind: 'specials',
                                        index,
                                        mode: 'edit',
                                    })
                                }
                                ariaLabel={`Edit special ${special.name}`}
                            >
                                <div className="power-set-special">
                                    <span className="power-set-special__name">
                                        {special.name}
                                    </span>
                                    <span
                                        className="power-set-special__text"
                                        dangerouslySetInnerHTML={{
                                            __html: renderLitmInline(
                                                special.description
                                            ),
                                        }}
                                    />
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
                        openSheet({ kind: 'specials', mode: 'create' })
                    }
                >
                    add specials
                </button>
            )}
        </div>
    )
}
