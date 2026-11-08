import type { ResourceShape } from '@/i18n/resourceShape'
import type en from '../../en/otherscape/powerSetForms'

const forms: ResourceShape<typeof en> = {
    panel: {
        emptyState: 'Cliquez sur la carte pour modifier une section précise.',
    },
    basic: {
        nameLabel: 'Nom du Power Set',
        namePlaceholder: 'p. ex. Berserk touché par la Source',
        typeLabel: 'Type',
        typeHint:
            "Le type colore la carte et dit d'où vient le pouvoir : le Soi vient de la personne, le Mythos de quelque chose de plus ancien, le Bruit du réseau.",
        typeOptions: {
            self: 'Soi',
            mythos: 'Mythos',
            noise: 'Bruit',
        },
        descriptionPlaceholder: 'Rédigez ici un court résumé du Power Set...',
        ratingLabel: 'Cote ajoutée',
        ratingNone: 'Aucune',
        optionalRatingLabel: 'Étoiles optionnelles',
        ratingHint:
            "Les étoiles que le Power Set ajoute au Challenge auquel on le greffe, imprimées +⊕ à côté de son nom. Les étoiles optionnelles s'impriment entre parenthèses, +⊕(⊕), et demandent une cote.",
    },
    tags: {
        label: 'Tags et statuts, un par ligne',
        placeholder: '{enragé-2}\n{peau de ferraille}',
        hint: "Ce que le Power Set ajoute au Challenge, écrit avec ses accolades comme sur un Challenge, pour que la liste s'y recopie telle quelle.",
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
        addButton: 'Ajouter une conséquence générale',
        hint: "Ce que le Power Set coûte à l'Équipe quelle que soit la Menace en cours. Une Menace qui a ses propres conséquences les garde dans le formulaire des Menaces.",
        dragTitleDisabled: 'Terminez la modification pour réordonner',
    },
    meta: {
        publicationTypeLabel: 'Type de publication',
        typeOfficial: 'Officiel',
        typeThirdParty: 'Tiers',
        typeCauldron: 'Cauldron',
        typeHomebrew: 'Maison',
        sourceLabel: 'Source',
        sourceHint:
            'Choisir une source remplit automatiquement les auteurs. Vous pouvez toujours modifier ci-dessous.',
        sourcePlaceholderOfficial: 'Sélectionner un ouvrage officiel...',
        sourcePlaceholderThirdParty: 'Sélectionner une source tierce...',
        searchSourcePlaceholder: 'Rechercher une source...',
        noMatch: 'Aucun résultat.',
        sourceTitleLabelCauldron: 'Titre du produit Cauldron',
        sourceTitleLabelHomebrew: 'Titre / emplacement maison',
        sourceTitleLabelDefault: 'Titre de la source',
        optionalSuffix: '(optionnel)',
        sourceTitlePlaceholderCauldron: 'p. ex. Cauldron : Neon Debts',
        sourceTitlePlaceholderHomebrew:
            'p. ex. blog personnel, document de campagne...',
        sourceTitlePlaceholderDefault:
            'Remplacer le titre de la source sélectionnée',
        pageLabel: 'Page',
        authorsLabel: 'Auteurs',
        authorsPlaceholder: 'Ajouter un auteur...',
        authorsPlaceholderDefault: 'Ajouter un auteur et appuyer sur Entrée',
        removeAuthorAriaLabel: 'Retirer {{author}}',
        footerHint:
            "Les métadonnées aident à l'attribution et à la recherche, et sont conservées à l'import/export.",
    },
    appearance: {
        autoHideEmptyLabel: 'Masquer automatiquement les sections vides',
        sectionsHeading: 'Sections',
        previewWidthLabel: "Largeur de l'aperçu",
        backgroundHeading: 'Arrière-plan',
        backgroundNeon: 'Néon',
        backgroundPlain: 'Uni',
        resetView: "Réinitialiser l'affichage",
    },
    imageExport: {
        scaleHeading: "Échelle de l'image",
    },
}

export default forms
