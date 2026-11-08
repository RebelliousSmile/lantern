import type { ResourceShape } from '@/i18n/resourceShape'
import type en from '../../en/city/customMoveForms'

const forms: ResourceShape<typeof en> = {
    trigger: {
        nameLabel: 'Nom de la manœuvre',
        namePlaceholder: 'p. ex. Ville en guerre',
        impactLabel: 'Impact (0-3)',
        kindLabel: 'Type',
        kindDanger: 'Danger',
        kindDangerHint: 'Appartient à un Danger et se déclenche quand il agit.',
        kindSituational: 'Situationnelle',
        kindSituationalHint:
            "Appartient à un lieu ou à une situation dans laquelle l'équipe s'engage.",
        kindImprovement: 'Amélioration',
        kindImprovementHint:
            "Appartient à un thème et s'acquiert comme amélioration.",
        triggerLabel: 'Déclencheur',
        triggerPlaceholder:
            'Quand vous passez une journée dans la ville en guerre,',
        triggerHelp:
            "Le Markdown est pris en charge. Un déclencheur se lit comme la première moitié d'une phrase que les résultats achèvent.",
        frequencyLabel: 'Fréquence',
        frequencyPlaceholder: 'p. ex. Une fois par jour passé en ville.',
        mcNoteLabel: 'Note de la MC',
        mcNotePlaceholder: 'Comment jouer la manœuvre à la table.',
    },
    roll: {
        empty: "Cette manœuvre n'appelle aucun jet : la carte imprime son résultat sans ligne de jet.",
        add: 'Ajouter un jet',
        remove: 'Retirer le jet',
        statLabel: 'Caractéristique',
        statPower: 'Pouvoir',
        statMythos: 'Mythos',
        statLogos: 'Logos',
        statCustom: 'Personnalisée',
        labelCustom: 'Ce qui est lancé',
        labelOverride: 'Libellé de remplacement',
        labelPlaceholder: 'p. ex. le rang du statut {en-guerre} de la ville',
        modifierLabel: 'Modificateur',
    },
    outcomes: {
        tierLabel: 'Palier',
        tierMiss: 'Échec',
        tier7to9: '7-9',
        tier10plus: '10+',
        tier12plus: '12+',
        tierHit: 'Réussite',
        textLabel: 'Texte',
        textPlaceholder: 'Décrivez ce qui se passe.',
        optionsLabel: 'Options, une par ligne',
        optionsPlaceholder:
            "Vous perdez quelque chose que vous portiez.\nQuelqu'un remarque où vous étiez.",
        pickCountLabel: 'Choisir combien',
        add: 'Ajouter un résultat',
        errorTextRequired: 'Le texte du résultat est obligatoire.',
        optionCount_one: '{{count}} option',
        optionCount_other: '{{count}} options',
    },
    templateGuide: {
        label: "Partir d'un patron de la Boîte à outils de la MC",
        generate: 'Générer le déclencheur et les résultats',
        overwriteHelp:
            'Remplace le déclencheur et les résultats par un texte modifiable.',
        activeShield: {
            name: 'Bouclier actif',
            summary: "Un statut qui se défend seul contre un type d'attaque.",
            statusLabel: 'Statut de bouclier',
            statusPlaceholder: 'p. ex. protégé',
            threatLabel: 'Contre quoi il protège',
            threatPlaceholder: 'p. ex. une attaque surnaturelle',
        },
        countdownOutcome: {
            name: 'Conséquence du compte à rebours',
            summary:
                "Une situation récurrente dont le coût grimpe à mesure qu'un statut monte de rang.",
            eventLabel: 'Ce que font les joueurs',
            eventPlaceholder:
                'p. ex. passer une journée dans la ville en guerre',
            statusLabel: 'Statut qui monte',
            statusPlaceholder: 'p. ex. en-guerre',
        },
        startingStatus: {
            name: 'Statut ou trait de départ',
            summary:
                'Une scène ou une situation qui distribue un statut avant tout jet.',
            situationLabel: "Quand il s'applique",
            situationPlaceholder: 'p. ex. vous entrez dans le quartier inondé',
            statusLabel: 'Statut distribué',
            statusPlaceholder: 'p. ex. trempé-2',
        },
        statusFilter: {
            name: 'Filtre de statut',
            summary:
                "Un statut qui change ce qu'une autre manœuvre a le droit de faire.",
            statusLabel: 'Statut qui filtre',
            statusPlaceholder: 'p. ex. invisible',
            effectLabel: "Ce qu'il bloque ou autorise",
            effectPlaceholder:
                'p. ex. personne ne peut vous cibler directement',
        },
        statusPayload: {
            name: 'Surcharge de statut',
            summary:
                "Un statut qui déclenche quelque chose dès qu'il atteint un rang donné.",
            statusLabel: 'Statut porteur de la charge',
            statusPlaceholder: 'p. ex. surchargé',
            payloadLabel: "Ce qu'il fait quand il se déclenche",
            payloadPlaceholder:
                'p. ex. il explose et touche tous ceux qui sont à proximité',
        },
    },
}

export default forms
