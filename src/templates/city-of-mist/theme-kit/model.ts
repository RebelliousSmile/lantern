import type {
    CityOfMistThemeKit,
    CrewRelationship,
    Improvement,
    Motivation,
    Question,
    SelectionRule,
    ThemeKitMeta,
    ThemeType,
} from './schema'

export type {
    CrewOutcome,
    CrewRelationship,
    Improvement,
    Motivation,
    MotivationKind,
    PublicationType,
    Question,
    SelectionRule,
    ThemeKitMeta,
    ThemeType,
} from './schema'

/* The editable document. Every optional the schema allows is filled in here so
   a form never has to guard against `undefined`: a string becomes '', a list
   becomes [], a rule and the motivation become null. `toThemeKitPayload` puts
   the empty ones back to absent, so an untouched zone never lands in the
   exported file as a deliberate empty value. */
export type ThemeKitDocument = {
    name: string
    theme_type: ThemeType
    keywords: string[]
    introduction: string
    concept: string
    power_tag_questions: Question[]
    power_tag_rule: SelectionRule | null
    weakness_tag_questions: Question[]
    weakness_tag_rule: SelectionRule | null
    extra_tags: string[]
    motivation: Motivation | null
    title_guidance: string
    crew_relationships: CrewRelationship[]
    improvements: Improvement[]
    meta?: ThemeKitMeta
}

export function toThemeKitDocument(
    themeKit: CityOfMistThemeKit
): ThemeKitDocument {
    return {
        name: themeKit.name,
        theme_type: themeKit.theme_type,
        keywords: themeKit.keywords ?? [],
        introduction: themeKit.introduction ?? '',
        concept: themeKit.concept ?? '',
        power_tag_questions: themeKit.power_tag_questions ?? [],
        power_tag_rule: themeKit.power_tag_rule ?? null,
        weakness_tag_questions: themeKit.weakness_tag_questions ?? [],
        weakness_tag_rule: themeKit.weakness_tag_rule ?? null,
        extra_tags: themeKit.extra_tags ?? [],
        motivation: themeKit.motivation ?? null,
        title_guidance: themeKit.title_guidance ?? '',
        crew_relationships: themeKit.crew_relationships ?? [],
        improvements: themeKit.improvements ?? [],
        meta: themeKit.meta,
    }
}

function questionPayload(question: Question): Record<string, unknown> {
    const entry: Record<string, unknown> = {
        letter: question.letter,
        text: question.text,
    }
    if (question.examples?.length) entry.examples = question.examples
    return entry
}

/* A rule whose two counts are zero and whose note is blank says nothing the
   printed page can use, so it is dropped rather than exported as a pair of
   zeroes the schema would then hand back as a deliberate "answer none". */
function rulePayload(
    rule: SelectionRule | null
): Record<string, unknown> | null {
    if (!rule) return null

    const note = rule.note?.trim() ?? ''
    if (!rule.required_count && !rule.chosen_count && !note) return null

    const entry: Record<string, unknown> = {
        required_count: rule.required_count,
        chosen_count: rule.chosen_count,
    }
    if (note) entry.note = note
    return entry
}

export function toThemeKitPayload(
    themeKit: ThemeKitDocument
): Record<string, unknown> {
    const payload: Record<string, unknown> = {
        name: themeKit.name,
        theme_type: themeKit.theme_type,
    }

    if (themeKit.keywords.length) payload.keywords = themeKit.keywords
    if (themeKit.introduction.trim()) {
        payload.introduction = themeKit.introduction.trim()
    }
    if (themeKit.concept.trim()) payload.concept = themeKit.concept.trim()

    if (themeKit.power_tag_questions.length) {
        payload.power_tag_questions =
            themeKit.power_tag_questions.map(questionPayload)
    }
    const powerRule = rulePayload(themeKit.power_tag_rule)
    if (powerRule) payload.power_tag_rule = powerRule

    if (themeKit.weakness_tag_questions.length) {
        payload.weakness_tag_questions =
            themeKit.weakness_tag_questions.map(questionPayload)
    }
    const weaknessRule = rulePayload(themeKit.weakness_tag_rule)
    if (weaknessRule) payload.weakness_tag_rule = weaknessRule

    if (themeKit.extra_tags.length) payload.extra_tags = themeKit.extra_tags

    if (themeKit.motivation) {
        const motivation: Record<string, unknown> = {
            kind: themeKit.motivation.kind,
            intro: themeKit.motivation.intro,
        }
        if (themeKit.motivation.examples?.length) {
            motivation.examples = themeKit.motivation.examples
        }
        if (themeKit.motivation.options?.length) {
            motivation.options = themeKit.motivation.options
        }
        if (themeKit.motivation.rule?.trim()) {
            motivation.rule = themeKit.motivation.rule.trim()
        }
        payload.motivation = motivation
    }

    if (themeKit.title_guidance.trim()) {
        payload.title_guidance = themeKit.title_guidance.trim()
    }

    if (themeKit.crew_relationships.length) {
        payload.crew_relationships = themeKit.crew_relationships.map(
            (relationship) => ({
                scenario: relationship.scenario,
                outcome: relationship.outcome,
            })
        )
    }

    if (themeKit.improvements.length) {
        payload.improvements = themeKit.improvements.map((improvement) => ({
            name: improvement.name,
            effect: improvement.effect,
        }))
    }

    const meta = themeKit.meta
    if (meta) {
        const metaPayload: Record<string, unknown> = {
            publication_type: meta.publication_type,
        }
        if (meta.source?.trim()) metaPayload.source = meta.source.trim()
        if (meta.authors?.length) metaPayload.authors = meta.authors
        if (meta.page != null) metaPayload.page = meta.page
        payload.meta = metaPayload
    }

    return payload
}

