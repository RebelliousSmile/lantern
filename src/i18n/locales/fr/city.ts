import type { ResourceShape } from '@/i18n/resourceShape'
import type en from '../en/city'
import customMoveForms from './city/customMoveForms'
import dangerForms from './city/dangerForms'
import sharedForms from './city/sharedForms'
import themeCardForms from './city/themeCardForms'
import themeKitForms from './city/themeKitForms'

/* Game terms follow the official French edition of City of Mist (src/i18n/glossary/city.md). */
const city: ResourceShape<typeof en> = {
    danger: {
        label: 'Danger',
        newTitle: 'Nouveau Danger',
        exportToml: 'Exporter les données du Danger en TOML.',
        exportPng: 'Exporter l’aperçu du Danger en PNG.',
        sections: {
            description: 'Description',
            spectrums: 'Indicateurs',
            customMoves: 'Manœuvres personnalisées',
            hardMoves: 'Manœuvres majeures',
            softMoves: 'Manœuvres mineures',
            meta: 'Pied de page méta',
        },
    },
    customMove: {
        label: 'Manœuvre personnalisée',
        newTitle: 'Nouvelle manœuvre personnalisée',
        description:
            'Une manœuvre personnalisée est une règle que la MC écrit pour une situation précise : ce qui la déclenche, ce que lancent les joueurs s’il y a un jet, et ce que produit chaque résultat. Partez d’une page blanche, ouvrez l’exemple ou importez un fichier TOML.',
        exportToml:
            'Exporter les données de la manœuvre personnalisée en TOML.',
        exportPng: 'Exporter la carte de la manœuvre personnalisée en PNG.',
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
                'Un résultat 12+ sur une manœuvre qui ne demande aucun jet : rien ne peut produire ce résultat, la ligne ne s’applique donc jamais.',
            overPicked:
                'Résultats demandant plus d’options qu’ils n’en proposent : {{outcomes}}.',
            overPickedItem: '{{tier}} (choisir {{count}} parmi {{total}})',
        },
    },
    themeKit: {
        label: 'Kit de thème',
        newTitle: 'Nouveau kit de thème',
        description:
            'Un kit de thème est un livret de thème : le questionnaire vierge qu’un joueur remplit pour construire un thème, avec ses questions lettrées, ses règles de sélection et ses cinq améliorations. La fiche remplie est la fiche de thème, à part. Partez d’une page blanche, ouvrez l’exemple ou importez un fichier TOML.',
        exportToml: 'Exporter les données du livret de thème en TOML.',
        exportPng: 'Exporter la page du livret de thème en PNG.',
        sections: {
            introduction: 'Introduction',
            concept: 'Concept',
            powerTags: 'Questions de trait d’atout',
            weaknessTags: 'Questions de trait de contrainte',
            extraTags: 'Traits bonus',
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
                'Les questions de trait d’atout doivent être lettrées A, B, C dans l’ordre de la liste ; trouvé : {{detail}}.',
            weaknessOutOfSequence:
                'Les questions de trait de contrainte doivent être lettrées A, B, C dans l’ordre de la liste ; trouvé : {{detail}}.',
            outOfSequenceItem: '{{letter}} en position {{position}}',
            crewWithoutRelationships:
                'Un livret de thème d’équipe imprime ses relations d’équipe à la place d’une motivation, et celui-ci n’en contient aucune.',
            relationshipsWithoutCrew:
                'Les relations d’équipe ne s’impriment que sur un livret de thème d’équipe : elles n’apparaîtront pas.',
        },
    },
    themeCard: {
        label: 'Fiche de thème',
        newTitle: 'Nouvelle fiche de thème',
        description:
            'Choisissez comment commencer cette fiche de thème : vierge, exemple ou import TOML.',
        exportToml: 'Exporter les données de la fiche de thème en TOML.',
        exportPng: 'Exporter l’aperçu de la fiche de thème en PNG.',
        sections: {
            motivation: 'Motivation',
            tracks: 'Jauges',
            powerTags: 'Traits d’atout',
            weaknessTags: 'Traits de contrainte',
            improvements: 'Améliorations',
            meta: 'Pied de page méta',
        },
        warnings: {
            mythosErosion:
                'Les fiches Mythos utilisent le Déclin, mais cette fiche porte {{kind}}.',
            logosErosion:
                'Les fiches Logos utilisent le Trauma, mais cette fiche porte {{kind}}.',
            crewErosion:
                'Les fiches d’équipe n’ont pas de jauge d’érosion : cette jauge ne sera pas imprimée.',
            weaknessLetters:
                '{{themebook}} propose les questions de trait de contrainte A à D, mais ces traits citent d’autres lettres : {{letters}}.',
        },
    },
    /* One file per template, so each template's form strings can change on their own. */
    forms: {
        customMove: customMoveForms,
        danger: dangerForms,
        shared: sharedForms,
        themeCard: themeCardForms,
        themeKit: themeKitForms,
    },
}

export default city
