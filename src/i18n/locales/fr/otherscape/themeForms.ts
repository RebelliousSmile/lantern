import type { ResourceShape } from '@/i18n/resourceShape'
import type en from '../../en/otherscape/themeForms'

const forms: ResourceShape<typeof en> = {
    panel: {
        emptyState: 'Cliquez sur la carte pour modifier une section précise.',
    },
    themeType: {
        self: 'Soi',
        mythos: 'Mythos',
        noise: 'Bruit',
        crew: 'Équipe',
    },
    questLabel: {
        self: 'Identité',
        mythos: 'Rituel',
        noise: 'Démangeaison',
        crew: 'Motivation',
    },
    basic: {
        titleTagLabel: 'Tag de titre',
        titleTagPlaceholder: 'Chirurgien de ruelle',
        titleTagHelp:
            "La carte l'imprime comme titre : écrivez-le à nu, sans accolades, et ne le répétez pas dans les tags de pouvoir.",
        themeTypeLabel: 'Type de thème',
        themeTypeAriaLabel: 'Type de thème',
        themeTypeHelp: {
            self: 'Détermine la couleur de la carte et le nom de sa quête : Identité pour un thème du Soi.',
            mythos: 'Détermine la couleur de la carte et le nom de sa quête : Rituel pour un thème de Mythos.',
            noise: 'Détermine la couleur de la carte et le nom de sa quête : Démangeaison pour un thème de Bruit.',
            crew: "Détermine la couleur de la carte et le nom de sa quête : Motivation pour un thème d'Équipe.",
        },
        themebookLabel: 'Livre de thèmes',
        optionalSuffix: '(optionnel)',
        themebookPlaceholder: 'Commerce de rue, Augmenté, Enclave...',
        themebookHelp:
            "Imprimé dans le bandeau d'en-tête. Laissé vide, le bandeau s'affiche quand même.",
    },
    quest: {
        help: {
            self: "Ce que poursuit un thème du Soi. La carte l'imprime sous ce nom. Le Markdown et les tags entre accolades sont rendus.",
            mythos: "Ce que poursuit un thème de Mythos. La carte l'imprime sous ce nom. Le Markdown et les tags entre accolades sont rendus.",
            noise: "Ce que poursuit un thème de Bruit. La carte l'imprime sous ce nom. Le Markdown et les tags entre accolades sont rendus.",
            crew: "Ce que poursuit un thème d'Équipe. La carte l'imprime sous ce nom. Le Markdown et les tags entre accolades sont rendus.",
        },
        placeholder: {
            self: 'Garder la clinique ouverte, quoi que le quartier exige en retour.',
            mythos: 'Achever le rite que la vieille ville a commencé et jamais refermé.',
            noise: 'Faire sortir le signal avant que la tour ne remarque sa disparition.',
            crew: "S'approprier le pâté de maisons entier, une faveur à la fois.",
        },
    },
    tags: {
        powerLabel: 'Tags de pouvoir',
        weaknessLabel: 'Tags de faiblesse',
        writeBareHelp: 'Écrivez les tags à nu, sans accolades.',
        tagFieldLabel: 'Tag',
        tagInputPlaceholder: 'lit un corps comme un schéma',
        valueRequired: 'Veuillez saisir une valeur.',
        addButton: 'Ajouter un tag',
        finishEditingToReorder: "Terminez l'édition pour réordonner",
        power: {
            placeholder1: 'lit un corps comme un schéma',
            placeholder2: 'une clinique derrière le bar à nouilles',
            placeholder3: 'tout le monde me doit une faveur',
        },
        weakness: {
            placeholder1: "doit de l'argent aux mauvaises personnes",
            placeholder2: 'incapable de dire non à un patient',
            placeholder3: "l'ordre professionnel a un dossier sur moi",
        },
    },
    tracks: {
        heading: 'Jauges',
    },
    trackLabel: {
        upgrade: 'Évolution',
        decay: 'Déclin',
    },
    trackHelp: {
        upgrade: 'Marquée à mesure que le thème grandit. Trois marques et il est prêt à évoluer.',
        decay: "Marquée à mesure que le thème s'effrite. Trois marques et il est prêt à être perdu.",
    },
    meta: {
        publicationTypeLabel: 'Type de publication',
        typeOfficial: 'Officiel',
        typeThirdParty: 'Tiers',
        typeCauldron: 'Cauldron',
        typeHomebrew: 'Maison',
        sourceLabel: 'Source',
        searchSourcePlaceholder: 'Rechercher une source...',
        noMatch: 'Aucun résultat.',
        selectOfficialPlaceholder: 'Sélectionner un ouvrage officiel...',
        selectThirdPartyPlaceholder: 'Sélectionner une source tierce...',
        autoFillHelp:
            "La sélection d'une source remplit automatiquement les auteurs. Vous pouvez toujours les modifier ci-dessous.",
        cauldronTitleLabel: 'Titre du produit Cauldron',
        homebrewTitleLabel: 'Titre ou lieu (création maison)',
        sourceTitleLabel: 'Titre de la source',
        cauldronTitlePlaceholder: 'ex. Cauldron : Neon Debts',
        homebrewTitlePlaceholder: 'ex. Blog personnel, doc de campagne...',
        sourceTitlePlaceholder: 'Remplacer le titre de la source sélectionnée',
        pageLabel: 'Page',
        authorsLabel: 'Auteurs',
        addAuthorPlaceholder: 'Ajouter un auteur...',
        addAuthorAndEnterPlaceholder: 'Ajouter un auteur et appuyer sur Entrée',
        removeAuthorAriaLabel: 'Retirer {{author}}',
        footerHelp:
            "Les métadonnées aident à l'attribution et à la recherche, et sont préservées à l'import comme à l'export.",
    },
    appearance: {
        autoHideEmptySections: 'Masquer automatiquement les sections vides',
        sectionsLabel: 'Sections',
        previewWidthLabel: "Largeur de l'aperçu",
        backgroundLabel: 'Arrière-plan',
        resetView: "Réinitialiser l'affichage",
        background: {
            neon: 'Néon',
            plain: 'Sobre',
        },
    },
    exportSettings: {
        imageScale: "Échelle de l'image",
    },
}

export default forms
