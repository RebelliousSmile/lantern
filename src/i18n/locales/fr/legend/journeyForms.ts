import type { ResourceShape } from '@/i18n/resourceShape'
import type en from '../../en/legend/journeyForms'

const forms: ResourceShape<typeof en> = {
    basic: {
        namePlaceholder: 'La longue route vers Blackmere',
        nameHint: 'Le nom que le Narrateur donne à ce voyage à la table.',
        typeLabel: 'Type',
        typeHint:
            "Un Paysage est un lieu traversé, une Occasion un événement vécu, une Entreprise une tâche menée à bien. Le bandeau en tire sa couleur.",
        typeOptions: {
            landscape: 'Paysage',
            occasion: 'Occasion',
            undertaking: 'Entreprise',
        },
        descriptionPlaceholder: 'À lire à voix haute quand les héros partent.',
        descriptionHint:
            'Le Markdown et les balises entre accolades sont rendus sur la planche.',
    },
    benefits: {
        placeholder: 'Ce que les héros gagnent en allant au bout.',
        hint: "Imprimé comme une phrase après un libellé en gras, pas comme une liste. Le Markdown et les balises entre accolades sont rendus sur la planche.",
    },
    consequences: {
        hint: 'Ce que la route peut coûter n’importe où.',
        emptyError: 'Une conséquence a besoin de texte.',
        fieldLabel: 'Conséquence',
        fieldPlaceholder: "Quelqu'un dans le groupe prend {tired-2}.",
        fieldHint:
            'Commencer par <em>Nouveau défi :</em> imprime ce préfixe en gras.',
        add: 'Ajouter une conséquence',
    },
    shared: {
        dragDisabledTitle: 'Terminez la modification pour réordonner',
    },
    appearance: {
        backgroundOptions: {
            parchment: 'Parchemin',
            plain: 'Uni',
        },
    },
}

export default forms
