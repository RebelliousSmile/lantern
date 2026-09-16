import type { AdrenalineMonstre } from '@/contracts/adrenaline'
import { parseAdrenalineToml } from '../shared/toml'

const starter = `nom = "Monstre sans nom"

[caracteristiques]
for = 30
con = 30
dex = 30
rap = 30`

export const blankMonstre = () =>
    parseAdrenalineToml<AdrenalineMonstre>('adrenaline/monstre', starter)
export const sampleMonstre = blankMonstre
