import { ClickableSection } from '../../../shared/preview/components/Clickable'
import { useCityOfMistCustomMoveStore, type PublicationType } from '../../hooks'

const TYPE_LABEL: Record<PublicationType, string> = {
    official: 'Official',
    third_party: 'Third Party',
    cauldron: 'Cauldron',
    homebrew: 'Homebrew',
}

export default function MetaFooter({ onClick }: { onClick: () => void }) {
    const { cityOfMistCustomMove } = useCityOfMistCustomMoveStore()
    const meta = cityOfMistCustomMove.meta
    const hasMeta =
        !!meta?.publication_type ||
        !!meta?.source ||
        (meta?.authors != null && meta.authors.length > 0) ||
        meta?.page != null

    return (
        <div className="city-move-meta-wrap">
            <ClickableSection onClick={onClick} ariaLabel="Edit metadata">
                <div className="city-move-meta">
                    {hasMeta ? (
                        <div className="city-move-meta__content">
                            {meta?.publication_type ? (
                                <span className="city-move-meta__badge">
                                    {TYPE_LABEL[meta.publication_type]}
                                </span>
                            ) : null}
                            {meta?.source ? (
                                <span className="font-semibold">
                                    {meta.source}
                                </span>
                            ) : null}
                            {meta?.authors && meta.authors.length > 0 ? (
                                <span>by {meta.authors.join(', ')}</span>
                            ) : null}
                            {meta?.page != null ? (
                                <span>(p.{meta.page})</span>
                            ) : null}
                        </div>
                    ) : (
                        <span className="city-move-placeholder city-move-placeholder--meta">
                            add attribution
                        </span>
                    )}
                </div>
            </ClickableSection>
        </div>
    )
}
