import dangerTemplate from '@/templates/city-of-mist/danger/definition'
import challengeTemplate from '@/templates/legend-in-the-mist/challenge/definition'
import journeyTemplate from '@/templates/legend-in-the-mist/journey/definition'
import storyThemeTemplate from '@/templates/legend-in-the-mist/story-theme/definition'
import themeKitTemplate from '@/templates/legend-in-the-mist/theme-kit/definition'
import otherscapeChallengeTemplate from '@/templates/otherscape/challenge/definition'
import otherscapeLoadoutItemTemplate from '@/templates/otherscape/loadout-item/definition'
import otherscapeThemeKitTemplate from '@/templates/otherscape/theme-kit/definition'
import otherscapeThemeTemplate from '@/templates/otherscape/theme/definition'
import {
    DEFAULT_TEMPLATE_PREVIEW_WIDTH,
    type AnyTemplateDefinition,
    type GameId,
} from './types'

function createComingSoonTemplate(config: {
    id: string
    gameId: GameId
    gameLabel: string
    label: string
}) {
    const placeholder: AnyTemplateDefinition = {
        ...config,
        implemented: false,
        comingSoonLabel: 'Coming soon',
        createBlank: () => ({}),
        createExample: () => ({}),
        createInitialView: () => ({}),
        createInitialSheet: () => ({ open: false, target: null }),
        getTabTitle: () => config.label,
        sections: [],
        landing: {
            description: `${config.label} support is not implemented yet.`,
        },
        io: {},
        preview: {
            getRootSelector: (tabId) => `[data-preview-root="${tabId}"]`,
            render: () => null,
        },
        editor: {
            emptyState: `${config.label} editing is not available yet.`,
            renderPanel: () => null,
        },
        appearance: {
            getPreviewWidth: () => DEFAULT_TEMPLATE_PREVIEW_WIDTH,
            renderPanel: () => null,
        },
        export: {
            actions: [],
        },
    }

    return placeholder
}

export const templateRegistry: AnyTemplateDefinition[] = [
    dangerTemplate,
    createComingSoonTemplate({
        id: 'city.customMove',
        gameId: 'city',
        gameLabel: 'City of Mist',
        label: 'Custom Move',
    }),
    createComingSoonTemplate({
        id: 'city.iceberg',
        gameId: 'city',
        gameLabel: 'City of Mist',
        label: 'Iceberg',
    }),
    createComingSoonTemplate({
        id: 'city.themeKit',
        gameId: 'city',
        gameLabel: 'City of Mist',
        label: 'Theme Kit',
    }),
    challengeTemplate,
    journeyTemplate,
    storyThemeTemplate,
    themeKitTemplate,
    otherscapeChallengeTemplate,
    otherscapeThemeKitTemplate,
    otherscapeThemeTemplate,
    otherscapeLoadoutItemTemplate,
]

export const templateById = new Map(
    templateRegistry.map((template) => [template.id, template] as const)
)

export const templatesByGame = [
    {
        gameId: 'city',
        gameLabel: 'City of Mist',
        templates: templateRegistry.filter(
            (template) => template.gameId === 'city'
        ),
    },
    {
        gameId: 'legend',
        gameLabel: 'Legend in the Mist',
        templates: templateRegistry.filter(
            (template) => template.gameId === 'legend'
        ),
    },
    {
        gameId: 'otherscape',
        gameLabel: ':Otherscape',
        templates: templateRegistry.filter(
            (template) => template.gameId === 'otherscape'
        ),
    },
] as const
