import { ClickableSection } from '../../../shared/preview/components/Clickable'
import { SectionHeader } from '../../../shared/preview/components/SectionHeader'
import {
    useOtherscapeCharacterTropeSheetStore,
    useOtherscapeCharacterTropeStore,
} from '../../hooks'

/* The same entry shape as the granted kits, deliberately printed as a different
   band: open outlines and a hint rather than filled rules, so a reader never
   takes a choice for something the trope already handed over. */
export default function ChoicesBlock() {
    const { otherscapeCharacterTrope } = useOtherscapeCharacterTropeStore()
    const { openSheet } = useOtherscapeCharacterTropeSheetStore()

    const choices = otherscapeCharacterTrope.choices

    return (
        <div className="character-trope-choices">
            <SectionHeader
                title="Choose one"
                onClick={() => openSheet({ kind: 'choices', mode: 'create' })}
            />

            {choices.length ? (
                <>
                    <span className="character-trope-choices__hint">
                        Pick one of these
                    </span>
                    <ul className="character-trope-choices__list">
                        {choices.map((choice, index) => (
                            <li key={`choice-${index}-${choice.title_tag}`}>
                                <ClickableSection
                                    onClick={() =>
                                        openSheet({
                                            kind: 'choices',
                                            index,
                                            mode: 'edit',
                                        })
                                    }
                                    ariaLabel={`Edit choice ${choice.title_tag}`}
                                >
                                    <div className="character-trope-kit">
                                        <span className="character-trope-kit__title">
                                            {choice.title_tag}
                                        </span>
                                        <span className="character-trope-kit__category">
                                            {choice.category}
                                        </span>
                                    </div>
                                </ClickableSection>
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <button
                    type="button"
                    className="text-xs underline decoration-dotted opacity-80 hover:opacity-100 cursor-pointer"
                    onClick={() =>
                        openSheet({ kind: 'choices', mode: 'create' })
                    }
                >
                    add theme kits to choose between
                </button>
            )}
        </div>
    )
}
