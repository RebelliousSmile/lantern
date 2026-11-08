import type { ResourceShape } from '@/i18n/resourceShape'
import type en from '../../en/legend/challengeForms'

const forms: ResourceShape<typeof en> = {
    panel: {
        emptyState:
            "Cliquez sur l'aperçu pour modifier une section spécifique.",
    },
    basicForm: {
        nameLabel: 'Nom du défi',
        namePlaceholder: 'p. ex. La Chose du tas',
        ratingLabel: 'Échelle (1 à 5)',
        rolesLabel: 'Rôles',
        rolesHint:
            'Choisissez un ou plusieurs rôles qui décrivent le mieux ce défi (voir <i>Legend in the Mist - Vol. II - The Narrator</i>, p. 110)',
        descriptionLabel: 'Description',
        descriptionPlaceholder: 'Rédigez un court résumé du défi ici...',
        roles: {
            Aggressor: 'Agresseur',
            Charge: 'Protégé',
            Countdown: 'Compte à rebours',
            Influence: 'Influence',
            Mystery: 'Mystère',
            Obstacle: 'Obstacle',
            Pursuer: 'Poursuivant',
            Quarry: 'Proie',
            Sapper: 'Sapeur',
            Support: 'Soutien',
            Watcher: 'Guetteur',
        },
    },
    appearancePanel: {
        autoHideEmpty: 'Masquer automatiquement les sections vides',
        sections: 'Sections',
        previewWidth: "Largeur de l'aperçu",
        backgroundLabel: 'Arrière-plan',
        resetView: "Réinitialiser l'affichage",
        background: {
            parchment: 'Parchemin',
            plain: 'Uni',
        },
    },
    imageExportSettings: {
        imageScale: 'Échelle de l’image',
    },
    consequencesPanel: {
        selectThreatPrompt:
            'Sélectionnez une menace pour modifier ses conséquences',
        consequencesForTitle: 'Conséquences de : {{name}}',
        addConsequence: 'Ajouter une conséquence',
        addGeneralConsequence: 'Ajouter une conséquence générale',
        consequenceEmptyError: 'La conséquence ne peut pas être vide.',
        consequenceMinError:
            'Chaque menace doit avoir au moins une conséquence.',
        back: 'Retour',
    },
    shared: {
        finishEditingToReorder: 'Terminez la modification pour réorganiser',
        noDescription: 'Aucune description',
    },
    limits: {
        immuneLabel: 'Immunisée',
        immuneLevelTitle: 'Ignoré quand la limite est immunisée',
        progressLabel: 'Limite de progression',
        onMaxPlaceholder: 'Quand cette limite de progression se remplit…',
        addLimit: 'Ajouter une limite',
        errorNameRequired: 'Le nom est requis.',
        errorDuplicateName: 'Ce nom de limite existe déjà.',
    },
    mights: {
        vulnerabilityLabel: 'Vulnérabilité',
        vulnerabilityPlaceholder: 'p. ex. la flatterie',
        addMight: 'Ajouter une puissance',
        errorNameRequired: 'Le nom est requis.',
        errorDuplicate: 'Une puissance de ce nom et de ce niveau existe déjà.',
    },
    specials: {
        markdownHint: '(Markdown)',
        descriptionPlaceholder: 'Quand ceci se produit... alors cela se passe.',
        addFeature: 'Ajouter une particularité',
        errorNameRequired: 'Le nom est requis.',
        errorDescriptionRequired: 'La description est requise.',
    },
    tags: {
        rawValueLabel: 'Valeur brute',
        rawValuePlaceholder:
            '{tag de pouvoir}, {status-3}, {!tag de faiblesse} ou texte brut',
        addEntry: 'Ajouter une entrée',
        errorRequired: 'Veuillez saisir une valeur.',
    },
    threats: {
        addThreat: 'Ajouter une menace',
        editGeneralConsequences: 'Modifier les conséquences générales',
        errorNameRequired: 'Le nom de la menace est requis.',
        errorDescriptionRequired: 'La description de la menace est requise.',
        descriptionLabel: 'Description courte',
        descriptionHint: '(Markdown + jetons)',
        descriptionPlaceholder: 'Ce que le défi commence à faire…',
        charactersCount: '{{length}}/{{max}} caractères',
        consequencesTitle: 'Conséquences',
        editConsequencesAriaLabel: 'Modifier les conséquences',
        dragThreatAriaLabel: 'Glisser pour réordonner la menace',
        dragConsequenceAriaLabel: 'Glisser pour réordonner la conséquence',
    },
    metaForm: {
        publicationTypeLabel: 'Type de publication',
        publicationTypes: {
            official: 'Officiel',
            thirdParty: 'Tierce partie',
            cauldron: 'Cauldron',
            homebrew: 'Fait maison',
        },
        sourceLabel: 'Source',
        selectOfficialSource: 'Sélectionner un livre officiel...',
        selectThirdPartySource: 'Sélectionner une source tierce...',
        autoFillHint:
            'Choisir une source remplit automatiquement les auteurs. Vous pouvez toujours les modifier ci-dessous.',
        searchSourcePlaceholder: 'Rechercher une source...',
        noMatch: 'Aucun résultat.',
        sourceTitleLabel: {
            cauldron: 'Titre du produit Cauldron',
            homebrew: 'Titre / lieu du fait maison',
            default: 'Titre de la source',
        },
        sourceTitlePlaceholder: {
            cauldron: 'ex. : Cauldron : Shadows in Brine',
            homebrew: 'ex. : blog personnel, document de campagne...',
            default: 'Remplacer le titre de la source sélectionnée',
        },
        optional: '(optionnel)',
        pageLabel: 'Page',
        authorsLabel: 'Auteurs',
        authorsPlaceholder: 'Ajouter un auteur...',
        removeAuthor: 'Retirer {{author}}',
        metaHint:
            'Les métadonnées aident à l’attribution et à la recherche ; elles sont conservées à l’import comme à l’export.',
    },
}

export default forms
