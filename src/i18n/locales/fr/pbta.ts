import type { ResourceShape } from '@/i18n/resourceShape'
import type en from '../en/pbta'

/* Game terms are provisional until the maintainer validates a French glossary. */
const pbta: ResourceShape<typeof en> = {
    playbook: {
        label: 'Livret',
        newTitle: 'Nouveau livret',
        description:
            'Un livret est un type de personnage d’Apocalypse World : ses caractéristiques, ses actions, les choix faits à la création et l’équipement de départ. Partez d’une page blanche, ouvrez l’exemple ou importez un fichier TOML.',
        exportToml: 'Exporter le livret courant en TOML.',
        exportPng: 'Exporter la fiche du livret courant en PNG.',
        sections: {
            stats: 'Caractéristiques',
            moves: 'Actions',
            choiceSets: 'Jeux de choix',
            advancement: 'Progression',
            creation: 'Création',
            gear: 'Équipement',
        },
    },
    gameDefinition: {
        label: 'Définition de jeu',
        newTitle: 'Nouvelle définition de jeu',
        description:
            'Une définition de jeu décrit un jeu Apocalypse World comme Salvage Run : ses caractéristiques, ses types d’actions, les résultats possibles d’un jet et qui reçoit une fiche de personnage. Partez d’une page blanche, ouvrez l’exemple ou importez un fichier TOML.',
        exportToml: 'Exporter la définition de jeu courante en TOML.',
        exportPng: 'Exporter la fiche de la définition de jeu courante en PNG.',
        sections: {
            roll: 'Jet',
            character: 'Personnage',
            npc: 'PNJ',
            mc: 'MC',
            fronts: 'Fronts',
        },
    },
    specialized: {
        description:
            'Créez un livret original pour {{game}} sous forme d’un seul document TOML.',
        sections: {
            stats: 'Caractéristiques',
            labels: 'Étiquettes',
            moves: 'Actions',
            momentOfTruth: 'Moment de vérité',
            improvements: 'Améliorations',
            directives: 'Directives',
            editorial: 'Éditorial',
        },
    },
    monsterhearts: {
        label: 'Peau',
        newTitle: 'Nouvelle peau',
        description: 'Créez une peau originale pour Monsterhearts.',
        exportToml: 'Exporter cette peau en TOML.',
        exportPng: 'Exporter cette peau en PNG.',
        sections: {
            strings: 'Ficelles',
            conditions: 'États',
            editorial: 'Éditorial',
            moves: 'Actions',
            advancement: 'Progression',
            advances: 'Avancées',
            harm: 'Blessures',
        },
    },
    urbanShadows: {
        sections: {
            circles: 'Cercles et statut',
            relationships: 'Relations mortelles',
            harm: 'Blessures et cicatrices',
            corruption: 'Corruption et action finale',
            editorial: 'Éditorial',
            moves: 'Actions',
            creation: 'Création',
            gear: 'Équipement',
            advancement: 'Progression',
        },
    },
}

export default pbta
