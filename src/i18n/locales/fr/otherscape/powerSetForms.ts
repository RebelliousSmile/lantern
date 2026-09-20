import type { ResourceShape } from '@/i18n/resourceShape'
import type en from '../../en/otherscape/powerSetForms'

const forms: ResourceShape<typeof en> = {
    panel: {
        emptyState: 'Cliquez sur la carte pour modifier une section précise.',
    },
    basic: {
        nameLabel: "Nom de l'ensemble de pouvoirs",
        namePlaceholder: 'p. ex. Berserk touché par la Source',
        typeLabel: 'Type',
        typeHint:
            "Le type colore la carte et dit d'où vient le pouvoir : le Soi vient de la personne, le Mythos de quelque chose de plus ancien, le Bruit du réseau.",
        typeOptions: {
            self: 'Soi',
            mythos: 'Mythos',
            noise: 'Bruit',
        },
        descriptionPlaceholder:
            "Rédigez ici un court résumé de l'ensemble de pouvoirs...",
    },
    specials: {
        nameRequiredError: 'Le nom est obligatoire.',
        descriptionRequiredError: 'La description est obligatoire.',
        descriptionHint: '(Markdown)',
        descriptionPlaceholder: 'Quand ceci arrive... alors faites cela.',
        addButton: 'Ajouter une particularité',
        dragTitleDisabled: 'Terminez la modification pour réordonner',
        noDescription: 'Aucune description',
    },
    consequences: {
        emptyError: 'Une conséquence ne peut pas être vide.',
        hint: "Ce que l'ensemble de pouvoirs coûte à l'Équipe quelle que soit la Menace en cours. Une Menace qui a ses propres conséquences les garde dans le formulaire des Menaces.",
        dragTitleDisabled: 'Terminez la modification pour réordonner',
    },
}

export default forms
