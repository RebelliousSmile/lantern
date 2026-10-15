/* global process, console */
import assert from 'node:assert/strict'
import { renderToStaticMarkup } from 'react-dom/server'
import { nodeDocumentContracts } from '../src/contracts/registry.node'
import { templateRegistry } from '../src/core/templates/registry'
import { templateLoaders } from '../src/core/templates/templateLoader'

/*
 * Every registered template proves its two exports. TOML: the example leaves
 * through the template's own writer, the published codec accepts it, and the
 * template reads it back to the same text. PNG: the shared action is installed, the
 * preview root is addressable and the preview draws something. The capture
 * itself needs a layout engine and is measured in a browser, not here.
 */
const failures: string[] = []
const needsDom: string[] = []
const check = (id: string, what: string, test: () => void) => {
    try {
        test()
    } catch (error) {
        const message = String((error as Error).message)
        failures.push(
            `${id}: ${what}: ${
                process.env.DETAIL ? message : message.split('\n')[0]
            }`
        )
    }
}

for (const entry of templateRegistry) {
    const id = entry.id
    const loader = templateLoaders[id]
    if (!loader) {
        failures.push(`${id}: no lazy loader`)
        continue
    }
    const definition = (await loader()).default
    const contract = nodeDocumentContracts.require(entry.contractKey) as {
        parseToml: (text: string) => unknown
    }
    const example = definition.createExample()

    check(id, 'TOML writer and reader', () => {
        assert.equal(typeof definition.io.exportToml, 'function', 'no exportToml')
        assert.equal(typeof definition.io.importToml, 'function', 'no importToml')
    })
    let text = ''
    check(id, 'TOML export of the example', () => {
        text = definition.io.exportToml!(example)
        assert.ok(text.trim().length > 0, 'empty TOML')
    })
    check(id, 'TOML accepted by the published codec', () => {
        contract.parseToml(text)
    })
    check(id, 'TOML read back unchanged', () => {
        /*
         * The codec fills defaults and carries its source, so the document is not
         * compared field for field: the exported text must be a fixed point.
         */
        const back = definition.io.importToml!(text).doc
        assert.equal(definition.io.exportToml!(back), text, 'second export differs')
    })

    check(id, 'PNG action', () => {
        const actions = definition.export.actions.filter((a) => a.id === 'png')
        assert.equal(actions.length, 1, `${actions.length} png actions`)
        assert.equal(actions[0].label, 'export.png')
        assert.equal(actions[0].buttonLabel, 'export.exportPng')
    })
    check(id, 'PNG preview root', () => {
        const selector = definition.preview.getRootSelector('tab')
        assert.ok(selector && selector.length > 0, 'empty selector')
        const width = definition.appearance.getPreviewWidth(
            definition.createInitialView()
        )
        assert.ok(Number.isFinite(width) && width > 0, `width ${width}`)
    })
    try {
        const html = renderToStaticMarkup(definition.preview.render())
        if (html.replace(/<[^>]*>/g, '').trim().length === 0)
            failures.push(`${id}: preview is drawn: blank preview`)
    } catch (error) {
        /* The markdown sanitiser needs a DOM: those previews are drawn in the browser pass. */
        if (/purify/.test(String((error as Error).message))) needsDom.push(id)
        else failures.push(`${id}: preview is drawn: ${(error as Error).message}`)
    }
}

if (failures.length) {
    for (const line of failures) console.error(`FAIL ${line}`)
    console.error(`${failures.length} failure(s) over ${templateRegistry.length} templates`)
    process.exit(1)
}
console.log(`${templateRegistry.length} templates: TOML and PNG proofs ok`)
if (needsDom.length)
    console.log(`preview drawn in the browser pass only: ${needsDom.join(', ')}`)
