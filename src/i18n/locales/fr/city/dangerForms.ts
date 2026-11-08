import type { ResourceShape } from '@/i18n/resourceShape'
import type en from '../../en/city/dangerForms'

const forms: ResourceShape<typeof en> = {
    appearance: {
        layoutLabel: 'Disposition',
        oneColumn: '1 colonne',
        twoColumns: '2 colonnes',
        blockHeight: 'Hauteur du bloc',
    },
    basic: {
        nameLabel: 'Nom du Danger',
        namePlaceholder: 'p. ex. La Salle rouge',
        levelLabel: 'Rang (0-5)',
        descriptionPlaceholder:
            "Décrivez le Danger et la menace qu'il fait peser sur l'équipe.",
    },
    spectrums: {
        nameLabel: "Nom de l'indicateur",
        namePlaceholder: 'blessure',
        maximumLabel: 'Rang maximum',
        immune: 'Immunisé',
        add: 'Ajouter un indicateur',
        errorNameRequired: "Le nom de l'indicateur est obligatoire.",
    },
    customMoves: {
        add: 'Ajouter une manœuvre personnalisée',
        untitled: 'Manœuvre personnalisée sans titre',
        namePlaceholder: 'Manœuvre personnalisée',
        descriptionPlaceholder: 'Décrivez la manœuvre personnalisée.',
        errorNameRequired:
            'Le nom de la manœuvre personnalisée est obligatoire.',
        errorDescriptionRequired:
            'La description de la manœuvre personnalisée est obligatoire.',
    },
    hardMoves: {
        add: 'Ajouter une manœuvre majeure',
        placeholder: 'Décrivez une manœuvre majeure.',
        field: 'Manœuvre majeure',
    },
    softMoves: {
        add: 'Ajouter une manœuvre mineure',
        placeholder: 'Décrivez une manœuvre mineure.',
        field: 'Manœuvre mineure',
    },
}

export default forms
