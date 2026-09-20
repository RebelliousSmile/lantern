import type { ResourceShape } from '@/i18n/resourceShape'
import type en from '../../en/otherscape/themeKitForms'

const forms: ResourceShape<typeof en> = {
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
    optional: '(optionnel)',
    basic: {
        titleTagLabel: 'Tag de titre',
        titleTagPlaceholder: 'Rebouteux du fond de ruelle',
        titleTagHint:
            "La carte l'imprime comme titre : écrivez-le nu, sans accolades, et ne le répétez pas parmi les tags de pouvoir.",
        themeTypeLabel: 'Type de thème',
        themeTypeHint: {
            self: 'Détermine la couleur de la carte et le nom de sa quête : Identité pour un thème du Soi.',
            mythos: 'Détermine la couleur de la carte et le nom de sa quête : Rituel pour un thème de Mythos.',
            noise: 'Détermine la couleur de la carte et le nom de sa quête : Démangeaison pour un thème de Bruit.',
            crew: "Détermine la couleur de la carte et le nom de sa quête : Motivation pour un thème d'Équipe.",
        },
        themebookLabel: 'Livre de thèmes',
        themebookPlaceholder: 'Street Trade, Augmented, Enclave...',
        themebookHint:
            "Imprimé dans le bandeau d'en-tête. Laissé vide, le bandeau reste affiché.",
    },
    quest: {
        placeholder: {
            self: 'Garder la clinique ouverte, quoi que le quartier exige en retour.',
            mythos: "Achever le rite que la vieille ville a commencé et n'a jamais refermé.",
            noise: 'Faire sortir le signal avant que la tour ne remarque sa disparition.',
            crew: 'Posséder le pâté de maisons en propre, une faveur à la fois.',
        },
        hint: {
            self: "Ce que poursuit un thème du Soi. La carte l'imprime sous ce nom. Le markdown et les tags entre accolades sont rendus.",
            mythos: "Ce que poursuit un thème de Mythos. La carte l'imprime sous ce nom. Le markdown et les tags entre accolades sont rendus.",
            noise: "Ce que poursuit un thème de Bruit. La carte l'imprime sous ce nom. Le markdown et les tags entre accolades sont rendus.",
            crew: "Ce que poursuit un thème d'Équipe. La carte l'imprime sous ce nom. Le markdown et les tags entre accolades sont rendus.",
        },
    },
    tags: {
        fieldLabel: {
            power: 'Tags de pouvoir',
            weakness: 'Tags de faiblesse',
        },
        hint: 'Écrivez les tags nus, sans accolades.',
        tagLabel: 'Tag',
        tagInputPlaceholder: 'lit un corps comme un schéma',
        emptyValueError: 'Veuillez entrer une valeur.',
        finishEditingToReorder: "Terminez l'édition pour réordonner",
        addTag: 'Ajouter un tag',
    },
    meta: {
        publicationTypeLabel: 'Type de publication',
        publicationType: {
            official: 'Officiel',
            thirdParty: 'Tiers',
            cauldron: 'Cauldron',
            homebrew: 'Maison',
        },
        sourceLabel: 'Source',
        searchSourcePlaceholder: 'Rechercher une source...',
        noMatch: 'Aucun résultat.',
        selectOfficialBook: 'Sélectionner un livre officiel...',
        selectThirdPartySource: 'Sélectionner une source tierce...',
        sourceAutofillHint:
            'Sélectionner une source pré-remplit les auteurs. Vous pouvez toujours les modifier ci-dessous.',
        sourceTitleLabel: {
            cauldron: 'Titre du produit Cauldron',
            homebrew: 'Titre / lieu de la création maison',
            default: 'Titre de la source',
        },
        sourceTitlePlaceholder: {
            cauldron: 'ex. Cauldron : Neon Debts',
            homebrew: 'ex. Blog personnel, doc de campagne...',
            default: 'Remplace le titre de la source sélectionnée',
        },
        pageLabel: 'Page',
        pagePlaceholder: '71',
        authorsLabel: 'Auteurs',
        addAuthorPlaceholder: 'Ajouter un auteur...',
        removeAuthorAriaLabel: 'Retirer {{author}}',
        metaHint:
            "Les métadonnées aident à l'attribution et à la recherche ; elles sont conservées à l'import comme à l'export.",
    },
    editorPanel: {
        emptyState: 'Cliquez sur la carte pour éditer une section précise.',
    },
    appearance: {
        autoHideEmptySections: 'Masquer automatiquement les sections vides',
        sectionsHeading: 'Sections',
        previewWidthLabel: "Largeur de l'aperçu",
        backgroundHeading: 'Arrière-plan',
        background: {
            neon: 'Néon',
            plain: 'Uni',
        },
        resetView: "Réinitialiser l'affichage",
    },
    imageExport: {
        scaleLabel: "Échelle de l'image",
    },
}

export default forms
