import type { ResourceShape } from '@/i18n/resourceShape'
import type en from '../../en/legend/storyThemeForms'

const forms: ResourceShape<typeof en> = {
    basicForm: {
        titleTagLabel: 'Tag de titre',
        titleTagPlaceholder: 'Le village que j’ai laissé derrière moi',
        titleTagHint:
            'Le tag propre au thème, écrit sans accolades : la carte ajoute la mise en valeur.',
        levelLabel: 'Niveau',
        levels: {
            origin: {
                label: 'Origine',
                hint: 'D’où vient le héros',
            },
            adventure: {
                label: 'Aventure',
                hint: 'Ce que fait le héros aujourd’hui',
            },
            greatness: {
                label: 'Grandeur',
                hint: 'Ce que le héros peut devenir',
            },
        },
        categoryLabel: 'Catégorie',
        categoryOptional: '(optionnel)',
        categoryPlaceholder: 'Filiation, Mission, Destinée...',
    },
    tagsForm: {
        fieldLabel: {
            power: 'Tags de pouvoir',
            weakness: 'Tags de faiblesse',
        },
        bareHint: 'Écrivez les tags sans accolades.',
        tagLabel: 'Tag',
        placeholder: {
            power: 'connaît tous les visages du village',
            weakness: 'on l’attend encore là-bas',
        },
        emptyValueError: 'Veuillez saisir une valeur.',
        addTag: 'Ajouter un tag',
        finishEditingToReorder: 'Terminez l’édition pour réordonner',
    },
    questForm: {
        questLabel: 'Quête',
        questPlaceholder: 'Rentrer chez soi avec quelque chose à montrer.',
        questHint:
            'Ce vers quoi le thème pousse le héros. Le Markdown et les tags entre accolades sont rendus sur la carte.',
        improveLabel: 'Progression',
        abandonLabel: 'Abandon',
        milestoneLabel: 'Jalon',
        milestoneHint: 'Coché une fois que le thème a atteint son tournant.',
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
        pagePlaceholder: '142',
        authorsLabel: 'Auteurs',
        authorsPlaceholder: 'Ajouter un auteur...',
        removeAuthor: 'Retirer {{author}}',
        metaHint:
            'Les métadonnées aident à l’attribution et à la recherche ; elles sont conservées à l’import comme à l’export.',
    },
    appearance: {
        autoHideEmptySections: 'Masquer automatiquement les sections vides',
        sectionsLabel: 'Sections',
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
