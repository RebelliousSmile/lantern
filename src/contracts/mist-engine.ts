import {
    MIST_ENGINE_CODECS,
    type CityOfMistCustomMove,
    type CityOfMistDanger,
    type CityOfMistThemeCard,
    type CityOfMistThemeKit,
    type LegendInTheMistChallenge,
    type LegendInTheMistJourney,
    type LegendInTheMistStoryTheme,
    type LegendInTheMistThemeKit,
    type OtherscapeChallenge,
    type OtherscapeCharacterTrope,
    type OtherscapeLoadoutItem,
    type OtherscapePowerSet,
    type OtherscapeTheme,
    type OtherscapeThemeKit,
} from 'schema-in-the-mist'
import {
    toDocumentContracts,
    type AnyDocumentContract,
} from './documentContract'

type Item<Value> =
    NonNullable<Value> extends readonly (infer Entry)[] ? Entry : never
type Meta<Document extends { meta?: unknown }> = NonNullable<Document['meta']>

export type CityCustomMovePublicationType =
    Meta<CityOfMistCustomMove>['publication_type']
export type CityCustomMoveKind = CityOfMistCustomMove['kind']
export type CityMoveTemplate = CityOfMistCustomMove['template']
export type CityRoll = NonNullable<CityOfMistCustomMove['roll']>
export type CityRollStat = CityRoll['stat']
export type CityOutcome = Item<CityOfMistCustomMove['outcomes']>
export type CityOutcomeTier = CityOutcome['tier']
export type CityCustomMoveMeta = Meta<CityOfMistCustomMove>

export type CityDangerPublicationType =
    Meta<CityOfMistDanger>['publication_type']
export type CitySpectrum = Omit<
    Item<CityOfMistDanger['spectrums']>,
    'is_countdown'
> & { is_countdown?: boolean }
export type CityDangerCustomMove = Item<CityOfMistDanger['custom_moves']>
export type CityDangerMeta = Meta<CityOfMistDanger>

export type CityCardPublicationType =
    Meta<CityOfMistThemeCard>['publication_type']
export type CityCardThemeType = CityOfMistThemeCard['theme_type']
export type CityErosionKind = NonNullable<
    CityOfMistThemeCard['erosion']
>['kind']
export type CityMotivationKind = NonNullable<
    CityOfMistThemeCard['motivation']
>['kind']
export type CityTrack = NonNullable<CityOfMistThemeCard['attention']>
export type CityErosion = NonNullable<CityOfMistThemeCard['erosion']>
export type CityPowerTag = Item<CityOfMistThemeCard['power_tags']>
export type CityWeaknessTag = Item<CityOfMistThemeCard['weakness_tags']>
export type CityCardMotivation = NonNullable<CityOfMistThemeCard['motivation']>
export type CityCardImprovement = Item<CityOfMistThemeCard['improvements']>
export type CityThemeCardMeta = Meta<CityOfMistThemeCard>

export type CityKitPublicationType =
    Meta<CityOfMistThemeKit>['publication_type']
export type CityKitThemeType = CityOfMistThemeKit['theme_type']
export type CityKitMotivationKind = NonNullable<
    CityOfMistThemeKit['motivation']
>['kind']
export type CityCrewOutcome = Item<
    CityOfMistThemeKit['crew_relationships']
>['outcome']
export type CityQuestion = Item<CityOfMistThemeKit['power_tag_questions']>
export type CitySelectionRule = NonNullable<
    CityOfMistThemeKit['power_tag_rule']
>
export type CityKitMotivation = NonNullable<CityOfMistThemeKit['motivation']>
export type CityCrewRelationship = Item<
    CityOfMistThemeKit['crew_relationships']
>
export type CityKitImprovement = Item<CityOfMistThemeKit['improvements']>
export type CityThemeKitMeta = Meta<CityOfMistThemeKit>

export type LitmMightLevel = Item<LegendInTheMistChallenge['mights']>['level']
export type LitmChallengePublicationType =
    Meta<LegendInTheMistChallenge>['publication_type']
