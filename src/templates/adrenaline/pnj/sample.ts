import type { AdrenalinePnj } from '@/contracts/adrenaline'
import { parseAdrenalineToml } from '../shared/toml'

const starter = `nom = "PNJ sans nom"
niveauDeDanger = 1
description = "Décrivez ce personnage et ce que les joueurs perçoivent de lui."`

export const blankPnj = () =>
    parseAdrenalineToml<AdrenalinePnj>('adrenaline/pnj', starter)
export const samplePnj = blankPnj
