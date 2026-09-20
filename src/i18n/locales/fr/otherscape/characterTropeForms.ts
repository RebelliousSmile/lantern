import type { ResourceShape } from '@/i18n/resourceShape'
import type en from '../../en/otherscape/characterTropeForms'

const forms: ResourceShape<typeof en> = {
    panel: {
        emptyState: 'Cliquez sur la carte pour modifier une section.',
    },
    basic: {
        nameLabel: "Nom de l'archétype de personnage",
        namePlaceholder: 'ex. : Exorciste Néon',
        categoryLabel: 'Catégorie',
        categoryPlaceholder: 'ex. : MYSTIQUES & MÉDIUMS',
        categoryHint:
            "La famille de personnages à laquelle appartient cet archétype, telle que le livre la classe.",
        descriptionPlaceholder:
            "Rédigez ici un court résumé de l'archétype de personnage...",
    },
    themeKits: {
        hint: "Les kits de thème que cet archétype accorde d'office. Orthographiez le tag de titre et la catégorie comme le kit lui-même les orthographie : c'est cette paire qui pointe vers le kit.",
        titleTagLabel: 'Tag de titre',
        categoryLabel: 'Catégorie',
        categoryPlaceholder: 'ex. : RITUEL',
        addButton: 'Ajouter un kit de thème',
        noCategory: 'Aucune catégorie',
        finishEditingToReorder: "Terminez l'édition pour réorganiser",
        titleTagRequired: 'Le tag de titre est requis.',
        categoryRequired: 'La catégorie est requise.',
    },
    choices: {
        hint: "L'un de ces kits de thème, au choix du joueur. Orthographiez le tag de titre et la catégorie comme le kit lui-même les orthographie : c'est cette paire qui pointe vers le kit.",
        titleTagLabel: 'Tag de titre',
        categoryLabel: 'Catégorie',
        categoryPlaceholder: 'ex. : RITUEL',
        addButton: 'Ajouter un choix',
        noCategory: 'Aucune catégorie',
        finishEditingToReorder: "Terminez l'édition pour réorganiser",
        titleTagRequired: 'Le tag de titre est requis.',
        categoryRequired: 'La catégorie est requise.',
    },
    loadout: {
        hint: "L'équipement avec lequel le personnage commence. Rédigez chaque entrée telle qu'elle doit s'imprimer : elle nomme ce qui est emporté plutôt que de pointer vers une pièce d'équipement.",
        addButton: "Ajouter une pièce d'équipement",
        emptyEntryError: "Une pièce d'équipement ne peut pas être vide.",
        dragAriaLabel: "Glisser pour réorganiser la pièce d'équipement",
        finishEditingToReorder: "Terminez l'édition pour réorganiser",
    },
    meta: {
        publicationTypeLabel: 'Type de publication',
        type: {
            official: 'Officiel',
            thirdParty: 'Tiers',
            cauldron: 'Cauldron',
            homebrew: 'Maison',
        },
        sourceLabel: 'Source',
        searchSourcePlaceholder: 'Rechercher une source...',
        noMatch: 'Aucun résultat.',
        selectOfficialBookPlaceholder: 'Sélectionnez un livre officiel...',
        selectThirdPartySourcePlaceholder: 'Sélectionnez une source tierce...',
        sourceHint:
            'Choisir une source remplit automatiquement les auteurs. Vous pouvez toujours les modifier ci-dessous.',
        sourceTitleLabel: {
            cauldron: 'Titre du produit Cauldron',
            homebrew: 'Titre / emplacement maison',
            default: 'Titre de la source',
        },
        sourceTitlePlaceholder: {
            cauldron: 'ex. : Cauldron : Neon Debts',
            homebrew: 'ex. : Blog personnel, document de campagne...',
            default: 'Remplacer le titre de la source sélectionnée',
        },
        optional: '(facultatif)',
        pageLabel: 'Page',
        pagePlaceholderExample: '71',
        authorsLabel: 'Auteurs',
        authorsPlaceholder: 'Ajouter un auteur...',
        authorsPlaceholderDefault: 'Ajouter un auteur et appuyer sur Entrée',
        removeAuthorAriaLabel: 'Retirer {{author}}',
        footerHint:
            "Les métadonnées aident l'attribution et la recherche, et sont préservées à l'import comme à l'export.",
    },
    appearance: {
        autoHideEmptyLabel: 'Masquer automatiquement les sections vides',
        sectionsHeading: 'Sections',
        previewWidthLabel: "Largeur de l'aperçu",
        backgroundHeading: 'Arrière-plan',
        backgroundOption: {
            neon: 'Néon',
            plain: 'Uni',
        },
        resetViewButton: "Réinitialiser l'affichage",
    },
    imageExport: {
        scaleHeading: "Échelle de l'image",
        scale1x: '1x',
        scale2x: '2x',
        scale3x: '3x',
    },
}

export default forms
