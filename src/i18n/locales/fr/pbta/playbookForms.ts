import type { ResourceShape } from '@/i18n/resourceShape'
import type en from '../../en/pbta/playbookForms'

const forms: ResourceShape<typeof en> = {
    entry: {
        ref: 'Réf.',
        inline: 'Intégrée',
    },
    labels: {
        tags: 'Mots-clés',
    },
    moveFields: {
        name: "Nom de l'action",
        resultLabelPlaceholder: 'Libellé, p. ex. 10+',
        removeResult: 'Retirer le résultat {{key}}',
        resultKeyPlaceholder: 'Clé du résultat, p. ex. strong',
        addResult: 'Ajouter un résultat',
        moveTypeKeyPlaceholder: "Clé du type d'action",
        audience: 'Destinataire',
        triggerPlaceholder: 'Déclencheur, p. ex. vous agissez malgré le danger',
        roll: 'Jet',
        rollTypePlaceholder: 'type',
        rollFormulaPlaceholder: 'formule, p. ex. 2d6+Nerve',
        rollModPlaceholder: 'mod.',
        removeRoll: 'Retirer le jet',
        addRoll: 'Ajouter un jet',
        results: 'Résultats',
        usesPlaceholder: 'Utilisations (optionnel)',
        choicesPlaceholder: 'Note sur les choix (optionnel)',
    },
    choiceSets: {
        grantedPlaceholder: 'accordés',
        advancementPlaceholder: 'progression',
        removeChoice: 'Retirer le choix',
        single: 'Un seul',
        multi: 'Plusieurs',
        repeatable: 'Répétable',
        grantOnPlaceholder: 'Accordé à, p. ex. creation',
        choices: 'Choix',
        addChoice: 'Ajouter un choix',
        addChoiceSet: 'Ajouter un jeu de choix',
    },
    creation: {
        labelPlaceholder: 'Libellé, p. ex. Nom',
        add: 'Ajouter une entrée',
    },
    gear: {
        typeKeyPlaceholder: 'Clé du type',
        quantityPlaceholder: 'Qté',
        add: 'Ajouter un équipement',
    },
    audience: {
        any: 'Tous',
        character: 'Personnage',
        npc: 'PNJ',
        mc: 'MC',
    },
    moves: {
        acquired: 'Action acquise',
        remove: "Retirer l'action",
        add: 'Ajouter une action',
    },
    readOnly: {
        title: 'Lecture seule',
        description:
            "Ouvrez l'onglet de définition du jeu « {{game}} » pour modifier ce livret. Sans lui, ses caractéristiques et ses actions ne peuvent pas être validées par rapport au jeu : la modification est donc désactivée.",
    },
    basic: {
        title: 'Livret',
        name: 'Nom du livret',
        slug: 'Identifiant',
        game: 'Identifiant du jeu',
    },
    creationForm: {
        invalidTarget:
            'Cette question doit cibler un attribut Text ou LongText disponible pour une seule réponse, ou un attribut ListMany pour plusieurs réponses.',
        apply: 'Appliquer la sélection',
    },
    movesForm: {
        moves: 'Actions',
        startingMoves: 'Actions de départ',
        slugPlaceholder:
            "Ajouter l'identifiant d'une action et appuyer sur Entrée",
    },
    statsForm: {
        profile: 'Profil de caractéristiques de départ',
        stats: 'Caractéristiques',
        detail: 'Détail des caractéristiques',
        attributes: 'Attributs',
        attributesHint:
            "Ouvrez l'onglet de définition du jeu de ce livret (même identifiant de jeu) pour en modifier ici les attributs.",
    },
}

export default forms
