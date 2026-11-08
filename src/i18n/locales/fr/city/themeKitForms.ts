import type { ResourceShape } from '@/i18n/resourceShape'
import type en from '../../en/city/themeKitForms'

const forms: ResourceShape<typeof en> = {
    appearance: {
        columnsLabel: 'Colonnes',
        oneColumn: 'Une colonne',
        twoColumns: 'Deux colonnes',
    },
    stringList: {
        removeAriaLabel: 'Retirer {{entry}}',
        addPlaceholder: 'Ajouter...',
    },
    identity: {
        nameLabel: 'Nom du livret de thème',
        namePlaceholder: 'Personnalité',
        typeLabel: 'Type de thème',
        typeHelp:
            'Le type détermine le bandeau et le nom de la zone de motivation. En changer renomme la zone sans toucher à ce que vous y avez écrit.',
        keywordsLabel: 'Mots-clés',
        keywordPlaceholder: 'Ajouter un mot-clé...',
    },
    concept: {
        introductionLabel: 'Introduction',
        introductionPlaceholder:
            'Le paragraphe qui présente ce thème au joueur.',
        conceptLabel: 'Concept',
        conceptPlaceholder: 'Vous êtes qui vous êtes, et cela suffit.',
        extraTagsLabel: 'Traits bonus',
        extraTagPlaceholder: 'Ajouter un trait...',
        extraTagsHelp:
            'Les traits que le livret de thème distribue directement, sans question à laquelle répondre.',
        titleGuidanceLabel: 'Conseils pour le titre',
        titleGuidancePlaceholder:
            'Nommez la part de vous-même dont ce thème parle.',
    },
    motivation: {
        kindEither: 'Au choix du joueur',
        crewNote:
            "Un livret de thème d'équipe imprime ses relations d'équipe à la place d'une motivation : cette zone n'apparaîtra donc pas sur la page.",
        writtenAs: 'Forme',
        fixedKind:
            'Un livret de thème {{type}} écrit toujours cette zone sous la forme : {{zone}}.',
        introLabel: "Phrase d'introduction",
        introPlaceholder:
            'Quelle est la question que vous ne pouvez pas cesser de poser ?',
        introHelp:
            'La phrase que le livret de thème imprime au-dessus de la zone. Le Markdown en ligne est pris en charge.',
        examplesLabel: 'Exemples',
        examplePlaceholder: 'Ajouter un exemple...',
        optionsLabel: 'Liste fermée',
        optionPlaceholder: 'Ajouter une option...',
        optionsHelp:
            "Pour les livrets de thème qui proposent une liste à choisir au lieu d'une ligne vide.",
        ruleLabel: 'Règle',
        rulePlaceholder:
            "Quand vous répondez à ce Mystère, le thème s'efface et vous le perdez.",
        remove: 'Retirer la zone de motivation',
    },
    questions: {
        powerTitle: 'Questions de trait d’atout',
        powerPlaceholder:
            'Quelle est la seule chose que vous faites le mieux ?',
        weaknessTitle: 'Questions de trait de contrainte',
        weaknessPlaceholder: 'Que vous coûte cette même force ?',
        add: 'Ajouter une question',
        examplesLabel: 'Exemples',
        examplePlaceholder: 'Ajouter un exemple...',
        howManyLabel: 'Nombre de réponses',
        requiredLabel: 'Obligatoire',
        freeChoiceLabel: 'Au choix',
        noteLabel: 'Note',
        notePlaceholder:
            'Répondez à la première question, puis à deux autres de votre choix.',
    },
    improvements: {
        heading: 'Améliorations',
        countWarning:
            'Chaque livret de thème publié compte cinq améliorations ; celui-ci en compte {{count}}.',
        add: 'Ajouter une amélioration',
        rowLabel: 'Amélioration {{n}}',
        namePlaceholder: 'Seconde vue',
        effectLabel: 'Effet',
        effectPlaceholder:
            'Prenez un trait d’atout supplémentaire pour ce thème.',
    },
    crew: {
        heading: "Relations d'équipe",
        offPageNote:
            "Seul un livret de thème d'équipe les imprime : elles restent hors de la page tant que vous ne changez pas le type de thème.",
        add: 'Ajouter une relation',
        scenarioLabel: 'Scénario',
        outcomeLabel: "Ce qu'il fait à l'équipe",
        outcomeHelp: 'Aide',
        outcomeHurt: 'Nuit',
        outcomeEither: 'Au choix',
    },
}

export default forms
