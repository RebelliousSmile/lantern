import type { ResourceShape } from '@/i18n/resourceShape'
import type en from '../../en/pbta/gameDefinitionForms'

const forms: ResourceShape<typeof en> = {
    attributes: {
        defaultLabel: 'Par défaut',
        maxLabel: 'Max',
        defaultValuePlaceholder: 'Valeur par défaut',
        checkboxLabelPlaceholder: 'Libellé de la case (optionnel)',
        defaultRollPlaceholder: 'Formule de jet par défaut',
        descriptionPlaceholder: 'Description (optionnel)',
        defaultChecked: 'Cochée par défaut',
        sortAlphabetically: 'Trier par ordre alphabétique',
        condition: 'État',
        showResults: 'Afficher les résultats',
        column: 'Colonne',
        auto: 'Auto',
        top: 'Haut',
        left: 'Gauche',
        add: 'Ajouter un attribut',
    },
    clockPresets: {
        moveUp: 'Monter {{name}}',
        moveDown: 'Descendre {{name}}',
        segmentPlaceholder:
            "Ajouter le libellé d'un segment et appuyer sur Entrée",
        add: 'Ajouter une horloge prédéfinie',
    },
    rollResults: {
        rangePlaceholder: 'Plage',
    },
    labels: {
        moveTypes: "Types d'action",
        attributes: 'Attributs',
        equipmentTypes: "Types d'équipement",
        stats: 'Caractéristiques',
        statToggle: 'Bascule de caractéristique',
    },
    placeholders: {
        moveTypeLabel: "Libellé du type d'action",
        equipmentTypeLabel: "Libellé du type d'équipement",
        statLabel: 'Libellé de la caractéristique',
    },
    importedNote:
        'Importé depuis un TOML : retirer la section ici ne la supprimera pas du fichier exporté. Videz plutôt les champs ci-dessus.',
    sectionBlocked:
        "Ce document a été importé depuis un TOML : l'export réapplique le fichier d'origine sur tout champ que ce formulaire laisse vide, donc la section {{section}} reviendrait. Videz plutôt chaque champ ci-dessus.",
    basic: {
        name: 'Nom du jeu',
        game: 'Identifiant du jeu',
        version: 'Version',
        namePlaceholder: 'p. ex. Apocalypse Keys',
        gamePlaceholder: 'p. ex. apocalypse-keys',
        versionPlaceholder: 'p. ex. 0.1.0',
        sourcePlaceholder: 'Ouvrage ou source maison',
        source: 'Source',
        versionHint:
            'La version suit cette définition, pas le jeu : incrémentez-la chaque fois que les caractéristiques, attributs ou vocabulaires ci-dessous changent.',
    },
    statToggle: {
        none: 'Aucune',
        stat: 'Clé de caractéristique',
        custom: 'Personnalisée',
        statPlaceholder:
            'Clé de la caractéristique que cette bascule échange, p. ex. cool',
        modifierPlaceholder: 'Mod.',
    },
    roll: {
        formula: 'Formule de jet',
        formulaPlaceholder: 'p. ex. 2d6',
        minMod: 'Modificateur min.',
        maxMod: 'Modificateur max.',
        results: 'Résultats du jet',
    },
    fronts: {
        empty: "Cette définition n'a pas de contenu pour les fronts. Ajoutez-en pour donner aux fronts leurs propres types de menace, pulsions et horloges prédéfinies.",
        add: 'Ajouter une section Fronts',
        remove: 'Retirer la section Fronts',
        threatTypes: 'Types de menace',
        impulses: 'Pulsions',
        clockPresets: 'Horloges prédéfinies',
        threatTypePlaceholder: 'Libellé du type de menace',
        impulsePlaceholder: 'Libellé de la pulsion',
    },
    sectionNames: {
        fronts: 'Fronts',
        mc: 'MC',
        npc: 'PNJ',
    },
    mc: {
        empty: "Cette définition n'a pas de contenu pour le MC. Ajoutez-en pour donner au MC ses propres types d'action.",
        add: 'Ajouter une section MC',
        remove: 'Retirer la section MC',
    },
    npc: {
        empty: "Cette définition n'a pas de contenu pour les PNJ. Ajoutez-en pour donner aux PNJ leurs propres attributs et types d'action.",
        add: 'Ajouter une section PNJ',
        remove: 'Retirer la section PNJ',
    },
}

export default forms
