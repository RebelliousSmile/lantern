/* global process, console */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

/*
 * The dressing of a Monsterhearts or Urban Shadows playbook is the pack's
 * host-neutral playbook.css published by schema-pbta, read by Handbook too.
 * Lantern keeps no theme of its own, and its preview must carry every class
 * and region the sheet targets, as Handbook's projection does.
 */
const root = process.env.LANTERN_ROOT as string
const read = (file: string) => fs.readFileSync(path.join(root, file), 'utf8')
const packageRoot = 'node_modules/schema-pbta'
const witness = (name: string) =>
    read(`${packageRoot}/corpus/contract/valid/${name}.toml`)

const storage = new Map<string, string>()
Object.defineProperty(globalThis, 'window', {
    value: {
        navigator: { language: 'fr-FR' },
        localStorage: {
            getItem: (key: string) => storage.get(key) ?? null,
            setItem: (key: string, value: string) => storage.set(key, value),
            removeItem: (key: string) => storage.delete(key),
        },
    },
})

/* 1. No local theme: both previews import the published sheet. */
const previews = {
    monsterhearts:
        'src/templates/monsterhearts/playbook/preview/MonsterheartsPlaybookPreview.tsx',
    'urban-shadows':
        'src/templates/urban-shadows/playbook/preview/UrbanShadowsPlaybookPreview.tsx',
} as const
for (const [id, file] of Object.entries(previews)) {
    const dir = path.dirname(file)
    const themes = fs
        .readdirSync(path.join(root, dir))
        .filter((name) => name.endsWith('.css'))
    assert.deepEqual(
        themes,
        [],
        `${id}: ${dir} keeps a local theme (${themes.join(', ')}); the dressing lives in schema-pbta/packs/${id}/assets/styles/playbook.css`
    )
    assert.ok(
        read(file).includes(
            `import 'schema-pbta/packs/${id}/assets/styles/playbook.css'`
        ),
        `${id}: ${file} does not import the published playbook.css`
    )
}

/*
 * The published witness is the smallest complete document, so it leaves out
 * optional content that makes some hooks appear. The complements are the
 * same as in Handbook's harness (tools/pbtaPlaybookStyles.harness.mts).
 */
const { importFromTOMLWithWarnings: importMonsterhearts } = await import(
    '../src/templates/monsterhearts/playbook/toml'
)
const { importFromTOMLWithWarnings: importUrbanShadows } = await import(
    '../src/templates/urban-shadows/playbook/toml'
)
const monsterhearts = importMonsterhearts(
    witness('monsterhearts-playbook-complete')
).playbook
const monsterheartsData = {
    ...monsterhearts,
    harm: 1,
    gear: [{ name: 'Peigne de nacre' }],
    editorial: {
        ...monsterhearts.editorial,
        identity: {
            heading: 'Identité',
            paragraphs: ['Nom : Ondine, Morgane', 'Look : regard humide'],
        },
        play: {
            heading: 'Jouer la Selkie',
            paragraphs: ['Ta peau est ailleurs.'],
        },
    },
}
const urbanShadows = importUrbanShadows(
    witness('urban-shadows-playbook-complete')
).playbook
const urbanShadowsData = {
    ...urbanShadows,
    harm: { armor: 1, faint: 2, serious: 2, critical: 1 },
    scars: [{ name: 'Cicatrice au front', stat: 'blood', modifier: -1 }],
    gear: [{ name: 'Carnet usé' }],
    statProfiles: [
        { key: 'night-shift', label: 'De nuit', stats: { mind: 1 } },
    ],
    editorial: {
        ...urbanShadows.editorial,
        identity: {
            heading: 'Identité',
            paragraphs: ['Nom : Alex, Sam', 'Look : manteau trempé'],
        },
    },
}

const tab = (id: string, templateId: string, doc: unknown, mode: string) => ({
    id,
    templateId,
    title: id,
    mode,
    createdAt: 1,
    updatedAt: 1,
    doc,
    view: {},
    sheet: {},
})
storage.set(
    'mist:workspace:v1',
    JSON.stringify({
        version: 1,
        tabs: [
            tab(
                'mh-view',
                'monsterhearts.playbook',
                monsterheartsData,
                'landing'
            ),
            tab(
                'mh-edit',
                'monsterhearts.playbook',
                monsterheartsData,
                'editing'
            ),
            tab(
                'us-view',
                'urban-shadows.playbook',
                urbanShadowsData,
                'landing'
            ),
        ],
        tabOrder: ['mh-view', 'mh-edit', 'us-view'],
        activeTabId: 'mh-view',
    })
)
const { useWorkspaceStore } = await import('../src/core/workspace/store')
useWorkspaceStore.getState().hydrateWorkspace()
assert.equal(
    useWorkspaceStore.getState().tabs.length,
    3,
    'the harness tabs hydrate'
)

