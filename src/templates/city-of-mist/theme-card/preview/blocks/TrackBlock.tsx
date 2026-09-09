import { ClickableSection } from '../../../shared/preview/components/Clickable'
import type { Track } from '../../schema'

type Props = {
    label: string
    track: Track
    onClick: () => void
}

export default function TrackBlock({ label, track, onClick }: Props) {
    const maximum = Math.max(1, Math.floor(track.maximum))
    const filled = Math.max(0, Math.min(maximum, Math.floor(track.filled)))

    return (
        <ClickableSection onClick={onClick} ariaLabel={`Edit ${label} track`}>
            <div className="city-card-track">
                <span className="city-card-track__label">{label}</span>
                <span
                    className="city-card-track__boxes"
                    aria-label={`${label}: ${filled} of ${maximum} filled`}
                >
                    {Array.from({ length: maximum }).map((_, index) => (
                        <span
                            key={index}
                            className={
                                index < filled
                                    ? 'city-card-track__box city-card-track__box--filled'
                                    : 'city-card-track__box'
                            }
                            aria-hidden="true"
                        />
                    ))}
                </span>
            </div>
        </ClickableSection>
    )
}
