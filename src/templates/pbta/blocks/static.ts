import type { AnyStaticTemplateDefinition } from '@/core/templates/types'
import { createSpecializedPlaybookStaticDefinition } from '../specialized/staticDefinitionFactory'
import { blockConfigById } from './blockConfigs'

/** Registry entry of a PbtA block template: no codec, no editor, no preview. */
export const blockStatic = (id: string) =>
    createSpecializedPlaybookStaticDefinition(
        blockConfigById(id)
    ) as unknown as AnyStaticTemplateDefinition
