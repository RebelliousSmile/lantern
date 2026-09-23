/* global console */
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const consumers = [
    'city-of-mist/theme-card', 'city-of-mist/theme-kit', 'city-of-mist/custom-move', 'city-of-mist/danger',
    'legend-in-the-mist/theme-kit', 'legend-in-the-mist/story-theme', 'legend-in-the-mist/journey', 'legend-in-the-mist/challenge',
    'otherscape/theme-kit', 'otherscape/theme', 'otherscape/character-trope', 'otherscape/loadout-item', 'otherscape/power-set', 'otherscape/challenge',
    'pbta/playbook', 'pbta/game-definition', 'urban-shadows/playbook', 'monsterhearts/playbook',
]
for (const consumer of consumers) {
    const source = readFileSync(`src/templates/${consumer}/hooks.ts`, 'utf8')
    assert.match(source, /templates\/shared\/visibility/, `${consumer} imports shared visibility`)
    assert.doesNotMatch(source, /\[id\]: !view\.hidden\[id\]|\[id\]: value/, `${consumer} has no duplicate visibility operation`)
}
const adrenaline = readFileSync('src/templates/adrenaline/shared/hooks.ts', 'utf8')
assert.doesNotMatch(adrenaline, /hidden/, 'Adrenaline has no visibility protocol')
console.log(`Visibility protocol: ${consumers.length} consumers, Adrenaline excluded.`)
