/* global process, console */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import { nodeDocumentContracts } from '../src/contracts/registry.node'
import { templateById, templatesByGame } from '../src/core/templates/registry'
import { templateLoaders } from '../src/core/templates/templateLoader'
import { BLOCK_CONFIGS } from '../src/templates/pbta/blocks/blockConfigs'
import { translate } from '../src/i18n/text'

const escapeHtml = (text: string) =>
    text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/'/g, '&#x27;')

const root = process.env.LANTERN_ROOT as string
const corpus = (target: string, kind: string) =>
    fs.readFileSync(
        path.join(
            root,
            'node_modules/schema-pbta/corpus/contract/valid',
            `${target}-${kind}.toml`
        ),
        'utf8'
    )

assert.equal(BLOCK_CONFIGS.length, 9, 'nine published blocks')
for (const config of BLOCK_CONFIGS) {
    const target = config.contractKey.replace(/^pbta\//, '')
    const contract = nodeDocumentContracts.require(config.contractKey) as {
        parseToml: (text: string) => unknown
        stringifyToml: (doc: never) => string
    }

    /* Registered under its game, with a lazy loader. */
    const entry = templateById.get(config.id)
    assert.ok(entry, `${config.id} is in the registry`)
    assert.ok(templateLoaders[config.id], `${config.id} has a loader`)
    assert.equal(entry.gameId, config.gameId)
    const group = templatesByGame.find((g) => g.gameId === config.gameId)
    assert.ok(group?.templates.includes(entry), `${config.id} is in its group`)
    assert.ok(
        group.templates.some((t) => t.id === `${config.gameId}.playbook`),
        `${config.gameId}: the playbook template stays`
    )

    /* Blank and example are the valid corpus, not a restatement that can drift. */
    assert.deepEqual(
        entry.createBlank(),
        contract.parseToml(corpus(target, 'blank')),
        `${config.id}: blank differs from the published corpus`
    )
    assert.deepEqual(
        entry.createExample(),
        contract.parseToml(corpus(target, 'complete')),
        `${config.id}: example differs from the published corpus`
    )
}

for (const config of BLOCK_CONFIGS) {
    const target = config.contractKey.replace(/^pbta\//, '')
    const contract = nodeDocumentContracts.require(config.contractKey) as {
        parseToml: (text: string) => unknown
        stringifyToml: (doc: never) => string
    }
    const loaded = await templateLoaders[config.id]()
    const definition = loaded.default
    const example = definition.createExample()

    /* TOML round trip through the published codec. */
    const text = definition.io.exportToml(example)
    assert.deepEqual(
        definition.io.importToml(text).doc,
        contract.parseToml(text),
        `${config.id}: export is not read back unchanged`
    )
    assert.deepEqual(
        definition.io.importToml(text).doc,
        example,
        `${config.id}: example changed through TOML`
    )
    assert.ok(
        definition.export.actions.some((a) => /toml/i.test(a.id ?? '')),
        `${config.id}: a TOML export action`
    )

    /* The preview draws one block per published region. */
    const html = renderToStaticMarkup(definition.preview.render())
    for (const section of config.sections)
        assert.ok(
            html.includes(escapeHtml(translate(section.label))),
            `${config.id}: region "${section.id}" is not drawn`
        )
    console.log(`${config.id}: ${target} ok (${config.sections.length} regions)`)
}
