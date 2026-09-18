import assert from 'node:assert/strict'
import { migrateLegacyChallengeWorkspace } from '../src/templates/legend-in-the-mist/challenge/legacyWorkspaceMigration'
import { getSampleLegendInTheMistChallenge } from '../src/templates/legend-in-the-mist/challenge/sample'

assert.equal(migrateLegacyChallengeWorkspace({ data: { nope: true } }), null)

const document = getSampleLegendInTheMistChallenge()
const migrated = migrateLegacyChallengeWorkspace({ data: document })
assert.ok(migrated, 'valid legacy challenge migrates')
assert.equal(migrated.name, document.name)
console.log('Workspace migrations: valid and invalid payloads covered.')
