import assert from 'node:assert/strict'
import { migrateLegacyChallengeWorkspace } from '../src/templates/legend-in-the-mist/challenge/legacyWorkspaceMigration'
import { getSampleLegendInTheMistChallenge } from '../src/templates/legend-in-the-mist/challenge/sample'
import { cloneValue } from '../src/utils/clone'
import {
    mergeVisibility,
    setVisibility,
    toggleVisibility,
} from '../src/templates/shared/visibility'

const visibilityDefaults = { moves: false, gear: true }
const mergedVisibility = mergeVisibility(visibilityDefaults, { moves: true })
assert.deepEqual(mergedVisibility, { moves: true, gear: true })
assert.deepEqual(visibilityDefaults, { moves: false, gear: true })
assert.deepEqual(toggleVisibility(mergedVisibility, 'gear'), {
    moves: true,
    gear: false,
})
assert.deepEqual(setVisibility(mergedVisibility, 'moves', false), {
    moves: false,
    gear: true,
})

const storage = new Map<string, string>()
Object.defineProperty(globalThis, 'window', {
    value: {
        navigator: { language: 'en-US' },
        localStorage: {
            getItem: (key: string) => storage.get(key) ?? null,
            setItem: (key: string, value: string) => storage.set(key, value),
            removeItem: (key: string) => storage.delete(key),
        },
    },
})

assert.equal(migrateLegacyChallengeWorkspace({ data: { nope: true } }), null)

const document = getSampleLegendInTheMistChallenge()
const migrated = migrateLegacyChallengeWorkspace({ data: document })
assert.ok(migrated, 'valid legacy challenge migrates')
assert.equal(migrated.name, document.name)

const original = { nested: { value: 1 } }
const cloned = cloneValue(original)
cloned.nested.value = 2
assert.equal(original.nested.value, 1, 'clone is independent')

storage.set(
    'mist:game-packs:v1',
    JSON.stringify({ disabled: ['pbta', 'pbta'], open: ['pbta'] })
)
const { GAME_PACKS_STORAGE_KEY, readGamePacks, useGamePackStore } =
    await import('../src/core/gamePacks')
const initialPacks = useGamePackStore.getState()
assert.deepEqual(initialPacks.disabledGameIds, ['apocalypse-world'])
assert.deepEqual(initialPacks.openGameIds, [])
assert.deepEqual(JSON.parse(storage.get(GAME_PACKS_STORAGE_KEY) ?? '{}'), {
    disabled: ['apocalypse-world'],
})

initialPacks.setGamePackOpen('apocalypse-world', true)
initialPacks.setGamePackEnabled('apocalypse-world', false)
assert.deepEqual(useGamePackStore.getState().openGameIds, ['apocalypse-world'])
assert.deepEqual(JSON.parse(storage.get(GAME_PACKS_STORAGE_KEY) ?? '{}'), {
    disabled: ['apocalypse-world'],
})

const { useWorkspaceStore } = await import('../src/core/workspace/store')
storage.set(
    'mist:workspace:v1',
    JSON.stringify({
        version: 1,
        tabs: [
            {
                id: 'incomplete-monsterhearts',
                templateId: 'monsterhearts.playbook',
                title: 'Incomplete skin',
                mode: 'editing',
                createdAt: 1,
                updatedAt: 1,
                doc: { editorial: { opening: { heading: 'Opening' } } },
                view: {},
                sheet: {},
            },
        ],
        tabOrder: ['incomplete-monsterhearts'],
        activeTabId: 'incomplete-monsterhearts',
    })
)
useWorkspaceStore.getState().hydrateWorkspace()
const restoredTab = useWorkspaceStore.getState().tabs[0]
assert.deepEqual(
    (restoredTab.doc as { editorial: { opening: { paragraphs: string[] } } })
        .editorial.opening.paragraphs,
    ['Introduce this skin.'],
    'workspace hydration restores absent nested document fields'
)
assert.equal(
    (restoredTab.view as { zoom: number }).zoom,
    1,
    'workspace hydration restores absent view fields'
)
assert.equal(
    (restoredTab.sheet as { open: boolean }).open,
    false,
    'workspace hydration restores absent sheet fields'
)

