import { renderLitmInline } from '@/utils/markdown'
import { formatPower } from '@/utils/tags'
import {
    useLegendInTheMistJourneySheetStore,
    useLegendInTheMistJourneyStore,
} from '../../hooks'
import { ClickableInline } from '../components/Clickable'

/* "Tags:" in bold, then the run itself: the book prints them as one italic
   sentence rather than a list, and the amber wash comes from the shared token
   styling the Legend theme already applies. An empty run prints the affordance
   alone, so a Journey with no tag shows no orphan label. */
export default function TagsBlock() {
    const { legendInTheMistJourney } = useLegendInTheMistJourneyStore()
    const { openSheet } = useLegendInTheMistJourneySheetStore()

    const tags = legendInTheMistJourney.tags

    if (!tags.length) {
        return (
            <p className="journey-tags">
                <button
                    type="button"
                    className="text-xs underline decoration-dotted opacity-80 hover:opacity-100 cursor-pointer"
                    onClick={() => openSheet({ kind: 'tags', mode: 'create' })}
                >
                    add the tags this journey offers
                </button>
            </p>
        )
    }

    return (
        <p className="journey-tags">
            <span className="journey-tags__label">Tags:</span>{' '}
            {tags.map((tag, index) => (
                <span key={`tag-${index}-${tag}`}>
                    <ClickableInline
                        onClick={() =>
                            openSheet({
                                kind: 'tags',
                                index,
                                mode: 'edit',
                            })
                        }
                        ariaLabel={`Edit tag ${tag}`}
                    >
                        <span
                            dangerouslySetInnerHTML={{
                                __html: renderLitmInline(formatPower(tag)),
                            }}
                        />
                    </ClickableInline>
                    {index < tags.length - 1 && (
                        <span className="journey-tags__comma">, </span>
                    )}
                </span>
            ))}
        </p>
    )
}
