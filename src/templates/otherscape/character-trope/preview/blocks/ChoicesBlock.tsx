import { ClickableInline } from '../../../shared/preview/components/Clickable'
import {
    useOtherscapeCharacterTropeSheetStore,
    useOtherscapeCharacterTropeStore,
} from '../../hooks'
import { KitLine } from './KitLine'

/* The same kit line as the granted ones, under the book's "? Choose One:" and
   each behind an empty round box: a reader never takes a choice for something
   the trope already handed over. */
export default function ChoicesBlock() {
    const { otherscapeCharacterTrope } = useOtherscapeCharacterTropeStore()
    const { openSheet } = useOtherscapeCharacterTropeSheetStore()

    const choices = otherscapeCharacterTrope.choices

    return (
        <div className="character-trope-choices">
            <button
                type="button"
                className="character-trope-choices__head"
                onClick={() => openSheet({ kind: 'choices', mode: 'create' })}
                aria-label="Add a theme kit to choose between"
            >
                <span className="character-trope-choices__badge" aria-hidden>
                    ?
                </span>
                Choose One:
            </button>

            {choices.length ? (
                <ul className="character-trope-choices__list">
                    {choices.map((choice, index) => (
                        <li key={`choice-${index}-${choice.title_tag}`}>
                            <ClickableInline
                                onClick={() =>
                                    openSheet({
                                        kind: 'choices',
                                        index,
                                        mode: 'edit',
                                    })
                                }
                                ariaLabel={`Edit choice ${choice.title_tag}`}
                                className="character-trope-choice"
                            >
                                <span
                                    className="character-trope-choice__box"
                                    aria-hidden
                                />
                                <KitLine
                                    title={choice.title_tag}
                                    category={choice.category}
                                    page={choice.page}
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
                        openSheet({ kind: 'choices', mode: 'create' })
                    }
                >
                    add theme kits to choose between
                </button>
            )}
        </div>
    )
}
