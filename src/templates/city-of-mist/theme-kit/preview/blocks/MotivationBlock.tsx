import { renderLitmInline } from '@/utils/markdown'
import { ClickableSection } from '../../../shared/preview/components/Clickable'
import { SectionHeader } from '../../../shared/preview/components/SectionHeader'
import type { Motivation, ThemeType } from '../../schema'

/* The heading is the theme type's, not the zone's: a Mythos asks a Mystery and
   a Logos states an Identity, so switching the type renames the heading without
   touching a word the author wrote inside it. An Extra leaves the choice to the
   player, and the books head it with both. A Crew prints its relationships
   instead and never reaches this block, but the entry is here so the record
   stays exhaustive. */
const HEADING: Record<ThemeType, string> = {
    mythos: 'Mystery',
    logos: 'Identity',
    extra: 'Mystery or Identity',
    crew: 'Motivation',
}

type Props = {
    themeType: ThemeType
    motivation: Motivation | null
    onClick: () => void
}

export default function MotivationBlock({
    themeType,
    motivation,
    onClick,
}: Props) {
    return (
        <section className="city-kit-section city-kit-motivation">
            <SectionHeader title={HEADING[themeType]} onClick={onClick} />
            <ClickableSection onClick={onClick} ariaLabel="Edit motivation">
                {motivation ? (
                    <div className="city-kit-motivation__body">
                        <div
                            className="city-kit-motivation__intro"
                            dangerouslySetInnerHTML={{
                                __html: renderLitmInline(motivation.intro),
                            }}
                        />
                        {motivation.options?.length ? (
                            <ul className="city-kit-motivation__options">
                                {motivation.options.map((option, index) => (
                                    <li key={`${index}-${option}`}>
                                        <span className="city-kit-motivation__box">
                                            ☐
                                        </span>
                                        {option}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="city-kit-motivation__line" />
                        )}
                        {motivation.examples?.length ? (
                            <div className="city-kit-motivation__examples">
                                {motivation.examples.join(', ')}
                            </div>
                        ) : null}
                        {motivation.rule ? (
                            <div className="city-kit-rule-static">
                                {motivation.rule}
                            </div>
                        ) : null}
                    </div>
                ) : (
                    <span className="city-kit-placeholder">
                        add a motivation
                    </span>
                )}
            </ClickableSection>
        </section>
    )
}