export type LitmMight = Item<LegendInTheMistChallenge['mights']>
export type LitmLimit = Item<LegendInTheMistChallenge['limits']>
export type LitmThreat = Item<LegendInTheMistChallenge['threats']>
export type LitmSpecialFeature = Item<
    LegendInTheMistChallenge['special_features']
>
export type LitmSecret = Item<LegendInTheMistChallenge['secrets']>
export type LitmChallengeMeta = Meta<LegendInTheMistChallenge>

export type LitmJourneyType = LegendInTheMistJourney['type']
export type LitmJourneyPublicationType =
    Meta<LegendInTheMistJourney>['publication_type']
export type LitmVignette = Item<LegendInTheMistJourney['vignettes']>
export type LitmJourneyMeta = Meta<LegendInTheMistJourney>

export type LitmThemeLevel = LegendInTheMistStoryTheme['level']
export type LitmStoryPublicationType =
    Meta<LegendInTheMistStoryTheme>['publication_type']
export type LitmStoryThemeMeta = Meta<LegendInTheMistStoryTheme>

export type LitmKitPublicationType =
    Meta<LegendInTheMistThemeKit>['publication_type']
export type LitmKitImprovement = Item<LegendInTheMistThemeKit['improvements']>
export type LitmThemeKitMeta = Meta<LegendInTheMistThemeKit>

export type OsChallengePublicationType =
    Meta<OtherscapeChallenge>['publication_type']
export type OsLimit = Item<OtherscapeChallenge['limits']>
export type OsSpecial = Item<OtherscapeChallenge['specials']>
export type OsThreat = Item<OtherscapeChallenge['threats']>
export type OsChallengeMeta = Meta<OtherscapeChallenge>

export type OsTropePublicationType =
    Meta<OtherscapeCharacterTrope>['publication_type']
export type OsThemeKitReference = Item<OtherscapeCharacterTrope['theme_kits']>
export type OsCharacterTropeMeta = Meta<OtherscapeCharacterTrope>

export type OsLoadoutPublicationType =
    Meta<OtherscapeLoadoutItem>['publication_type']
export type OsLoadoutItemMeta = Meta<OtherscapeLoadoutItem>

export type OsPowerSetType = OtherscapePowerSet['type']
export type OsPowerPublicationType =
    Meta<OtherscapePowerSet>['publication_type']
export type OsPowerSpecial = Item<OtherscapePowerSet['specials']>
export type OsPowerThreat = Item<OtherscapePowerSet['threats']>
export type OsPowerSetMeta = Meta<OtherscapePowerSet>

export type OsThemeType = OtherscapeTheme['theme_type']
export type OsThemePublicationType = Meta<OtherscapeTheme>['publication_type']
export type OsThemeMeta = Meta<OtherscapeTheme>

export type OsKitThemeType = OtherscapeThemeKit['theme_type']
export type OsKitPublicationType = Meta<OtherscapeThemeKit>['publication_type']
export type OsThemeKitMeta = Meta<OtherscapeThemeKit>

const SOURCE = '__canonicalSource'

export function carryCanonicalSource<
    Form extends object,
    Canonical extends object,
>(form: Form, source: Canonical): Form {
    return Object.assign(form, { [SOURCE]: source })
}

export function overlayCanonicalSource<
    Form extends object,
    Owned extends object = Form,
>(form: Form, owned: Owned = form as unknown as Owned): Owned {
    const carrier = form as Form & { [SOURCE]?: object }
    const { [SOURCE]: source } = carrier
    const clean = { ...owned } as Owned & { [SOURCE]?: object }
    delete clean[SOURCE]
    return { ...source, ...clean } as Owned
}

export { MIST_ENGINE_CODECS }

/**
 * The fourteen Mist targets as registry entries, keyed `mist/<game>/<object>`.
 * The codecs are the package's own; the canonical-source carry below stays where
 * it is, since it wraps a module's call site, not the codec.
 */
export const mistDocumentContracts: AnyDocumentContract[] = toDocumentContracts(
    'mist',
    MIST_ENGINE_CODECS
)

export function stringifyCanonical(
    codec: { stringifyToml(value: any): string },
    form: object,
    owned: object = form
): string {
    return codec.stringifyToml(overlayCanonicalSource(form, owned))
}
