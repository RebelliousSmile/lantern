import { renderLitmInline } from '@/utils/markdown'
import { ClickableSection } from '../../../shared/preview/components/Clickable'
import { SectionHeader } from '../../../shared/preview/components/SectionHeader'
import type { Motivation, ThemeType } from '../../schema'

const MOTIVATION_LABEL: Record<ThemeType, string> = {
    mythos: 'Mystery',
    logos: 'Identity',
    extra: 'Motivation',
    crew: 'Motivation',
}

type Props = {
    themeType: ThemeType
    motivation?: Motivation
    onClick: () => void
}

export default function MotivationBlock({
    themeType,
    motivation,
    onClick,
}: Props) {
    return (
        <section className="city-card-section city-card-motivation">
            <SectionHeader
                title={MOTIVATION_LABEL[themeType]}
                onClick={onClick}
            />
            <ClickableSection onClick={onClick} ariaLabel="Edit motivation">
                {motivation?.text ? (
                    <div
                        className="city-card-motivation__text"
                        dangerouslySetInnerHTML={{
                            __html: renderLitmInline(motivation.text),
                        }}
                    />
                ) : (
                    <span className="city-card-placeholder">
                        add a motivation
                    </span>
                )}
            </ClickableSection>
        </section>
    )
}
