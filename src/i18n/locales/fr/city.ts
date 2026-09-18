import type { ResourceShape } from '@/i18n/resourceShape'
import type en from '../en/city'

/* Game terms are provisional until the maintainer validates a French glossary. */
const city: ResourceShape<typeof en> = {
    danger: {
        label: 'Danger',
        newTitle: 'Nouveau danger',
        exportToml: 'Exporter les données du danger en TOML.',
        exportPng: 'Exporter l’aperçu du danger en PNG.',
        sections: {
            description: 'Description',
            spectrums: 'Spectres',
            customMoves: 'Actions personnalisées',
            hardMoves: 'Actions dures',
            softMoves: 'Actions douces',
            meta: 'Pied de page méta',
        },
    },
    customMove: {
        label: 'Action personnalisée',
        newTitle: 'Nouvelle action personnalisée',
        description:
            'Une action personnalisée est une règle que le MC écrit pour une situation précise : ce qui la déclenche, ce que lancent les joueurs s’il y a un jet, et ce que produit chaque résultat. Partez d’une page blanche, ouvrez l’exemple ou importez un fichier TOML.',
        exportToml: 'Exporter les données de l’action personnalisée en TOML.',
        exportPng: 'Exporter la carte de l’action personnalisée en PNG.',
        sections: {
            trigger: 'Déclencheur',
            roll: 'Jet',
            outcomes: 'Résultats',
            meta: 'Pied de page méta',
        },
        tiers: {
            miss: 'Échec',
            hit: 'Réussite',
        },
        warnings: {
            repeatedTiers:
                'Paliers de résultat écrits deux fois : {{tiers}}. La carte imprime les deux lignes sous le même intitulé.',
            unreachableTwelve:
                'Un résultat 12+ sur une action qui ne demande aucun jet : rien ne peut produire ce résultat, la ligne ne s’applique donc jamais.',
            overPicked:
                'Résultats demandant plus d’options qu’ils n’en proposent : {{outcomes}}.',
            overPickedItem: '{{tier}} (choisir {{count}} parmi {{total}})',
        },
    },
    themeKit: {
        label: 'Kit de thème',
        newTitle: 'Nouveau kit de thème',
        description:
            'Un kit de thème est un livret de thème : le questionnaire vierge qu’un joueur remplit pour construire un thème, avec ses questions lettrées, ses règles de sélection et ses cinq améliorations. La carte remplie est la carte de thème, à part. Partez d’une page blanche, ouvrez l’exemple ou importez un fichier TOML.',
        exportToml: 'Exporter les données du livret de thème en TOML.',
        exportPng: 'Exporter la page du livret de thème en PNG.',
        sections: {
            introduction: 'Introduction',
            concept: 'Concept',
            powerTags: 'Questions d’étiquettes de pouvoir',
            weaknessTags: 'Questions d’étiquettes de faiblesse',
            extraTags: 'Étiquettes supplémentaires',
            motivation: 'Motivation',
            titleGuidance: 'Conseils pour le titre',
            crewRelationships: 'Relations d’équipe',
            improvements: 'Améliorations',
            meta: 'Pied de page méta',
        },
        warnings: {
            improvementCount:
                'Chaque livret de thème publié compte cinq améliorations ; celui-ci en compte {{count}}.',
            powerOutOfSequence:
                'Les questions d’étiquettes de pouvoir doivent être lettrées A, B, C dans l’ordre de la liste ; trouvé : {{detail}}.',
            weaknessOutOfSequence:
                'Les questions d’étiquettes de faiblesse doivent être lettrées A, B, C dans l’ordre de la liste ; trouvé : {{detail}}.',
            outOfSequenceItem: '{{letter}} en position {{position}}',
            crewWithoutRelationships:
                'Un livret de thème d’équipe imprime ses relations d’équipe à la place d’une motivation, et celui-ci n’en contient aucune.',
            relationshipsWithoutCrew:
                'Les relations d’équipe ne s’impriment que sur un livret de thème d’équipe : elles n’apparaîtront pas.',
        },
    },
    themeCard: {
        label: 'Carte de thème',
        newTitle: 'Nouvelle carte de thème',
        description:
            'Choisissez comment commencer cette carte de thème : vierge, exemple ou import TOML.',
        exportToml: 'Exporter les données de la carte de thème en TOML.',
        exportPng: 'Exporter l’aperçu de la carte de thème en PNG.',
        sections: {
            motivation: 'Motivation',
            tracks: 'Jauges',
            powerTags: 'Étiquettes de pouvoir',
            weaknessTags: 'Étiquettes de faiblesse',
            improvements: 'Améliorations',
            meta: 'Pied de page méta',
        },
        warnings: {
            mythosErosion:
                'Les cartes Mythos utilisent l’Effacement, mais cette carte porte {{kind}}.',
            logosErosion:
                'Les cartes Logos utilisent la Fissure, mais cette carte porte {{kind}}.',
            crewErosion:
                'Les cartes d’équipe n’ont pas de jauge d’érosion : cette jauge ne sera pas imprimée.',
            weaknessLetters:
                '{{themebook}} propose les questions de faiblesse A à D, mais ces étiquettes citent d’autres lettres : {{letters}}.',
        },
    },
}

export default city
