import type {
    CityQuestion as Question,
    CitySelectionRule as SelectionRule,
} from '@/contracts/mist-engine'
import { renderLitmInline } from '@/utils/markdown'
import { ClickableInline } from '../../../shared/preview/components/Clickable'
import { SectionHeader } from '../../../shared/preview/components/SectionHeader'

type Props = {
    title: string
    questions: Question[]
    rule: SelectionRule | null
    placeholder: string
    onAddClick: () => void
    onItemClick: (index: number) => void
    onRuleClick: () => void
}

/* The books print the rule as a sentence, not as two numbers, so the counts
   are turned back into one here. A themebook that words its own rule wins:
   the note is printed verbatim and the counts only feed the fallback. */
function ruleSentence(rule: SelectionRule | null): string | null {
    if (!rule) return null

    const note = rule.note?.trim()
    if (note) return note

    const parts: string[] = []
    if (rule.required_count) {
        parts.push(
            rule.required_count === 1
                ? 'Answer the first question'
                : `Answer the first ${rule.required_count} questions`
        )
    }
    if (rule.chosen_count) {
        parts.push(
            parts.length
                ? `then ${rule.chosen_count} more of your choice`
                : `Answer ${rule.chosen_count} questions of your choice`
        )
    }

    return parts.length ? `${parts.join(', ')}.` : null
}

export default function QuestionListBlock({
    title,
    questions,
    rule,
    placeholder,
    onAddClick,
    onItemClick,
    onRuleClick,
}: Props) {
    const sentence = ruleSentence(rule)

    return (
        <section className="city-kit-section city-kit-questions">
            <SectionHeader title={title} onClick={onAddClick} />
            {questions.length ? (
                <ol className="city-kit-question-list">
                    {questions.map((question, index) => (
                        <li key={`${index}-${question.text}`}>
                            <ClickableInline
                                onClick={() => onItemClick(index)}
                                ariaLabel={`Edit question ${question.letter}`}
                                className="city-kit-question"
                            >
                                <span className="city-kit-question__letter">
                                    {question.letter}
                                </span>
                                <span className="city-kit-question__body">
                                    <span
                                        className="city-kit-question__text"
                                        dangerouslySetInnerHTML={{
                                            __html: renderLitmInline(
                                                question.text
                                            ),
                                        }}
                                    />
                                    {question.examples?.length ? (
                                        <span className="city-kit-question__examples">
                                            {question.examples.join(', ')}
                                        </span>
                                    ) : null}
                                </span>
                            </ClickableInline>
                        </li>
                    ))}
                </ol>
            ) : (
                <button
                    type="button"
                    className="city-kit-add"
                    onClick={onAddClick}
                >
                    {placeholder}
                </button>
            )}

            {sentence ? (
                <ClickableInline
                    onClick={onRuleClick}
                    ariaLabel={`Edit ${title} selection rule`}
                    className="city-kit-rule"
                >
                    {sentence}
                </ClickableInline>
            ) : null}
        </section>
    )
}
