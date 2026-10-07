import { z } from 'zod'
import { monsterheartsPlaybookSchema } from 'schema-pbta'

/* The booklet holds a bounded number of moves; the bound belongs to the
   published schema, so it is read from it rather than written down here. */
export const MONSTERHEARTS_MAX_MOVES: number | undefined = z.toJSONSchema(
    monsterheartsPlaybookSchema.shape.moves,
    { unrepresentable: 'any' }
).maxItems
