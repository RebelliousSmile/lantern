import { createSpecializedPlaybookTemplate } from '@/templates/pbta/specialized/definitionFactory'
import staticDefinition, { config } from './static'

export default createSpecializedPlaybookTemplate(config, staticDefinition)
