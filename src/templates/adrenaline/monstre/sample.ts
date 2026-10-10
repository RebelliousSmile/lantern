import type { AdrenalineMonstre } from '@/contracts/adrenaline'
import published from 'schema-adrenaline/examples/adrenaline/monstre/infecte-zy-2.toml?raw'
import { parseAdrenalineToml } from '../shared/toml'

const starter = `nom = "Monstre sans nom"

[caracteristiques]
for = 30
con = 30
dex = 30
rap = 30`

export const blankMonstre = () =>
    parseAdrenalineToml<AdrenalineMonstre>('adrenaline/monstre', starter)
/* The published worked example, parsed like an import, so "start from the
   example" shows what the schema documents and not an empty card. */
export const sampleMonstre = () =>
    parseAdrenalineToml<AdrenalineMonstre>('adrenaline/monstre', published)
