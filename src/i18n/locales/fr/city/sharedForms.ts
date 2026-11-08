import type { ResourceShape } from '@/i18n/resourceShape'
import type en from '../../en/city/sharedForms'

const forms: ResourceShape<typeof en> = {
    panel: {
        emptyState: "Cliquez sur l'aperçu pour modifier une section précise.",
    },
    list: {
        finishEditingToReorder: "Terminez l'édition pour réordonner",
        valueRequired: 'Veuillez saisir une valeur.',
    },
    appearance: {
        autoHideEmptySections: 'Masquer automatiquement les sections vides',
        showSeparators: 'Afficher les séparateurs',
        sectionsLabel: 'Sections',
        previewWidthLabel: "Largeur de l'aperçu",
        backgroundLabel: 'Arrière-plan',
        useBackground: "Utiliser l'arrière-plan {{name}}",
        titlePlacementLabel: 'Position du titre',
        titleOutside: "À l'extérieur",
        titleInside: "À l'intérieur",
        resetView: "Réinitialiser l'affichage",
        background: {
            rose: 'Rose',
            cream: 'Crème',
            paper: 'Papier',
            ochre: 'Ocre',
            sand: 'Sable',
            lemon: 'Citron',
            sage: 'Sauge',
            clay: 'Argile',
        },
    },
    exportSettings: {
        imageScale: "Échelle de l'image",
    },
    meta: {
        publicationTypeLabel: 'Type de publication',
        typeOfficial: 'Officiel',
        typeThirdParty: 'Tiers',
        typeCauldron: 'Cauldron',
        typeHomebrew: 'Maison',
        sourceLabel: 'Source',
        catalogSourceLabel: 'Source du catalogue',
        selectSourcePlaceholder: 'Sélectionner une source...',
        searchSourcePlaceholder: 'Rechercher une source...',
        noMatch: 'Aucun résultat.',
        selectOfficialPlaceholder: 'Sélectionner un ouvrage officiel...',
        selectThirdPartyPlaceholder: 'Sélectionner une source tierce...',
        autoFillHelp:
            "La sélection d'une source remplit automatiquement les auteurs. Vous pouvez toujours les modifier ci-dessous.",
        cauldronTitleLabel: 'Titre du produit Cauldron',
        homebrewTitleLabel: 'Titre ou lieu (création maison)',
        sourceTitleLabel: 'Titre de la source',
        cauldronTitlePlaceholder: 'ex. Cauldron : Shadows in Brine',
        homebrewTitlePlaceholder: 'ex. Notes de campagne personnelles',
        sourceTitlePlaceholder: 'Remplacer le titre de la source sélectionnée',
        optional: '(optionnel)',
        pageLabel: 'Page',
        authorsLabel: 'Auteurs',
        addAuthorPlaceholder: 'Ajouter un auteur...',
        addAuthorAndEnterPlaceholder: 'Ajouter un auteur et appuyer sur Entrée',
        removeAuthorAriaLabel: 'Retirer {{author}}',
        footerHelp:
            "Les métadonnées sont préservées à l'import comme à l'export, et affichées en petit pied de page dans l'aperçu.",
        attributionHelp: "L'attribution est préservée dans les exports TOML.",
    },
    help: {
        markdown: 'Le Markdown est pris en charge.',
        inlineMarkdown: 'Le Markdown en ligne est pris en charge.',
    },
    themeType: {
        mythos: 'Mythos',
        logos: 'Logos',
        extra: 'Extra',
        crew: 'Équipe',
    },
    zone: {
        mystery: 'Mystère',
        identity: 'Identité',
        motivation: 'Motivation',
    },
    track: {
        attention: 'Attention',
        fade: 'Déclin',
        crack: 'Trauma',
    },
}

export default forms
