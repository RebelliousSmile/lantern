import type { ResourceShape } from '@/i18n/resourceShape'
import type en from '../../en/legend/journeyForms'

const forms: ResourceShape<typeof en> = {
    panel: {
        emptyState: 'Cliquez sur la double page pour modifier une section.',
    },
    tags: {
        heading: 'Tags',
        bareHint: 'Écrivez les tags sans accolades.',
        tagLabel: 'Tag',
        placeholder: 'un gué que seuls les gens du coin connaissent',
        emptyValueError: 'Veuillez saisir une valeur.',
        addTag: 'Ajouter un tag',
    },
    vignettes: {
        heading: 'Vignettes',
        subheading: 'Les moments en lesquels ce voyage se décompose.',
        namePlaceholder: 'La lieue noyée',
        triggerLabel: 'Déclencheur',
        optional: '(optionnel)',
        triggerPlaceholder: 'Ce qui déclenche ce moment.',
        errorNameRequired: 'Une vignette a besoin d’un nom.',
        addVignette: 'Ajouter une vignette',
        consequencesHeading: 'Conséquences',
        consequencesMissing:
            'Une vignette a besoin d’au moins une conséquence pour être exportée.',
        consequencePlaceholder: 'Ce que ce moment coûte quand tout va mal.',
        consequenceCount_one: '{{count}} conséquence',
        consequenceCount_other: '{{count}} conséquences',
        noTrigger: 'sans déclencheur',
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
    basic: {
        namePlaceholder: 'La longue route vers Blackmere',
        nameHint: 'Le nom que le Narrateur donne à ce voyage à la table.',
        typeLabel: 'Type',
        typeHint:
            'Un Paysage est un lieu traversé, une Occasion un événement vécu, une Entreprise une tâche menée à bien. Le bandeau en tire sa couleur.',
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
        hint: 'Imprimé comme une phrase après un libellé en gras, pas comme une liste. Le Markdown et les balises entre accolades sont rendus sur la planche.',
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
        autoHideEmptySections: 'Masquer automatiquement les sections vides',
        sectionsLabel: 'Sections',
        zoomLabel: 'Zoom',
        previewWidthLabel: 'Largeur de l’aperçu',
        backgroundLabel: 'Arrière-plan',
        backgroundOptions: {
            parchment: 'Parchemin',
            plain: 'Uni',
        },
        resetView: 'Réinitialiser l’affichage',
        imageScaleLabel: 'Échelle de l’image',
    },
}

export default forms