const { MonsterheartsPlaybookPreview } = await import(
    '../src/templates/monsterhearts/playbook/preview/MonsterheartsPlaybookPreview'
)
const { UrbanShadowsPlaybookPreview } = await import(
    '../src/templates/urban-shadows/playbook/preview/UrbanShadowsPlaybookPreview'
)
const render = (tabId: string, component: () => unknown) => {
    useWorkspaceStore.getState().activateTab(tabId)
    /* A server render reads zustand's initial state (getServerSnapshot), not
       the hydrated one: without this the previews would draw blank documents. */
    Object.assign(
        useWorkspaceStore.getInitialState(),
        useWorkspaceStore.getState()
    )
    const tabs = useWorkspaceStore.getInitialState().tabs
    assert.ok(
        tabs.some((tab) => tab.id === tabId && tab.doc),
        `${tabId}: the harness document reaches the server render`
    )
    return renderToStaticMarkup(createElement(component as never))
}

const games = [
    {
        id: 'monsterhearts',
        html: render('mh-view', MonsterheartsPlaybookPreview),
    },
    {
        id: 'urban-shadows',
        html: render('us-view', UrbanShadowsPlaybookPreview),
    },
]

for (const { id, html } of games) {
    /* 2. The published appearance contract declares the shared sheet. */
    const appearance = JSON.parse(
        read(`${packageRoot}/packs/${id}/appearance-contract.json`)
    ) as { resources?: { stylesheets?: string[] } }
    assert.ok(
        (appearance.resources?.stylesheets ?? []).includes(
            'assets/styles/playbook.css'
        ),
        `${id}: packs/${id}/appearance-contract.json does not list assets/styles/playbook.css`
    )
    const sheet = read(`${packageRoot}/packs/${id}/assets/styles/playbook.css`)

    /* 3. The preview DOM carries every hook the sheet targets. */
    const classes = new Set<string>()
    for (const match of html.matchAll(/class="([^"]*)"/g)) {
        for (const name of match[1].split(/\s+/)) classes.add(name)
    }
    const hooks = new Set<string>()
    for (const match of html.matchAll(/data-(?:region|primitive)="([^"]*)"/g))
        hooks.add(match[1])
    assert.ok(
        new RegExp(
            `<article[^>]*class="[^"]*\\bhandbook-${id}-playbook\\b`
        ).test(html),
        `${id}: the preview root is not article.handbook-${id}-playbook`
    )
    const missing: string[] = []
    const targetedClasses = new Set(
        sheet.match(new RegExp(`handbook-${id}-[a-z0-9-]*[a-z0-9]`, 'g')) ?? []
    )
    for (const name of targetedClasses) {
        if (!classes.has(name)) missing.push(`.${name}`)
    }
    for (const match of sheet.matchAll(
        /data-(?:region|primitive)\s*=\s*["']([^"']+)["']/g
    )) {
        if (!hooks.has(match[1])) missing.push(`[data-*="${match[1]}"]`)
    }
    assert.deepEqual(
        [...new Set(missing)],
        [],
        `${id}: playbook.css targets hooks absent from Lantern's preview of the witness: ${[...new Set(missing)].join(', ')}`
    )
}

/* 4. Monsterhearts regions are buttons while editing, plain text otherwise. */
const reading = games[0].html
assert.ok(
    !/data-region="[^"]*"[^>]*role="button"|role="button"[^>]*data-region=/.test(
        reading
    ),
    'monsterhearts: a region is a button outside editing'
)
const editing = render('mh-edit', MonsterheartsPlaybookPreview)
const regions = [...editing.matchAll(/<section[^>]*data-region="[^"]*"[^>]*>/g)]
assert.ok(regions.length > 0, 'monsterhearts: no region while editing')
for (const [section] of regions) {
    assert.ok(
        section.includes('role="button"'),
        `monsterhearts: ${section} is not a button while editing`
    )
}

console.log('PbtA playbook styles assertions passed.')
