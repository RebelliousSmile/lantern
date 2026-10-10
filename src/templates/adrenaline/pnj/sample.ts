import type { AdrenalinePnj } from '@/contracts/adrenaline'
import published from 'schema-adrenaline/examples/adrenaline/pnj/pnj-majeur.toml?raw'
import { parseAdrenalineToml } from '../shared/toml'

const starter = `nom = "PNJ sans nom"
niveauDeDanger = 1
description = "Décrivez ce personnage et ce que les joueurs perçoivent de lui."`

export const blankPnj = () =>
    parseAdrenalineToml<AdrenalinePnj>('adrenaline/pnj', starter)
/* The published worked example, parsed like an import, so "start from the
   example" shows what the schema documents and not an empty card. */
export const samplePnj = () =>
    parseAdrenalineToml<AdrenalinePnj>('adrenaline/pnj', published)
