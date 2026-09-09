import { ClickableSection } from '../../../shared/preview/components/Clickable'

type Props = {
    themebook?: string
    title: string
    onClick: () => void
}

export default function CardHeader({ themebook, title, onClick }: Props) {
    return (
        <header className="city-card-header">
            <ClickableSection onClick={onClick} ariaLabel="Edit card identity">
                <div className="city-card-themebook">
                    {themebook || (
                        <span className="city-card-placeholder">themebook</span>
                    )}
                </div>
                <h2 className="city-card-title">
                    {title || (
                        <span className="city-card-placeholder">
                            Untitled Theme
                        </span>
                    )}
                </h2>
            </ClickableSection>
        </header>
    )
}
