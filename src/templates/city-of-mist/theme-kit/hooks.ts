import { useActiveTemplateTab } from '@/core/workspace/selectors'
import { getActiveTab, useWorkspaceStore } from '@/core/workspace/store'
import type { WorkspaceTab } from '@/core/workspace/types'
import type {
    CrewRelationship,
    Improvement,
    Motivation,
    Question,
    QuestionField,
    SectionId,
    SelectionRule,
    SheetTarget,
    ThemeKitDocument,
    ThemeKitMeta,
    ThemeKitSheetState,
    ThemeKitViewState,
    ThemeType,
} from './model'
import {
    blankThemeKit,
    defaultHidden,
    defaultThemeKitSheetState,
    defaultThemeKitView,
    PREVIEW_WIDTH_MAX,
    PREVIEW_WIDTH_MIN,
} from './model'

export type {
    Background,
    ColumnCount,
    CrewOutcome,
    CrewRelationship,
    ExportPrefs,
    Improvement,
    Motivation,
    MotivationKind,
    PublicationType,
    Question,
    QuestionField,
    SectionId,
    SelectionRule,
    SheetTarget,
    ThemeKitDocument,
    ThemeKitMeta,
    ThemeKitSheetState,
    ThemeKitViewState,
    ThemeType,
    TitlePlacement,
} from './model'

type ThemeKitTab = WorkspaceTab<
    ThemeKitDocument,
    ThemeKitViewState,
    ThemeKitSheetState
>

const TEMPLATE_ID = 'city.themeKit'

function cloneValue<T>(value: T): T {
    if (typeof structuredClone === 'function') {
        return structuredClone(value)
    }

    return JSON.parse(JSON.stringify(value)) as T
}

const fallbackThemeKit = blankThemeKit()
const fallbackView = cloneValue(defaultThemeKitView)

function clamp(n: number, lo: number, hi: number) {
    const x = Math.floor(Number(n) || 0)
    return Math.max(lo, Math.min(hi, x))
}

function strOrUndefined(value?: string | null) {
    const text = (value ?? '').trim()
    return text ? text : undefined
}

/* The letter is the row's position, not a stored choice: the books print A, B,
   C down the list, so a reorder or a removal has to renumber every row after
   it. Past Z the letter stops advancing rather than running into punctuation,
   which the schema would reject. */
export function letterAt(index: number) {
    return String.fromCharCode(65 + Math.min(index, 25))
}

function reletter(questions: Question[]): Question[] {
    return questions.map((question, index) => ({
        ...question,
        letter: letterAt(index),
    }))
}

function useThemeKitTab() {
    return useActiveTemplateTab<
        ThemeKitDocument,
        ThemeKitViewState,
        ThemeKitSheetState
    >(TEMPLATE_ID)
}

