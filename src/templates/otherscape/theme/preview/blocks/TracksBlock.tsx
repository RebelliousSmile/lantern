import { ClickableSection } from '../../../shared/preview/components/Clickable'
import {
    useOtherscapeThemeSheetStore,
    useOtherscapeThemeStore,
} from '../../hooks'
import { TRACK_LABEL, TRACK_MAX, type TrackField } from '../../model'

/* :Otherscape prints two tracks and nothing else: three boxes for Upgrade and
   three for Decay. There is no tier and no milestone row here, those belong to
   Legend in the Mist. A track the theme has never carried prints its boxes
   empty rather than disappearing, because the printed card always shows both
   rows: it is the sheet a player marks, not a summary of what is marked. */
function TrackRow({ field }: { field: TrackField }) {
    const { otherscapeTheme } = useOtherscapeThemeStore()
    const { openSheet } = useOtherscapeThemeSheetStore()

    const value = otherscapeTheme[field] ?? 0
    const pips = Array.from({ length: TRACK_MAX }, (_, index) => index < value)

    return (
        <ClickableSection
            onClick={() => openSheet({ kind: 'tracks', field, mode: 'edit' })}
            ariaLabel={`Edit the ${TRACK_LABEL[field]} track`}
        >
            <div className={`theme-track theme-track--${field}`}>
                <span className="os-label theme-track__label">
                    {TRACK_LABEL[field]}
                </span>
                <span
                    className="theme-track__pips"
                    role="img"
                    aria-label={`${TRACK_LABEL[field]} ${otherscapeTheme[field] ?? 0} of ${TRACK_MAX}`}
                >
                    {pips.map((filled, index) => (
                        <span
                            key={index}
                            className={
                                filled
                                    ? 'theme-track__pip theme-track__pip--filled'
                                    : 'theme-track__pip'
                            }
                        />
                    ))}
                </span>
            </div>
        </ClickableSection>
    )
}

export default function TracksBlock() {
    return (
        <div className="theme-tracks">
            <TrackRow field="upgrade" />
            <TrackRow field="decay" />
        </div>
    )
}
