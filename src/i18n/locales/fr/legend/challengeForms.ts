import type { ResourceShape } from '@/i18n/resourceShape'
import type en from '../../en/legend/challengeForms'

const forms: ResourceShape<typeof en> = {
    panel: {
        emptyState: "Cliquez sur l'aperçu pour modifier une section spécifique.",
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
        backgroundLabel: 'Fond',
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
        selectThreatPrompt: 'Sélectionnez une menace pour modifier ses conséquences',
        consequencesForTitle: 'Conséquences de : {{name}}',
        addConsequence: 'Ajouter une conséquence',
        addGeneralConsequence: 'Ajouter une conséquence générale',
        consequenceEmptyError: 'La conséquence ne peut pas être vide.',
        consequenceMinError: 'Chaque menace doit avoir au moins une conséquence.',
        back: 'Retour',
    },
}

export default forms
