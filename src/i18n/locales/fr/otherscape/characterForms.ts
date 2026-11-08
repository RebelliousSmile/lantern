import type { ResourceShape } from '@/i18n/resourceShape'
import type en from '../../en/otherscape/characterForms'

/* Les titres de zone (Mise à niveau, Combos de tags, Pouvoir, Loadout) ne sont pas ici : ils viennent
   de la présentation publiée du schéma. « Loadout » et « Theme » gardent leur nom anglais, comme les
   autres types de carte (voir `i18n/glossary/otherscape.md`). */
const forms: ResourceShape<typeof en> = {
    panel: {
        emptyState: 'Cliquez sur la fiche pour modifier une zone précise.',
    },
    basic: {
        nameLabel: 'Nom du personnage',
        namePlaceholder: 'Vesper Quill',
        nameHelp: 'Imprimé en haut de la fiche.',
    },
    upgrades: {
        readOnly:
            'La règle de Mise à niveau est imprimée de la même façon sur chaque fiche. Elle ne fait pas partie du fichier : il n’y a rien à modifier ici.',
    },
    combos: {
        itemTitle: 'Combo de tags {{position}} sur {{count}}',
        labelLabel: 'Nom',
        labelPlaceholder: 'Démasquer un menteur',
        tagsLabel: 'Tags',
        tagsPlaceholder: 'Ajoutez un tag puis Entrée',
        tagsHelp: 'Écrivez les tags à nu, sans accolades.',
        removeTagAriaLabel: 'Retirer {{tag}}',
        powerLabel: 'Pouvoir',
        effectLabel: 'Effet',
        effectPlaceholder:
            'Ce que fait le combo quand tous ses tags sont en jeu.',
        incomplete:
            'Un combo demande un nom, un effet et au moins un tag. Tant qu’il manque l’un des trois, il reste sur la fiche mais n’est pas écrit dans le fichier exporté.',
        removeButton: 'Retirer ce combo',
        addButton: 'Ajouter un combo de tags',
        notFound: 'Ce combo de tags n’existe plus.',
    },
    loadout: {
        hint: 'Le loadout que porte le personnage. Cochez « Chargé » pour ce qu’il a sur lui ; les autres sont estompés sur la fiche.',
        nameLabel: 'Nom',
        namePlaceholder: 'Matraque électrique',
        featureTagsLabel: 'Tags d’atout',
        featureTagsPlaceholder: 'Ajoutez un tag puis Entrée',
        weaknessTagLabel: 'Tag de faiblesse',
        weaknessTagPlaceholder: 'doit être rechargée',
        loadedHelp:
            'Décoché, l’objet est estompé sur la fiche. Un fichier qui ne dit jamais si l’objet est chargé le reste tant que vous ne cochez ni ne décochez la case.',
        loadedAriaLabel: 'Chargé : {{name}}',
        addButton: 'Ajouter un objet de loadout',
        removeAriaLabel: 'Retirer {{name}}',
        moveUpAriaLabel: 'Monter {{name}}',
        moveDownAriaLabel: 'Descendre {{name}}',
        expandAriaLabel: 'Modifier {{name}}',
        collapseAriaLabel: 'Fermer {{name}}',
        empty: 'Aucun objet de loadout pour l’instant.',
    },
    themes: {
        hint: 'Un personnage porte jusqu’à quatre Themes. Cliquez sur une carte de la fiche pour modifier ses champs.',
        itemTitle: 'Theme {{position}}',
        addButton: 'Ajouter un Theme',
        addType: {
            self: 'Ajouter un thème du Soi',
            mythos: 'Ajouter un thème de Mythos',
            noise: 'Ajouter un thème de Bruit',
        },
        limitReached:
            'Un personnage porte au plus quatre Themes. Retirez-en un pour en ajouter un autre.',
        removeButton: 'Retirer ce Theme',
        removeAriaLabel: 'Retirer {{title}}',
        moveUpAriaLabel: 'Monter {{title}}',
        moveDownAriaLabel: 'Descendre {{title}}',
        editAriaLabel: 'Modifier {{title}}',
        empty: 'Aucun Theme pour l’instant.',
        notFound: 'Ce Theme n’existe plus.',
    },
    appearance: {
        autoHideEmptySections: 'Masquer automatiquement les sections vides',
        sectionsLabel: 'Sections',
        previewWidthLabel: 'Largeur de l’aperçu',
        backgroundLabel: 'Arrière-plan',
        resetView: 'Réinitialiser l’affichage',
        background: {
            neon: 'Néon',
            plain: 'Sobre',
        },
    },
    exportSettings: {
        imageScale: 'Échelle de l’image',
    },
}

export default forms
