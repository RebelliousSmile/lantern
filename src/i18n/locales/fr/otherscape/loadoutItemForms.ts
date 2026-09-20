import type { ResourceShape } from '@/i18n/resourceShape'
import type en from '../../en/otherscape/loadoutItemForms'

const forms: ResourceShape<typeof en> = {
    basic: {
        nameLabel: 'Nom',
        namePlaceholder: 'Kestrel Whisperlink',
        nameHelp:
            "Imprimé comme titre de la carte, et conservé comme premier tag d'atout : le catalogue ouvre la liste des tags avec le nom de la pièce, donc renommer la pièce réécrit aussi ce tag.",
        categoryLabel: 'Catégorie',
        categoryOptional: '(optionnelle)',
        categoryPlaceholder: 'Armes, Cybernétique, Drones...',
        categoryHelp:
            "La catégorie sous laquelle cette pièce est classée. Imprimée dans le bandeau d'en-tête ; laissée vide, le bandeau s'affiche quand même.",
        descriptionLabel: 'Description',
        descriptionOptional: '(optionnelle)',
        descriptionPlaceholder:
            "Ce qu'est la pièce, et ce que la porter dit de vous.",
        descriptionHelp:
            'Le Markdown et les tags entre accolades sont rendus. Laissez une ligne vide entre les paragraphes.',
    },
    meta: {
        publicationTypeLabel: 'Type de publication',
        typeOfficial: 'Officiel',
        typeThirdParty: 'Tiers',
        typeCauldron: 'Cauldron',
        typeHomebrew: 'Maison',
        sourceLabel: 'Source',
        sourceSearchPlaceholder: 'Rechercher une source...',
        sourceEmpty: 'Aucun résultat.',
        officialPlaceholder: 'Choisir un ouvrage officiel...',
        thirdPartyPlaceholder: 'Choisir une source tierce...',
        autofillHelp:
            'Choisir une source remplit automatiquement les auteurs. Vous pouvez toujours les modifier ci-dessous.',
        sourceTitleCauldronLabel: 'Titre du produit Cauldron',
        sourceTitleHomebrewLabel: 'Titre / lieu de la création maison',
        sourceTitleDefaultLabel: 'Titre de la source',
        sourceTitleOptional: '(optionnel)',
        sourceTitleCauldronPlaceholder: 'ex. Cauldron : Neon Debts',
        sourceTitleHomebrewPlaceholder:
            'ex. Blog personnel, document de campagne...',
        sourceTitleDefaultPlaceholder:
            'Remplacer le titre de la source sélectionnée',
        pageLabel: 'Page',
        pageOptional: '(optionnelle)',
        pagePlaceholder: '71',
        authorsLabel: 'Auteurs',
        authorsAddPlaceholder: 'Ajouter un auteur...',
        authorsInputPlaceholder: 'Ajoutez un auteur et appuyez sur Entrée',
        removeAuthor: 'Retirer {{author}}',
        footerHelp:
            "Les métadonnées aident à l'attribution et à la recherche, et sont conservées à l'import comme à l'export.",
    },
    tags: {
        weaknessLabel: 'Tag de faiblesse',
        weaknessOptional: '(optionnel)',
        weaknessPlaceholder: "répond encore au handshake d'usine",
        weaknessHelp:
            'Le seul tag que cette pièce retourne contre son porteur. Écrivez-le nu : la carte ajoute les accolades et le repère. Vider le champ laisse la pièce sans faiblesse, ce que font quelques entrées du catalogue.',
        featureTitle: "Tags d'atout",
        featureHint: 'Écrivez les tags nus, sans accolades.',
        catalogHint:
            'Le catalogue ouvre la liste avec le nom de la pièce, donc <bold>{{name}}</bold> occupe le premier emplacement et se modifie avec le nom lui-même. Ce qui suit est listé ici.',
        catalogHintFallbackName: 'le nom',
        tagLabel: 'Tag',
        tagPlaceholder: 'subvocal, personne ne vous entend parler',
        errorRequired: 'Veuillez saisir une valeur.',
        addTag: 'Ajouter un tag',
        finishEditingToReorder: 'Terminez la modification pour réorganiser',
    },
    appearance: {
        autoHideEmptyLabel: 'Masquer automatiquement les sections vides',
        sectionsTitle: 'Sections',
        previewWidthLabel: "Largeur de l'aperçu",
        backgroundTitle: 'Arrière-plan',
        backgroundNeon: 'Néon',
        backgroundPlain: 'Uni',
        resetView: "Réinitialiser l'affichage",
    },
    export: {
        imageScaleTitle: "Échelle de l'image",
    },
    editorPanel: {
        emptyState: 'Cliquez sur la carte pour modifier une section précise.',
    },
}

export default forms
