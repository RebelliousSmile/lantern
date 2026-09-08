import { renderLitmMarkdown } from '@/utils/markdown'
import { ClickableSection } from '../../../shared/preview/components/Clickable'
import { SectionGate } from '../../../shared/preview/components/SectionGate'
import {
    shouldShow,
    useOtherscapePowerSetSheetStore,
    useOtherscapePowerSetStore,
    useOtherscapePowerSetViewStore,
} from '../../hooks'
import { powerSetTypeOptions } from '../../metadata'

export default function HeaderBlock() {
    const { otherscapePowerSet } = useOtherscapePowerSetStore()
    const { openSheet } = useOtherscapePowerSetSheetStore()
    const view = useOtherscapePowerSetViewStore()

    const openBasic = () => openSheet({ kind: 'basic', mode: 'edit' })

    /* The label rather than the stored value, so the band reads as the book
       prints it. The lookup cannot miss: the schema admits these three only. */
    const typeLabel =
        powerSetTypeOptions.find(
            (option) => option.value === otherscapePowerSet.type
        )?.label ?? otherscapePowerSet.type

    /* The band and the name are the card's top edge rather than sections, so
       neither is gated: a Power Set with nothing filled in still prints a
       frame. The description below is a region of its own and is. */
    return (
        <>
            <ClickableSection
                onClick={openBasic}
                ariaLabel="Edit the power set name and type"
            >
                <div className="power-set-header os-bar">
                    <span className="power-set-header__kind os-label">
                        Power Set
                    </span>
                    {/* The type always prints: it is required, and it is what
                        tells the table where the power came from. */}
                    <span className="power-set-header__type">{typeLabel}</span>
                </div>
            </ClickableSection>

            <ClickableSection
                onClick={openBasic}
                ariaLabel="Edit the power set name"
            >
                <div className="power-set-title os-bar">
                    <span className="power-set-title__text os-display">
                        {otherscapePowerSet.name || 'Untitled Power Set'}
                    </span>
                </div>
            </ClickableSection>

            <SectionGate
                show={shouldShow(otherscapePowerSet, 'description', view)}
            >
                <ClickableSection
                    onClick={openBasic}
                    ariaLabel="Edit the description"
                >
                    <div className="power-set-description">
                        {otherscapePowerSet.description.trim() ? (
                            <div
                                className="power-set-description__text"
                                dangerouslySetInnerHTML={{
                                    __html: renderLitmMarkdown(
                                        otherscapePowerSet.description
                                    ),
                                }}
                            />
                        ) : (
                            <span className="os-placeholder">
                                add a short description
                            </span>
                        )}
                    </div>
                </ClickableSection>
            </SectionGate>
        </>
    )
}
