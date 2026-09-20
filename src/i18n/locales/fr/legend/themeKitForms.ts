import type { ResourceShape } from '@/i18n/resourceShape'
import type en from '../../en/legend/themeKitForms'

const forms: ResourceShape<typeof en> = {
    editorPanel: {
        emptyState: 'Cliquez sur la carte pour modifier une section précise.',
    },
    shared: {
        optional: '(optionnel)',
        finishEditingToReorder: 'Terminez la modification pour réorganiser',
    },
    basic: {
        nameLabel: 'Nom du kit',
        namePlaceholder: 'La Sorcière des haies',
        nameHint:
            'Un libellé imprimé, pas un tag : écrivez-le sans accolades.',
        categoryLabel: 'Livre de thèmes',
        categoryPlaceholder: 'Personnalité, Expertise, Entraînement...',
        categoryHint:
            'Imprimé dans la barre d’en-tête. Laissée vide, la barre s’affiche quand même.',
    },
    quest: {
        label: 'Quête',
        placeholder: 'Soigner quelqu’un que le village a déjà abandonné.',
        hint: 'La quête que suggère le kit. Un héros se l’approprie en remplissant le kit. Markdown et tags entre accolades sont rendus sur la carte.',
    },
    tags: {
        power: { fieldLabel: 'Tags de pouvoir' },
        weakness: { fieldLabel: 'Tags de faiblesse' },
        hint: 'Écrivez les tags sans accolades.',
        tagLabel: 'Tag',
        tagPlaceholder: 'sait quelles racines mordent en retour',
        errorRequired: 'Veuillez saisir une valeur.',
        addButton: 'Ajouter un tag',
    },
    improvements: {
        heading: 'Améliorations',
        subheading: 'Les options que propose ce kit.',
        nameLabel: 'Nom',
        namePlaceholder: 'Double vue',
        effectLabel: 'Effet',
        effectPlaceholder: 'Ce que l’amélioration permet au héros de faire.',
        errorNameRequired: 'Une amélioration doit avoir un nom.',
        noEffectWritten: 'aucun effet écrit',
        addButton: 'Ajouter une amélioration',
    },
    meta: {
        publicationTypeLabel: 'Type de publication',
        types: {
            official: 'Officiel',
            thirdParty: 'Tierce partie',
            cauldron: 'Cauldron',
            homebrew: 'Fait maison',
        },
        sourceLabel: 'Source',
        sourceHint:
            'Choisir une source remplit automatiquement les auteurs. Vous pouvez toujours les modifier ci-dessous.',
        sourcePlaceholderOfficial: 'Sélectionnez un ouvrage officiel...',
        sourcePlaceholderThirdParty: 'Sélectionnez une source tierce...',
        searchSourcePlaceholder: 'Rechercher une source...',
        noMatch: 'Aucun résultat.',
        sourceTitleLabel: {
            cauldron: 'Titre du produit Cauldron',
            homebrew: 'Titre / origine du contenu fait maison',
            default: 'Titre de la source',
        },
        sourceTitlePlaceholder: {
            cauldron: 'p. ex. Cauldron : Ombres dans la Saumure',
            homebrew: 'p. ex. blog personnel, document de campagne...',
            default: 'Remplacer le titre de la source sélectionnée',
        },
        pageLabel: 'Page',
        pagePlaceholder: '142',
        authorsLabel: 'Auteurs',
        authorsAddPlaceholder: 'Ajouter un auteur...',
        authorsInputDefaultPlaceholder:
            'Ajoutez un auteur et appuyez sur Entrée',
        removeAuthorAria: 'Supprimer {{author}}',
        hint: 'Les métadonnées aident à l’attribution et à la recherche, et sont conservées à l’import comme à l’export.',
    },
    appearance: {
        autoHideEmptySections: 'Masquer automatiquement les sections vides',
        sectionsHeading: 'Sections',
        previewWidthLabel: 'Largeur de l’aperçu',
        backgroundHeading: 'Arrière-plan',
        backgroundParchment: 'Parchemin',
        backgroundPlain: 'Uni',
        resetView: 'Réinitialiser l’affichage',
    },
    exportSettings: {
        imageScaleHeading: 'Échelle de l’image',
    },
}

export default forms
