import assert from 'node:assert/strict'
import { migrateLegacyChallengeWorkspace } from '../src/templates/legend-in-the-mist/challenge/legacyWorkspaceMigration'
import { getSampleLegendInTheMistChallenge } from '../src/templates/legend-in-the-mist/challenge/sample'
import { cloneValue } from '../src/utils/clone'

assert.equal(migrateLegacyChallengeWorkspace({ data: { nope: true } }), null)

const document = getSampleLegendInTheMistChallenge()
const migrated = migrateLegacyChallengeWorkspace({ data: document })
assert.ok(migrated, 'valid legacy challenge migrates')
assert.equal(migrated.name, document.name)

const original = { nested: { value: 1 } }
const cloned = cloneValue(original)
cloned.nested.value = 2
assert.equal(original.nested.value, 1, 'clone is independent')
console.log('Workspace migrations: valid and invalid payloads covered.')
