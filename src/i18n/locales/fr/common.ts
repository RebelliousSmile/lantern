import type { ResourceShape } from '@/i18n/resourceShape'
import type en from '../en/common'

const common: ResourceShape<typeof en> = {
    language: {
        choose: 'Choisir la langue',
    },
    sidebar: {
        logoAlt: 'Logo de Lantern',
        tagline: 'Éditeur de modèles',
        gamePacks: 'Jeux',
        chooseGamePacks: 'Choisir les jeux',
        showThesePacks: 'Afficher ces jeux',
        comingSoon: 'Bientôt',
        allPacksHidden:
            'Tous les jeux sont masqués. Réaffichez-en un avec le réglage ci-dessus.',
        feedback: 'Retours',
        credit: 'Créé par 4rtamis',
    },
    topBar: {
        noOpenTabs: 'Aucun onglet ouvert',
        closeTab: "Fermer l'onglet",
        closeTitle: 'Voulez-vous vraiment fermer cet onglet ?',
        closeDescription:
            'Cette action est irréversible. <strong>{{title}}</strong> sera définitivement supprimé.',
        thisTab: 'cet onglet',
        dontShowAgain: 'Ne plus afficher ce message',
        cancel: 'Annuler',
        continue: 'Continuer',
    },
    emptyState: {
        title: 'Bienvenue dans Lantern',
        intro: 'Transformez des notes brutes en fiches prêtes à jouer, puis emportez-les ailleurs : un fichier structuré pour d’autres outils, une image pour la table.',
        steps: {
            pack: {
                title: 'Choisir un jeu',
                body: 'Les jeux sont dans la barre latérale gauche. Le réglage à côté de Jeux masque ceux que votre table ne pratique pas, pour garder la liste courte.',
            },
            template: {
                title: 'Ouvrir un modèle',
                body: 'Choisir un modèle ouvre un onglet. Partez de l’exemple, d’une fiche vierge, ou importez un fichier .toml existant.',
            },
            edit: {
                title: 'Modifier depuis la fiche',
                body: 'Pas de formulaire à parcourir : cliquez sur une zone de la fiche et ses champs s’ouvrent dans l’inspecteur à droite.',
            },
            export: {
                title: 'Exporter',
                body: 'Le panneau Export produit un .toml lisible par d’autres outils, ou un .png à l’échelle choisie pour les aides de jeu et l’impression.',
            },
        },
        localOnly:
            'Tout reste dans ce navigateur, sans compte ni envoi. Effacer les données du site efface votre travail : exportez ce que vous voulez garder.',
        copyright:
            'Contient du matériel sous copyright Son of Oak Game Studio LLC et d’autres auteurs, réservé aux tests de jeu personnels.',
    },
    unavailable: {
        title: 'Modèle pas encore disponible',
        body: 'Ce modèle figure dans la barre latérale mais n’est pas encore implémenté.',
    },
    editing: {
        showSidebar: 'Afficher le panneau d’édition',
        hideSidebar: 'Masquer le panneau d’édition',
        toggleSidebar: 'Afficher ou masquer le panneau d’édition',
    },
    inspector: {
        editor: 'Éditeur',
        appearance: 'Apparence générale',
        export: 'Export',
    },
    landing: {
        chooseStart:
            'Choisissez comment démarrer ce modèle : fiche vierge, exemple ou import TOML.',
        startExample: 'Partir de l’exemple',
        startBlank: 'Partir d’une fiche vierge',
        importToml: 'Importer un TOML',
    },
    import: {
        title: 'Importer : {{label}}',
        templateFallback: 'Modèle',
        description:
            'Importez depuis un fichier <code>.toml</code> ou en collant du TOML.',
        fileTab: 'Fichier',
        pasteTab: 'Coller',
        trustedTitle: 'N’importez que des sources de confiance',
        trustedFile:
            'Un fichier importé peut contenir du contenu malveillant. N’ouvrez que du TOML de créateurs de confiance.',
        trustedPaste:
            'Du TOML collé peut contenir du contenu malveillant. Ne collez que du contenu de créateurs de confiance.',
        selectFile: 'Choisir un fichier .toml',
        chooseFile: 'Choisir un fichier…',
        validateHint: 'Le fichier est validé avant l’import.',
        importFile: 'Importer le fichier',
        pasteLabel: 'Coller du TOML',
        autoValidate: 'Validation automatique pendant la saisie ou le collage.',
        importPasted: 'Importer le TOML collé',
        noPreview:
            'Pas encore d’aperçu. Choisissez un fichier ou collez du TOML.',
        document: 'Document :',
        warnings_one: '{{count}} avertissement',
        warnings_other: '{{count}} avertissements',
        validated: 'TOML validé.',
        imported: 'Importé.',
        importedNamed: '« {{name}} » importé.',
        importedWithWarnings_one: 'Importé avec {{count}} avertissement.',
        importedWithWarnings_other: 'Importé avec {{count}} avertissements.',
        unavailable: 'L’import n’est pas disponible pour ce modèle.',
    },
    export: {
        openTemplate: 'Ouvrez un modèle implémenté pour l’exporter.',
        copyToml: 'Copier le TOML',
        exportToml: 'Exporter le TOML',
        toml: 'TOML',
        hide: 'Masquer',
        generatedToml: 'TOML généré',
        exportAction: 'Exporter : {{label}}',
        copied: 'TOML copié.',
        copyFailed:
            'Impossible de copier le TOML. Sélectionnez le texte ci-dessous et copiez-le à la main.',
        previewNotFound:
            'Aperçu introuvable. Vérifiez que l’aperçu est affiché.',
        exportedPng: 'PNG exporté.',
        exportedToml: 'TOML exporté.',
        png: 'PNG',
        exportPng: 'Exporter le PNG',
    },
    feedback: {
        title: 'Envoyer un retour sur Discord',
        description:
            'Contactez <strong>@4rtamis</strong> sur le serveur Discord de City of Mist pour envoyer un retour sur l’application.',
        mostUseful:
            'Faute de tutoriel pour l’instant, les retours les plus utiles portent sur ce qui a paru intuitif, ce qui ne l’a pas été, et là où l’application manquait de clarté.',
        noSmartphone:
            'Les retours sur smartphone ne sont pas utiles pour l’instant : aucune vue adaptée aux petits écrans n’a encore été développée.',
        contextTitle: 'Joignez ce contexte à votre retour',
        contextHint:
            'Copiez-collez ce bloc pour que le rapport contienne les informations sur le navigateur et l’application.',
        copyContext: 'Copier le contexte',
        copied: 'Contexte copié.',
        copyFailed: 'Impossible de copier le contexte.',
        close: 'Fermer',
        joinDiscord: 'Rejoindre Discord',
    },
    actions: {
        add: 'Ajouter',
        remove: 'Retirer',
        edit: 'Modifier',
        delete: 'Supprimer',
        cancel: 'Annuler',
        save: 'Enregistrer',
        done: 'Terminé',
        dragToReorder: 'Glisser pour réordonner',
        moveUp: 'Monter',
        moveDown: 'Descendre',
        addItem: 'Ajouter un élément',
        removeItem: 'Retirer l’élément',
        moveItemUp: 'Monter l’élément',
        moveItemDown: 'Descendre l’élément',
    },
    fields: {
        name: 'Nom',
        description: 'Description',
        title: 'Titre',
        notes: 'Notes',
    },
    errors: {
        tomlSyntax:
            'Erreur de syntaxe TOML, ligne {{line}}, colonne {{column}}',
        importFailed: 'Échec de l’import.',
        invalidToml: 'TOML invalide.',
        parseFailed: 'Échec de la lecture ou de la validation du TOML.',
        readFailed: 'Impossible de lire le fichier.',
        exportFailed: 'Échec de l’export.',
        generateTomlFailed: 'Échec de la génération du TOML.',
        exportPngFailed: 'Échec de l’export PNG.',
        exportTomlFailed: 'Échec de l’export TOML.',
    },
}

export default common
