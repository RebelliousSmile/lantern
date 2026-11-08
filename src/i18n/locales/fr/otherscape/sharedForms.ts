import type { ResourceShape } from '@/i18n/resourceShape'
import type en from '../../en/otherscape/sharedForms'

const forms: ResourceShape<typeof en> = {
    threats: {
        errorNameRequired: 'Le nom de la menace est requis.',
        errorDescriptionRequired: 'La description de la menace est requise.',
        errorConsequenceEmpty: 'La conséquence ne peut pas être vide.',
        descriptionLabel: 'Description courte',
        descriptionHint: '(Markdown + jetons)',
        descriptionPlaceholder: 'Ce que le {{noun}} commence à faire…',
        addThreat: 'Ajouter une menace',
        addConsequence: 'Ajouter une conséquence',
        back: 'Retour',
        consequencesFor: 'Conséquences de :',
        selectThreat: 'Sélectionnez une menace pour modifier ses conséquences',
        noDescription: 'Aucune description',
        consequencesTitle: 'Conséquences',
        editConsequencesAriaLabel: 'Modifier les conséquences',
        dragThreatAriaLabel: 'Glisser pour réordonner la menace',
        dragConsequenceAriaLabel: 'Glisser pour réordonner la conséquence',
        finishEditingToReorder: 'Terminez la modification pour réorganiser',
    },
}

export default forms
