import { renderLitmInline } from '@/utils/markdown'
import { ClickableInline } from '../../../shared/preview/components/Clickable'
import { SectionHeader } from '../../../shared/preview/components/SectionHeader'
import type { PowerTag, WeaknessTag } from '../../schema'

type TagKind = 'power' | 'weakness'

type Props = {
    kind: TagKind
    tags: PowerTag[] | WeaknessTag[]
    onAddClick: () => void
    onItemClick: (index: number) => void
}

export default function TagListBlock({
    kind,
    tags,
    onAddClick,
    onItemClick,
}: Props) {
    const title = kind === 'power' ? 'Power Tags' : 'Weakness Tags'

    return (
        <section className="city-card-section city-card-tags">
            <SectionHeader title={title} onClick={onAddClick} />
            {tags.length ? (
                <ul className="city-card-tag-list">
                    {tags.map((tag, index) => {
                        const active =
                            kind === 'power'
                                ? (tag as PowerTag).is_burnt
                                : (tag as WeaknessTag).is_invoked

                        return (
                            <li
                                key={`${tag.letter ?? ''}-${tag.text}-${index}`}
                            >
                                <ClickableInline
                                    onClick={() => onItemClick(index)}
                                    ariaLabel={`Edit ${kind} tag ${tag.text}`}
                                    className={`city-card-tag city-card-tag--${kind}${active ? ' city-card-tag--active' : ''}`}
                                >
                                    <span className="city-card-tag__letter">
                                        {tag.letter || '•'}
                                    </span>
                                    <span
                                        className="city-card-tag__text"
                                        dangerouslySetInnerHTML={{
                                            __html: renderLitmInline(tag.text),
                                        }}
                                    />
                                    {kind === 'weakness' ? (
                                        <span
                                            className="city-card-tag__invoke"
                                            aria-label={
                                                active
                                                    ? 'Invoked'
                                                    : 'Not invoked'
                                            }
                                        >
                                            {active ? '☑' : '☐'}
                                        </span>
                                    ) : null}
                                </ClickableInline>
                            </li>
                        )
                    })}
                </ul>
            ) : (
                <button
                    type="button"
                    className="city-card-add"
                    onClick={onAddClick}
                >
                    add {kind} tags
                </button>
            )}
        </section>
    )
}
