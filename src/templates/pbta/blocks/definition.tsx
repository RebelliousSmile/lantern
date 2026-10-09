import type { AnyTemplateDefinition } from '@/core/templates/types'
import { createSpecializedPlaybookTemplate } from '../specialized/definitionFactory'
import { blockConfigById } from './blockConfigs'
import { blockStatic } from './static'

/** The lazy module of a PbtA block template. */
export const blockDefinition = (id: string): AnyTemplateDefinition =>
    createSpecializedPlaybookTemplate(
        blockConfigById(id),
        blockStatic(id) as never
    )
