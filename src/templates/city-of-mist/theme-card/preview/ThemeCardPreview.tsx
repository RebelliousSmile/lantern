import { SectionGate } from '../../shared/preview/components/SectionGate'
import {
    shouldShow,
    useCityOfMistThemeCardSheetStore,
    useCityOfMistThemeCardStore,
    useCityOfMistThemeCardViewStore,
} from '../hooks'
import CardHeader from './blocks/CardHeader'
import ImprovementsBlock from './blocks/ImprovementsBlock'
import MetaFooter from './blocks/MetaFooter'
import MotivationBlock from './blocks/MotivationBlock'
import TagListBlock from './blocks/TagListBlock'
import TrackBlock from './blocks/TrackBlock'
import './themeCardTheme.css'

export function ThemeCardPreview() {
    const { cityOfMistThemeCard } = useCityOfMistThemeCardStore()
    const { openSheet } = useCityOfMistThemeCardSheetStore()
    const view = useCityOfMistThemeCardViewStore()
    const { zoom, background } = view

    const showIdentity = shouldShow(cityOfMistThemeCard, 'identity', view)
    const showMotivation = shouldShow(cityOfMistThemeCard, 'motivation', view)
    const showTracks = shouldShow(cityOfMistThemeCard, 'tracks', view)
    const showPowerTags = shouldShow(cityOfMistThemeCard, 'powerTags', view)
    const showWeaknessTags = shouldShow(
        cityOfMistThemeCard,
        'weaknessTags',
        view
    )
    const showImprovements = shouldShow(
        cityOfMistThemeCard,
        'improvements',
        view
    )
    const showMeta = shouldShow(cityOfMistThemeCard, 'meta', view)
    const showErosion =
        cityOfMistThemeCard.theme_type === 'mythos' ||
        cityOfMistThemeCard.theme_type === 'logos'

    return (
        <div className="w-full">
            <div
                className="inline-flex w-full flex-col items-start"
                style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: 'top left',
                }}
            >
                <article className={`city-doc city-card-card ${background}`}>
                    <SectionGate show={showIdentity}>
                        <CardHeader
                            themebook={cityOfMistThemeCard.themebook}
                            title={cityOfMistThemeCard.title}
                            onClick={() =>
                                openSheet({ kind: 'identity', mode: 'edit' })
                            }
                        />
                    </SectionGate>

                    <div className="city-card-flow">
                        <SectionGate show={showMotivation}>
                            <MotivationBlock
                                themeType={cityOfMistThemeCard.theme_type}
                                motivation={cityOfMistThemeCard.motivation}
                                onClick={() =>
                                    openSheet({
                                        kind: 'motivation',
                                        mode: 'edit',
                                    })
                                }
                            />
                        </SectionGate>

                        <SectionGate show={showTracks}>
                            <div className="city-card-section city-card-tracks">
                                {cityOfMistThemeCard.attention ? (
                                    <TrackBlock
                                        label="Attention"
                                        track={cityOfMistThemeCard.attention}
                                        onClick={() =>
                                            openSheet({
                                                kind: 'tracks',
                                                mode: 'edit',
                                            })
                                        }
                                    />
                                ) : null}
                                {showErosion && cityOfMistThemeCard.erosion ? (
                                    <TrackBlock
                                        label={
                                            cityOfMistThemeCard.theme_type ===
                                            'mythos'
                                                ? 'Fade'
                                                : 'Crack'
                                        }
                                        track={cityOfMistThemeCard.erosion}
                                        onClick={() =>
                                            openSheet({
                                                kind: 'tracks',
                                                mode: 'edit',
                                            })
                                        }
                                    />
                                ) : null}
                            </div>
                        </SectionGate>

                        <SectionGate show={showPowerTags}>
                            <TagListBlock
                                kind="power"
                                tags={cityOfMistThemeCard.power_tags}
                                onAddClick={() =>
                                    openSheet({
                                        kind: 'powerTags',
                                        mode: 'create',
                                    })
                                }
                                onItemClick={(index) =>
                                    openSheet({
                                        kind: 'powerTags',
                                        mode: 'edit',
                                        index,
                                    })
                                }
                            />
                        </SectionGate>

                        <SectionGate show={showWeaknessTags}>
                            <TagListBlock
                                kind="weakness"
                                tags={cityOfMistThemeCard.weakness_tags}
                                onAddClick={() =>
                                    openSheet({
                                        kind: 'weaknessTags',
                                        mode: 'create',
                                    })
                                }
                                onItemClick={(index) =>
                                    openSheet({
                                        kind: 'weaknessTags',
                                        mode: 'edit',
                                        index,
                                    })
                                }
                            />
                        </SectionGate>

                        <SectionGate show={showImprovements}>
                            <ImprovementsBlock
                                improvements={cityOfMistThemeCard.improvements}
                                onAddClick={() =>
                                    openSheet({
                                        kind: 'improvements',
                                        mode: 'create',
                                    })
                                }
                                onItemClick={(index) =>
                                    openSheet({
                                        kind: 'improvements',
                                        mode: 'edit',
                                        index,
                                    })
                                }
                            />
                        </SectionGate>

                        <SectionGate show={showMeta}>
                            <MetaFooter
                                meta={cityOfMistThemeCard.meta}
                                onClick={() =>
                                    openSheet({ kind: 'meta', mode: 'edit' })
                                }
                            />
                        </SectionGate>
                    </div>
                </article>
            </div>
        </div>
    )
}