export function useCityOfMistThemeKitStore() {
    const tab = useThemeKitTab()
    const replaceTabDoc = useWorkspaceStore((state) => state.replaceTabDoc)
    const updateTabDoc = useWorkspaceStore((state) => state.updateTabDoc)

    const cityOfMistThemeKit = tab?.doc ?? fallbackThemeKit

    const apply = (
        producer: (current: ThemeKitDocument) => ThemeKitDocument
    ) => {
        if (!tab) return

        updateTabDoc(tab.id, (currentDoc) =>
            producer(cloneValue(currentDoc as ThemeKitDocument))
        )
    }

    const questionsOf = (current: ThemeKitDocument, field: QuestionField) =>
        field === 'power'
            ? current.power_tag_questions
            : current.weakness_tag_questions

    const withQuestions = (
        current: ThemeKitDocument,
        field: QuestionField,
        questions: Question[]
    ): ThemeKitDocument =>
        field === 'power'
            ? { ...current, power_tag_questions: reletter(questions) }
            : { ...current, weakness_tag_questions: reletter(questions) }

    return {
        cityOfMistThemeKit,
        setCityOfMistThemeKit: (update: Partial<ThemeKitDocument>) =>
            apply((current) => ({ ...current, ...update })),
        replaceCityOfMistThemeKit: (next: ThemeKitDocument) => {
            if (!tab) return
            replaceTabDoc(tab.id, cloneValue(next))
        },
        resetCityOfMistThemeKit: () => {
            if (!tab) return
            replaceTabDoc(tab.id, blankThemeKit())
        },
        /* Switching family renames the motivation zone rather than emptying it:
           a Mythos asks a Mystery, a Logos states an Identity, an Extra leaves
           the choice to the player. The written intro, examples and options
           survive the swap. A Crew prints its relationships instead, so its
           motivation is left untouched rather than deleted — switching back
           finds it as it was. */
        setThemeType: (theme_type: ThemeType) =>
            apply((current) => {
                if (!current.motivation || theme_type === 'crew') {
                    return { ...current, theme_type }
                }

                return {
                    ...current,
                    theme_type,
                    motivation: {
                        ...current.motivation,
                        kind:
                            theme_type === 'mythos'
                                ? 'mystery'
                                : theme_type === 'logos'
                                  ? 'identity'
                                  : 'either',
                    },
                }
            }),
        setKeywords: (keywords: string[]) =>
            apply((current) => ({ ...current, keywords })),
        setExtraTags: (extra_tags: string[]) =>
            apply((current) => ({ ...current, extra_tags })),
        addQuestion: (field: QuestionField, text = 'New question') =>
            apply((current) =>
                withQuestions(current, field, [
                    ...questionsOf(current, field),
                    { letter: 'A', text },
                ])
            ),
        updateQuestionAt: (
            field: QuestionField,
            index: number,
            update: Partial<Question>
        ) =>
            apply((current) => {
                const questions = [...questionsOf(current, field)]
                const previous = questions[index]
                if (!previous) return current

                questions[index] = { ...previous, ...update }
                return withQuestions(current, field, questions)
            }),
        removeQuestionAt: (field: QuestionField, index: number) =>
            apply((current) => {
                const questions = [...questionsOf(current, field)]
                questions.splice(index, 1)
                return withQuestions(current, field, questions)
            }),
        moveQuestion: (field: QuestionField, from: number, to: number) =>
            apply((current) => {
                const questions = [...questionsOf(current, field)]
                if (
                    from < 0 ||
                    from >= questions.length ||
                    to < 0 ||
                    to >= questions.length
                ) {
                    return current
                }

                const [item] = questions.splice(from, 1)
                questions.splice(to, 0, item)
                return withQuestions(current, field, questions)
            }),
        setRule: (field: QuestionField, update: Partial<SelectionRule>) =>
            apply((current) => {
                const previous = (field === 'power'
                    ? current.power_tag_rule
                    : current.weakness_tag_rule) ?? {
                    required_count: 0,
                    chosen_count: 0,
                }

                const rule: SelectionRule = { ...previous, ...update }
                rule.note = strOrUndefined(rule.note)

                return field === 'power'
                    ? { ...current, power_tag_rule: rule }
                    : { ...current, weakness_tag_rule: rule }
            }),
        setMotivation: (update: Partial<Motivation> | null) =>
            apply((current) => {
                if (update === null) return { ...current, motivation: null }

                const previous: Motivation = current.motivation ?? {
                    kind:
                        current.theme_type === 'mythos'
                            ? 'mystery'
                            : current.theme_type === 'logos'
                              ? 'identity'
                              : 'either',
                    intro: '',
                }

                return { ...current, motivation: { ...previous, ...update } }
            }),
        addCrewRelationship: (relationship: CrewRelationship) =>
            apply((current) => ({
                ...current,
                crew_relationships: [
                    ...current.crew_relationships,
                    { ...relationship },
                ],
            })),
        updateCrewRelationshipAt: (
            index: number,
            update: Partial<CrewRelationship>
        ) =>
            apply((current) => {
                const relationships = [...current.crew_relationships]
                const previous = relationships[index]
                if (!previous) return current

                relationships[index] = { ...previous, ...update }
                return { ...current, crew_relationships: relationships }
            }),
        removeCrewRelationshipAt: (index: number) =>
            apply((current) => {
                const relationships = [...current.crew_relationships]
                relationships.splice(index, 1)
                return { ...current, crew_relationships: relationships }
            }),
        moveCrewRelationship: (from: number, to: number) =>
            apply((current) => {
                const relationships = [...current.crew_relationships]
                if (
                    from < 0 ||
                    from >= relationships.length ||
                    to < 0 ||
                    to >= relationships.length
                ) {
                    return current
                }

                const [item] = relationships.splice(from, 1)
                relationships.splice(to, 0, item)
                return { ...current, crew_relationships: relationships }
            }),
        addImprovement: (improvement: Improvement) =>
            apply((current) => ({
                ...current,
                improvements: [...current.improvements, { ...improvement }],
            })),
        addImprovements: (improvements: Improvement[]) =>
            apply((current) => ({
                ...current,
                improvements: [
                    ...current.improvements,
                    ...improvements.map((improvement) => ({ ...improvement })),
                ],
            })),
        /* The form lays out the five rows the books print before the document
           holds them, so a keystroke on row four has to bring rows two and
           three into existence with it. Padding inside the producer keeps the
           write idempotent, which matters because the inspector mounts twice. */
        setImprovementAt: (index: number, update: Partial<Improvement>) =>
            apply((current) => {
                const improvements = [...current.improvements]
                while (improvements.length <= index) {
                    improvements.push({ name: '', effect: '' })
                }

                improvements[index] = { ...improvements[index], ...update }
                return { ...current, improvements }
            }),
        updateImprovementAt: (index: number, update: Partial<Improvement>) =>
            apply((current) => {
                const improvements = [...current.improvements]
                const previous = improvements[index]
                if (!previous) return current

                improvements[index] = { ...previous, ...update }
                return { ...current, improvements }
            }),
        removeImprovementAt: (index: number) =>
            apply((current) => {
                const improvements = [...current.improvements]
                improvements.splice(index, 1)
                return { ...current, improvements }
            }),
        moveImprovement: (from: number, to: number) =>
            apply((current) => {
                const improvements = [...current.improvements]
                if (
                    from < 0 ||
                    from >= improvements.length ||
                    to < 0 ||
                    to >= improvements.length
                ) {
                    return current
                }

                const [item] = improvements.splice(from, 1)
                improvements.splice(to, 0, item)
                return { ...current, improvements }
            }),
        updateMeta: (update: Partial<ThemeKitMeta>) =>
            apply((current) => {
                const meta: ThemeKitMeta = {
                    ...current.meta,
                    ...update,
                    publication_type:
                        update.publication_type ??
                        current.meta?.publication_type ??
                        'homebrew',
                }

                meta.source = strOrUndefined(meta.source)
                if (!meta.authors?.length) delete meta.authors

                return { ...current, meta }
            }),
    }
}