const { getAdvanceCheckClass, getMoveHeart } = await import(
    '../src/templates/monsterhearts/playbook/preview/MonsterheartsPlaybookPreview'
)
const { getMonsterheartsRegionLayout } = await import(
    '../src/templates/monsterhearts/playbook/preview/MonsterheartsPlaybookPreview'
)
const { PBTA_MONSTERHEARTS_PLAYBOOK_PRESENTATION } = await import('schema-pbta')
const { PBTA_MONSTERHEARTS_APPEARANCE_ASSET_URLS } = await import('schema-pbta')
const { LANTERN_CAPABILITIES } = await import('../src/core/capabilities')
const { sections: monsterheartsSections } = await import(
    '../src/templates/monsterhearts/playbook/model'
)
assert.ok(
    monsterheartsSections.some((section) => section.id === 'stats'),
    'Monsterhearts stats are exposed as a preview and editor section'
)
assert.equal(getMoveHeart(false), '♡', 'unchecked moves render an empty heart')
assert.equal(getMoveHeart(true), '♥', 'checked moves render a filled heart')
assert.equal(
    getAdvanceCheckClass(true),
    'is-checked',
    'checked advances use the checklist marker instead of a second glyph'
)
const monsterheartsLayout = getMonsterheartsRegionLayout()
assert.deepEqual(
    monsterheartsLayout.rows,
    PBTA_MONSTERHEARTS_PLAYBOOK_PRESENTATION.rows,
    'Monsterhearts preview uses the published region rows'
)
assert.ok(
    LANTERN_CAPABILITIES.includes('presentation:pbta-layout'),
    'Lantern publishes the PbtA layout capability it consumes'
)
assert.deepEqual(
    [
        monsterheartsLayout.header,
        ...monsterheartsLayout.rows.flat(2),
        ...monsterheartsLayout.trailing,
    ].sort(),
    [...PBTA_MONSTERHEARTS_PLAYBOOK_PRESENTATION.canonicalOrder].sort(),
    'every published Monsterhearts region renders once'
)
const monsterheartsFallback = getMonsterheartsRegionLayout({
    ...PBTA_MONSTERHEARTS_PLAYBOOK_PRESENTATION,
    rows: [[['game-identity']]],
})
assert.deepEqual(
    monsterheartsFallback.trailing,
    PBTA_MONSTERHEARTS_PLAYBOOK_PRESENTATION.canonicalOrder.slice(1),
    'unplaced regions follow the published canonical order after the grid'
)
assert.ok(
    PBTA_MONSTERHEARTS_APPEARANCE_ASSET_URLS.assets['game-mark'],
    'Monsterhearts appearance assets expose browser-consumer URLs'
)
assert.ok(
    PBTA_MONSTERHEARTS_APPEARANCE_ASSET_URLS.variants['drowned-lake']
        .assetOverrides['variant-mark'],
    'Monsterhearts drowned-lake appearance exposes its published asset override'
)

const tabId = useWorkspaceStore.getState().createTab('pbta.playbook')
assert.ok(tabId, 'an enabled template opens before its pack is hidden')
assert.ok(
    useWorkspaceStore.getState().tabs.some((tab) => tab.id === tabId),
    'hiding a pack does not close its open tab'
)

const originalSetItem = window.localStorage.setItem
window.localStorage.setItem = () => {
    throw new Error('Quota exceeded')
}
useWorkspaceStore.getState().updateTabDoc(tabId, (doc) => ({
    ...(doc as Record<string, unknown>),
    persistenceProbe: true,
}))
assert.equal(
    useWorkspaceStore.getState().persistenceError,
    'Quota exceeded',
    'a failed workspace write marks the in-memory workspace unsaved'
)
assert.equal(
    (useWorkspaceStore.getState().tabs.find((tab) => tab.id === tabId)?.doc as {
        persistenceProbe?: boolean
    }).persistenceProbe,
    true,
    'a failed workspace write preserves the current in-memory changes for export'
)
window.localStorage.setItem = originalSetItem

storage.set(GAME_PACKS_STORAGE_KEY, '{not-json')
assert.deepEqual(readGamePacks(), { disabled: [], open: [] })

const { assertTemplateRegistryIntegrity, templateRegistry, templatesByGame } =
    await import('../src/core/templates/registry')
assert.doesNotThrow(() =>
    assertTemplateRegistryIntegrity(templateRegistry, templatesByGame)
)
const firstTemplate = templateRegistry[0]
assert.throws(
    () =>
        assertTemplateRegistryIntegrity(
            [firstTemplate, { ...firstTemplate }],
            templatesByGame
        ),
    /duplicate id/
)
assert.throws(
    () =>
        assertTemplateRegistryIntegrity(templateRegistry, [
            ...templatesByGame,
            { ...templatesByGame[0], gameId: 'empty-pack', templates: [] },
        ]),
    /empty game group/
)
const otherTemplate = templateRegistry.find(
    (template) => template.gameId !== templatesByGame[0].gameId
)
assert.ok(otherTemplate, 'a second game pack exists for mismatch coverage')
assert.throws(
    () =>
        assertTemplateRegistryIntegrity(templateRegistry, [
            {
                ...templatesByGame[0],
                templates: [otherTemplate],
            },
            ...templatesByGame.slice(1),
        ]),
    /is grouped under/
)
assert.throws(
    () =>
        assertTemplateRegistryIntegrity(
            templateRegistry,
            templatesByGame,
            () => {
                throw new Error('unresolved contract')
            }
        ),
    /unresolved contract/
)
console.log('Workspace migrations and game-pack preferences covered.')