/* The fourteen zones the themebook page prints, grouped into the ten the
   editor exposes: the banner, the name and the keyword line are the header and
   always print, and each selection rule is written and hidden with the question
   list it governs rather than on its own. */
export type SectionId =
    | 'introduction'
    | 'concept'
    | 'powerTags'
    | 'weaknessTags'
    | 'extraTags'
    | 'motivation'
    | 'titleGuidance'
    | 'crewRelationships'
    | 'improvements'
    | 'meta'

export type QuestionField = 'power' | 'weakness'

export type Background =
    | 'bg0'
    | 'bg1'
    | 'bg2'
    | 'bg3'
    | 'bg4'
    | 'bg5'
    | 'bg6'
    | 'bg7'

export type ColumnCount = 1 | 2
export type TitlePlacement = 'inside' | 'outside'
export type ExportPrefs = { scale: 1 | 2 | 3 }

export type ThemeKitViewState = {
    zoom: number
    previewWidth: number
    background: Background
    columnCount: ColumnCount
    titlePlacement: TitlePlacement
    autoHideEmpty: boolean
    hidden: Record<SectionId, boolean>
    exportPrefs: ExportPrefs
}

type ListSheetTarget = {
    mode?: 'create' | 'edit'
    index?: number
}

/* `introduction`, `concept`, `extraTags` and `titleGuidance` all land on the
   concept form: they are the page's prose zones, written in one pass, and a
   panel that flipped between them for a one-line edit would cost more than it
   saves. */
export type SheetTarget =
    | { kind: 'identity'; mode?: 'edit' }
    | { kind: 'introduction'; mode?: 'edit' }
    | { kind: 'concept'; mode?: 'edit' }
    | { kind: 'extraTags'; mode?: 'edit' }
    | { kind: 'titleGuidance'; mode?: 'edit' }
    | ({ kind: 'powerTags' } & ListSheetTarget)
    | ({ kind: 'weaknessTags' } & ListSheetTarget)
    | { kind: 'motivation'; mode?: 'edit' }
    | ({ kind: 'crewRelationships' } & ListSheetTarget)
    | ({ kind: 'improvements' } & ListSheetTarget)
    | { kind: 'meta'; mode?: 'edit' }

export type ThemeKitSheetState = {
    open: boolean
    target: SheetTarget | null
}

export const PREVIEW_WIDTH_MIN = 360
export const PREVIEW_WIDTH_MAX = 920
export const PREVIEW_WIDTH_DEFAULT = 620

export const defaultHidden: Record<SectionId, boolean> = {
    introduction: false,
    concept: false,
    powerTags: false,
    weaknessTags: false,
    extraTags: false,
    motivation: false,
    titleGuidance: false,
    crewRelationships: false,
    improvements: false,
    meta: false,
}

export const defaultThemeKitView: ThemeKitViewState = {
    zoom: 1,
    previewWidth: PREVIEW_WIDTH_DEFAULT,
    background: 'bg1',
    columnCount: 1,
    titlePlacement: 'inside',
    autoHideEmpty: true,
    hidden: defaultHidden,
    exportPrefs: { scale: 2 },
}

export const defaultThemeKitSheetState: ThemeKitSheetState = {
    open: false,
    target: null,
}

/* A blank themebook starts with no improvements: the list is optional in the
   schema, so an untouched blank still exports. The five rows the books print
   are laid out by the improvements form the first time it opens, where the
   author can see and name them. */
export const blankThemeKit = (): ThemeKitDocument => ({
    name: 'Untitled Themebook',
    theme_type: 'logos',
    keywords: [],
    introduction: '',
    concept: '',
    power_tag_questions: [],
    power_tag_rule: null,
    weakness_tag_questions: [],
    weakness_tag_rule: null,
    extra_tags: [],
    motivation: null,
    title_guidance: '',
    crew_relationships: [],
    improvements: [],
    meta: { publication_type: 'homebrew' },
})