export function useCityOfMistThemeKitViewStore() {
    const tab = useThemeKitTab()
    const patchTabView = useWorkspaceStore((state) => state.patchTabView)
    const tabView = tab?.view
    const view: ThemeKitViewState = {
        ...fallbackView,
        ...tabView,
        hidden: {
            ...fallbackView.hidden,
            ...(tabView?.hidden ?? {}),
        },
        exportPrefs: {
            ...fallbackView.exportPrefs,
            ...(tabView?.exportPrefs ?? {}),
        },
    }

    const patchView = (patch: Partial<ThemeKitViewState>) => {
        if (!tab) return
        patchTabView(tab.id, cloneValue(patch) as Record<string, unknown>)
    }

    return {
        ...view,
        setZoom: (zoom: number) =>
            patchView({ zoom: Math.max(0.5, Math.min(2, zoom)) }),
        setPreviewWidth: (previewWidth: number) =>
            patchView({
                previewWidth: clamp(
                    previewWidth,
                    PREVIEW_WIDTH_MIN,
                    PREVIEW_WIDTH_MAX
                ),
            }),
        setBackground: (background: ThemeKitViewState['background']) =>
            patchView({ background }),
        setColumnCount: (columnCount: ThemeKitViewState['columnCount']) =>
            patchView({ columnCount }),
        setTitlePlacement: (
            titlePlacement: ThemeKitViewState['titlePlacement']
        ) => patchView({ titlePlacement }),
        toggleHidden: (id: SectionId) =>
            patchView({ hidden: { ...view.hidden, [id]: !view.hidden[id] } }),
        setHidden: (id: SectionId, value: boolean) =>
            patchView({ hidden: { ...view.hidden, [id]: value } }),
        setAutoHideEmpty: (autoHideEmpty: boolean) =>
            patchView({ autoHideEmpty }),
        setExportPrefs: (partial: Partial<ThemeKitViewState['exportPrefs']>) =>
            patchView({ exportPrefs: { ...view.exportPrefs, ...partial } }),
        resetViewPrefs: () =>
            patchView({
                ...cloneValue(defaultThemeKitView),
                hidden: cloneValue(defaultHidden),
            }),
    }
}

