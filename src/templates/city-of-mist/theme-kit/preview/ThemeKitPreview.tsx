import { SectionGate } from '../../shared/preview/components/SectionGate'
import { SectionHeader } from '../../shared/preview/components/SectionHeader'
import {
    shouldShow,
    useCityOfMistThemeKitSheetStore,
    useCityOfMistThemeKitStore,
    useCityOfMistThemeKitViewStore,
} from '../hooks'
import ConceptBlock from './blocks/ConceptBlock'
import CrewRelationshipsBlock from './blocks/CrewRelationshipsBlock'
import ImprovementsBlock from './blocks/ImprovementsBlock'
import IntroductionBlock from './blocks/IntroductionBlock'
import MetaFooter from './blocks/MetaFooter'
import MotivationBlock from './blocks/MotivationBlock'
import QuestionListBlock from './blocks/QuestionListBlock'
import ThemebookHeader from './blocks/ThemebookHeader'
import './themeKitTheme.css'

export function ThemeKitPreview() {
    const { cityOfMistThemeKit } = useCityOfMistThemeKitStore()
    const { openSheet } = useCityOfMistThemeKitSheetStore()
    const view = useCityOfMistThemeKitViewStore()
    const { zoom, background, columnCount, titlePlacement } = view

    const themeType = cityOfMistThemeKit.theme_type
    const isTwoColumns = columnCount === 2
    /* The banner is what a reader scans a page of themebooks by, so on the
       two-column layout it can be lifted out of the flow and run the full width
       instead of heading one column. On a single column there is nothing to
       lift it out of. */
    const titleOutside = isTwoColumns && titlePlacement === 'outside'

    const showIntroduction = shouldShow(
        cityOfMistThemeKit,
        'introduction',
        view
    )
    const showConcept = shouldShow(cityOfMistThemeKit, 'concept', view)
    const showPowerTags = shouldShow(cityOfMistThemeKit, 'powerTags', view)
    const showWeaknessTags = shouldShow(
        cityOfMistThemeKit,
        'weaknessTags',
        view
    )
    const showExtraTags = shouldShow(cityOfMistThemeKit, 'extraTags', view)
    const showTitleGuidance = shouldShow(
        cityOfMistThemeKit,
        'titleGuidance',
        view
    )
    const showImprovements = shouldShow(
        cityOfMistThemeKit,
        'improvements',
        view
    )
    const showMeta = shouldShow(cityOfMistThemeKit, 'meta', view)

    /* A Crew themebook prints its relationships in place of the motivation, so
       the two zones are exclusive on the page even though both are stored and
       both stay editable from the appearance panel. */
    const isCrew = themeType === 'crew'
    const showMotivation =
        !isCrew && shouldShow(cityOfMistThemeKit, 'motivation', view)
    const showCrew =
        isCrew && shouldShow(cityOfMistThemeKit, 'crewRelationships', view)

    const header = (
        <ThemebookHeader
            themeType={themeType}
            name={cityOfMistThemeKit.name}
            keywords={cityOfMistThemeKit.keywords}
            onClick={() => openSheet({ kind: 'identity', mode: 'edit' })}
        />
    )

    return (
        <div className="w-full">
            <div
                className="inline-flex w-full flex-col items-start"
                style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: 'top left',
                }}
            >
                <article
                    className={`city-doc city-kit-page ${background}`}
                    data-columns={columnCount}
                >
                    {titleOutside ? header : null}

                    <div
                        className={
                            isTwoColumns
                                ? 'city-kit-flow city-kit-flow--columns'
                                : 'city-kit-flow'
                        }
                    >
                        {titleOutside ? null : header}

                        <SectionGate show={showIntroduction}>
                            <IntroductionBlock
                                introduction={cityOfMistThemeKit.introduction}
                                onClick={() =>
                                    openSheet({
                                        kind: 'introduction',
                                        mode: 'edit',
                                    })
                                }
                            />
                        </SectionGate>

                        <SectionGate show={showConcept}>
                            <ConceptBlock
                                title="Concept"
                                text={cityOfMistThemeKit.concept}
                                placeholder="add a concept"
                                onClick={() =>
                                    openSheet({ kind: 'concept', mode: 'edit' })
                                }
                            />
                        </SectionGate>

                        <SectionGate show={showPowerTags}>
                            <QuestionListBlock
                                title="Power Tag Questions"
                                questions={
                                    cityOfMistThemeKit.power_tag_questions
                                }
                                rule={cityOfMistThemeKit.power_tag_rule}
                                placeholder="add power tag questions"
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
                                onRuleClick={() =>
                                    openSheet({
                                        kind: 'powerTags',
                                        mode: 'edit',
                                    })
                                }
                            />
                        </SectionGate>

                        <SectionGate show={showWeaknessTags}>
                            <QuestionListBlock
                                title="Weakness Tag Questions"
                                questions={
                                    cityOfMistThemeKit.weakness_tag_questions
                                }
                                rule={cityOfMistThemeKit.weakness_tag_rule}
                                placeholder="add weakness tag questions"
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
                                onRuleClick={() =>
                                    openSheet({
                                        kind: 'weaknessTags',
                                        mode: 'edit',
                                    })
                                }
                            />
                        </SectionGate>

                        <SectionGate show={showExtraTags}>
                            <section className="city-kit-section city-kit-extra-tags">
                                <SectionHeader
                                    title="Extra Tags"
                                    onClick={() =>
                                        openSheet({
                                            kind: 'extraTags',
                                            mode: 'edit',
                                        })
                                    }
                                />
                                <ul className="city-kit-tag-row">
                                    {cityOfMistThemeKit.extra_tags.map(
                                        (tag, index) => (
                                            <li key={`${index}-${tag}`}>
                                                {tag}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </section>
                        </SectionGate>

                        <SectionGate show={showMotivation}>
                            <MotivationBlock
                                themeType={themeType}
                                motivation={cityOfMistThemeKit.motivation}
                                onClick={() =>
                                    openSheet({
                                        kind: 'motivation',
                                        mode: 'edit',
                                    })
                                }
                            />
                        </SectionGate>

                        <SectionGate show={showCrew}>
                            <CrewRelationshipsBlock
                                relationships={
                                    cityOfMistThemeKit.crew_relationships
                                }
                                onAddClick={() =>
                                    openSheet({
                                        kind: 'crewRelationships',
                                        mode: 'create',
                                    })
                                }
                                onItemClick={(index) =>
                                    openSheet({
                                        kind: 'crewRelationships',
                                        mode: 'edit',
                                        index,
                                    })
                                }
                            />
                        </SectionGate>

                        <SectionGate show={showTitleGuidance}>
                            <ConceptBlock
                                title="Theme Title"
                                text={cityOfMistThemeKit.title_guidance}
                                placeholder="add title guidance"
                                onClick={() =>
                                    openSheet({
                                        kind: 'titleGuidance',
                                        mode: 'edit',
                                    })
                                }
                            />
                        </SectionGate>

                        <SectionGate show={showImprovements}>
                            <ImprovementsBlock
                                themebookName={cityOfMistThemeKit.name}
                                improvements={cityOfMistThemeKit.improvements}
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
                                meta={cityOfMistThemeKit.meta}
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
