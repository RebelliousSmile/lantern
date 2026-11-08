import type { ResourceShape } from '@/i18n/resourceShape'
import type en from '../../en/city/themeCardForms'

const forms: ResourceShape<typeof en> = {
    identity: {
        themebookLabel: 'Livret de thème',
        themebookPlaceholder: 'Divination',
        titleLabel: 'Titre',
        titlePlaceholder: 'La lecture que je ne peux arrêter',
        typeLabel: 'Type de thème',
        typeHelp:
            "Changer le type met à jour les libellés de la motivation et de l'érosion sans réinitialiser leur texte ni leur progression.",
    },
    motivation: {
        placeholderMythos: 'Qui répond toujours quand je demande ?',
        placeholderOther: 'Je suis celui qui reste.',
    },
    tracks: {
        help: 'Les valeurs restent comprises entre 0 et le maximum imprimé.',
    },
    tags: {
        powerHeading: 'Traits d’atout',
        weaknessHeading: 'Traits de contrainte',
        lettersHelp: 'Les lettres sont optionnelles pour les traits maison.',
        add: 'Ajouter un trait',
        playHelp:
            'En cours de partie, un trait d’atout supplémentaire peut exister un temps avant que le trait de contrainte correspondant soit ajouté.',
        letterLabel: 'Lettre',
        tagLabel: 'Trait',
        burnt: 'Dépensé',
        invoked: 'Activé',
    },
    improvements: {
        heading: 'Améliorations',
        add: 'Ajouter une amélioration',
        effectLabel: 'Effet',
        taken: 'Prise',
    },
}

export default forms