export function useCityOfMistThemeKitSheetStore() {
    const tab = useThemeKitTab()
    const setTabSheet = useWorkspaceStore((state) => state.setTabSheet)
    const sheet = tab?.sheet ?? defaultThemeKitSheetState

    return {
        ...sheet,
        openSheet: (target: SheetTarget) => {
            if (!tab || tab.mode !== 'editing') return

            setTabSheet(tab.id, { open: true, target })
        },
        closeSheet: () => {
            if (!tab) return

            setTabSheet(tab.id, cloneValue(defaultThemeKitSheetState))
        },
    }
}

export function getCityOfMistThemeKitPreviewWidth(view: ThemeKitViewState) {
    return view.previewWidth
}

export function isEmptySection(
    cityOfMistThemeKit: ThemeKitDocument,
    id: SectionId
) {
    switch (id) {
        case 'introduction':
            return !cityOfMistThemeKit.introduction.trim()
        case 'concept':
            return !cityOfMistThemeKit.concept.trim()
        case 'powerTags':
            return !cityOfMistThemeKit.power_tag_questions.length
        case 'weaknessTags':
            return !cityOfMistThemeKit.weakness_tag_questions.length
        case 'extraTags':
            return !cityOfMistThemeKit.extra_tags.length
        case 'motivation':
            return !cityOfMistThemeKit.motivation?.intro?.trim()
        case 'titleGuidance':
            return !cityOfMistThemeKit.title_guidance.trim()
        case 'crewRelationships':
            return !cityOfMistThemeKit.crew_relationships.length
        case 'improvements':
            return !cityOfMistThemeKit.improvements.length
        case 'meta': {
            const meta = cityOfMistThemeKit.meta
            if (!meta) return true

            return !(
                !!meta.publication_type ||
                !!strOrUndefined(meta.source) ||
                (Array.isArray(meta.authors) && meta.authors.length > 0) ||
                meta.page != null
            )
        }
        default:
            return true
    }
}

export function shouldShow(
    cityOfMistThemeKit: ThemeKitDocument,
    id: SectionId,
    view: ThemeKitViewState
) {
    if (view.hidden[id]) return false
    if (view.autoHideEmpty && isEmptySection(cityOfMistThemeKit, id)) {
        return false
    }
    return true
}

export function getLiveCityOfMistThemeKitTab(): ThemeKitTab | null {
    const workspace = useWorkspaceStore.getState()
    const active = getActiveTab(workspace)
    if (!active || active.templateId !== TEMPLATE_ID) return null

    return active as ThemeKitTab
}
