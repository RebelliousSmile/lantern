import type { ResourceShape } from '@/i18n/resourceShape'
import type en from '../../en/pbta/sharedForms'

const forms: ResourceShape<typeof en> = {
    keyPlaceholder: 'clé',
    labelPlaceholder: 'Libellé',
    optional: '(optionnel)',
    supportsMarkdown: 'Le Markdown est pris en charge.',
    remove: 'Retirer {{name}}',
    names: {
        attribute: 'attribut',
        entry: 'entrée',
        result: 'résultat',
        preset: 'horloge prédéfinie',
        choiceSet: 'jeu de choix',
        gear: 'équipement',
        stat: 'caractéristique',
        move: 'action',
    },
    appearance: {
        autoHideEmptySections: 'Masquer automatiquement les sections vides',
        showSeparators: 'Afficher les séparateurs',
        sectionsLabel: 'Sections',
        previewWidthLabel: "Largeur de l'aperçu",
        resetView: "Réinitialiser l'affichage",
    },
    panel: {
        emptyState: "Cliquez sur l'aperçu pour modifier une section précise.",
    },
    exportSettings: {
        imageScale: "Échelle de l'image",
    },
    list: {
        addTagPlaceholder: 'Ajouter un mot-clé et appuyer sur Entrée',
        addOptionPlaceholder: 'Ajouter une option et appuyer sur Entrée',
        addValuePlaceholder: 'Ajouter une valeur et appuyer sur Entrée',
    },
    attribute: {
        limited: 'Limité',
        resultsShown: 'Résultats affichés',
    },
}

export default forms
