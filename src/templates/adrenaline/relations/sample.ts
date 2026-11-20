import type { AdrenalineRelations } from '@/contracts/adrenaline'
import published from 'schema-adrenaline/examples/adrenaline/relations/feuille-de-relations.toml?raw'
import { parseAdrenalineToml } from '../shared/toml'

const starter = `personnage = "Nouveau personnage"`

export const blankRelations = () =>
    parseAdrenalineToml<AdrenalineRelations>('adrenaline/relations', starter)
/* The published worked example, parsed like an import: "start from the example"
   shows what the schema documents and not an empty sheet. */
export const sampleRelations = () =>
    parseAdrenalineToml<AdrenalineRelations>('adrenaline/relations', published)
