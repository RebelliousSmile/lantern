import type { ResourceShape } from '@/i18n/resourceShape'
import type en from '../../en/otherscape/challengeForms'

const forms: ResourceShape<typeof en> = {
    panel: {
        emptyState: 'Cliquez sur la carte pour modifier une section précise.',
    },
    basic: {
        nameLabel: 'Nom du défi',
        namePlaceholder: 'p. ex. Chrome Vulture Runner',
        scaleLabel: 'Échelle',
        scaleHint:
            "Laissez l'échelle vide pour un défi de taille humaine. Plus grand compte vers le haut, plus petit vers le bas.",
        descriptionPlaceholder: 'Rédigez ici un court résumé du défi...',
    },
    tags: {
        rawValueLabel: 'Valeur brute',
        rawValuePlaceholder:
            '{tag de pouvoir}, {status-3}, {!tag de faiblesse} ou texte brut',
        addEntry: 'Ajouter une entrée',
        errorRequired: 'Veuillez saisir une valeur.',
        finishEditingToReorder: 'Terminez la modification pour réorganiser',
    },
    limits: {
        levelLabel: 'Niveau',
        levelTitle: '1–6',
        polarLabel: 'Limite polaire',
        polarHint:
            'Deux pôles opposés écrits comme un seul nom, reliés par une barre oblique',
        progressLabel: 'Limite de progression',
        onMaxPlaceholder: 'Quand cette limite de progression se remplit…',
        addLimit: 'Ajouter une limite',
        errorNameRequired: 'Le nom est requis.',
        errorDuplicateName: 'Ce nom de limite existe déjà.',
        finishEditingToReorder: 'Terminez la modification pour réorganiser',
    },
    specials: {
        descriptionMarkdownLabel: 'Description (Markdown)',
        descriptionPlaceholder: 'Quand ceci se produit... alors cela se passe.',
        addSpecial: 'Ajouter une particularité',
        errorNameRequired: 'Le nom est requis.',
        errorDescriptionRequired: 'La description est requise.',
        noDescription: 'Aucune description',
        finishEditingToReorder: 'Terminez la modification pour réorganiser',
    },
    consequences: {
        helperText:
            "Ce que le défi coûte à l'Équipe quelle que soit la menace en cours. Une menace qui a ses propres conséquences les garde dans le formulaire des menaces.",
        addGeneralConsequence: 'Ajouter une conséquence générale',
        dragAriaLabel: 'Glisser pour réorganiser la conséquence',
        finishEditingToReorder: 'Terminez la modification pour réorganiser',
        errorEmpty: 'La conséquence ne peut pas être vide.',
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
