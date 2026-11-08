import { renderLitmMarkdown } from '@/utils/markdown'
import { ClickableSection } from '../../../shared/preview/components/Clickable'
import { RatingMarks } from '../../../shared/preview/components/RatingMarks'
import { SectionGate } from '../../../shared/preview/components/SectionGate'
import { SectionHeader } from '../../../shared/preview/components/SectionHeader'
import { TypeGlyph } from '../../../shared/preview/components/TypeGlyph'
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

    /* The label rather than the stored value, so the kicker reads as the book
       prints it. The lookup cannot miss: the schema admits these three only. */
    const typeLabel =
        powerSetTypeOptions.find(
            (option) => option.value === otherscapePowerSet.type
        )?.label ?? otherscapePowerSet.type

    /* The rating it adds to the Challenge, as the book prints it after the
       name: `+` and one mark per point, the optional ones in brackets. */
    const { rating, optional_rating: optionalRating } = otherscapePowerSet
    const ratingLabel =
        rating != null
            ? `+${rating}` +
              (optionalRating != null ? ` (+${optionalRating})` : '')
            : ''

    /* The kicker and the name are the card's head rather than sections, so
       neither is gated: a Power Set with nothing filled in still prints them.
       The description below is a region of its own and is. */
    return (
        <>
            <SectionHeader
                title={`${typeLabel} Power Set`}
                align="end"
                onClick={openBasic}
            />

            <ClickableSection
                onClick={openBasic}
                ariaLabel="Edit the power set name and rating"
            >
                <div className="power-set-title">
                    <TypeGlyph
                        className="power-set-title__glyph"
                        themeType={otherscapePowerSet.type}
                    />
                    <span className="power-set-title__text os-display">
                        {otherscapePowerSet.name || 'Untitled Power Set'}
                    </span>
                    {rating != null && (
                        <span
                            className="power-set-title__rating"
                            role="img"
                            aria-label={`Rating ${ratingLabel}`}
                        >
                            +
                            <RatingMarks
                                count={rating}
                                className="power-set-rating__mark"
                            />
                            {optionalRating != null && (
                                <>
                                    (
                                    <RatingMarks
                                        count={optionalRating}
                                        className="power-set-rating__mark"
                                    />
                                    )
                                </>
                            )}
                        </span>
                    )}
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
