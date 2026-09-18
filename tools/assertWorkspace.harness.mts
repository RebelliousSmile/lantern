import assert from 'node:assert/strict'
import { migrateLegacyChallengeWorkspace } from '../src/templates/legend-in-the-mist/challenge/legacyWorkspaceMigration'
import { getSampleLegendInTheMistChallenge } from '../src/templates/legend-in-the-mist/challenge/sample'
import { cloneValue } from '../src/utils/clone'

const storage = new Map<string, string>()
Object.defineProperty(globalThis, 'window', {
    value: {
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
const tabId = useWorkspaceStore.getState().createTab('pbta.playbook')
assert.ok(tabId, 'an enabled template opens before its pack is hidden')
assert.ok(
    useWorkspaceStore.getState().tabs.some((tab) => tab.id === tabId),
    'hiding a pack does not close its open tab'
)

storage.set(GAME_PACKS_STORAGE_KEY, '{not-json')
assert.deepEqual(readGamePacks(), { disabled: [], open: [] })
console.log('Workspace migrations and game-pack preferences covered.')
