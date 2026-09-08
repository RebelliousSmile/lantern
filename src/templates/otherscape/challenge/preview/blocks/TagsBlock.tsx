import { renderLitmInline } from '@/utils/markdown'
import { ClickableInline } from '../../../shared/preview/components/Clickable'
import { SectionHeader } from '../../../shared/preview/components/SectionHeader'
import {
    useOtherscapeChallengeSheetStore,
    useOtherscapeChallengeStore,
} from '../../hooks'

export default function TagsBlock() {
    const { otherscapeChallenge } = useOtherscapeChallengeStore()
    const { openSheet } = useOtherscapeChallengeSheetStore()

    const tags = otherscapeChallenge.tags_and_statuses

    return (
        <div className="challenge-tags">
            <SectionHeader
                title="Tags & Statuses"
                onClick={() => openSheet({ kind: 'tags', mode: 'create' })}
            />

            {tags.length ? (
                <ul className="challenge-tags__list">
                    {tags.map((tag, index) => (
                        <li key={`tag-${index}-${tag}`}>
                            <ClickableInline
                                onClick={() =>
                                    openSheet({
                                        kind: 'tags',
                                        index,
                                        mode: 'edit',
                                    })
                                }
                                ariaLabel={`Edit tag ${tag}`}
                                className="challenge-tags__item"
                            >
                                {/* This list is the one stored with its own
                                    braces, so it goes to the renderer as
                                    written: bracing it again would print the
                                    braces rather than a token. */}
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: renderLitmInline(tag),
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
                    onClick={() => openSheet({ kind: 'tags', mode: 'create' })}
                >
                    add tags and statuses
                </button>
            )}
        </div>
    )
}
