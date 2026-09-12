import type {
    CityCardPublicationType as PublicationType,
    CityThemeCardMeta as ThemeCardMeta,
} from '@/contracts/mist-engine'
import { ClickableSection } from '../../../shared/preview/components/Clickable'

const TYPE_LABEL: Record<PublicationType, string> = {
    official: 'Official',
    third_party: 'Third Party',
    cauldron: 'Cauldron',
    homebrew: 'Homebrew',
}

type Props = {
    meta?: ThemeCardMeta
    onClick: () => void
}

export default function MetaFooter({ meta, onClick }: Props) {
    const hasMeta =
        !!meta?.publication_type ||
        !!meta?.source ||
        !!meta?.authors?.length ||
        meta?.page != null

    return (
        <footer className="city-card-meta">
            <ClickableSection onClick={onClick} ariaLabel="Edit metadata">
                {hasMeta ? (
                    <div className="city-card-meta__content">
                        {meta?.publication_type ? (
                            <span className="city-card-meta__badge">
                                {TYPE_LABEL[meta.publication_type]}
                            </span>
                        ) : null}
                        {meta?.source ? (
                            <span className="city-card-meta__source">
                                {meta.source}
                            </span>
                        ) : null}
                        {meta?.authors?.length ? (
                            <span>by {meta.authors.join(', ')}</span>
                        ) : null}
                        {meta?.page != null ? (
                            <span>(p.{meta.page})</span>
                        ) : null}
                    </div>
                ) : (
                    <span className="city-card-placeholder city-card-placeholder--meta">
                        add attribution
                    </span>
                )}
            </ClickableSection>
        </footer>
    )
}
