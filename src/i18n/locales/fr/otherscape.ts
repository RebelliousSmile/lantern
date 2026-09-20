import type { ResourceShape } from '@/i18n/resourceShape'
import type en from '../en/otherscape'
import challengeForms from './otherscape/challengeForms'
import characterTropeForms from './otherscape/characterTropeForms'
import loadoutItemForms from './otherscape/loadoutItemForms'
import powerSetForms from './otherscape/powerSetForms'
import themeForms from './otherscape/themeForms'
import themeKitForms from './otherscape/themeKitForms'

/* Game terms are provisional until the French glossary is validated. */
const otherscape: ResourceShape<typeof en> = {
    warnings: {
        invalidTokens:
            'Certains marqueurs ne sont reconnus ni comme {!weakness}, ni comme {status-<n>}, ni comme {tag} : {{tokens}}.',
        titleRepeated:
            'Le tag de titre est répété dans les Tags de pouvoir : {{title}}. La carte l’imprime déjà comme titre, il apparaîtrait donc deux fois.',
        power: {
            braced: 'Tags de pouvoir écrits avec des accolades : {{tags}}. Elles sont ajoutées au rendu de la carte, les accolades apparaîtront donc en double.',
            marked: 'Tags de pouvoir écrits avec un « ! » initial : {{tags}}. Un tag qui joue contre le personnage a sa place dans les Tags de faiblesse.',
            statusLike:
                'Tags de pouvoir qui se lisent comme un statut ou une limite : {{tags}}. Un « -<n> » ou « :<n> » final fait afficher le tag comme un statut plutôt que comme un tag.',
        },
        weakness: {
            braced: 'Tags de faiblesse écrits avec des accolades : {{tags}}. Elles sont ajoutées au rendu de la carte, les accolades apparaîtront donc en double.',
            marked: 'Tags de faiblesse écrits avec un « ! » initial : {{tags}}. Les tags de faiblesse sont déjà signalés par le champ où ils se trouvent.',
            statusLike:
                'Tags de faiblesse qui se lisent comme un statut ou une limite : {{tags}}. Un « -<n> » ou « :<n> » final fait afficher le tag comme un statut plutôt que comme un tag.',
        },
    },
    challenge: {
        label: 'Défi',
        newTitle: 'Nouveau défi',
        description:
            'Un Défi est tout ce que l’Équipe doit surmonter : son échelle, les tags et statuts qu’il porte, les Limites qui l’arrêtent, les Spéciaux par lesquels il enfreint les règles et les Menaces qu’il oppose. Partez d’une fiche vierge, ouvrez l’exemple ou importez un fichier TOML.',
        exportToml: 'Exporter les données du défi en TOML.',
        exportPng: 'Exporter l’aperçu du défi en PNG.',
        sections: {
            description: 'Description',
            tagsStatuses: 'Tags et statuts',
            limits: 'Limites',
            specials: 'Particularités',
            threats: 'Menaces',
            generalConsequences: 'Conséquences générales',
            meta: 'Pied de page méta',
        },
        warnings: {
            limitTokens:
                'Des marqueurs de type limite figurent dans Tags et statuts et seront ignorés par certains outils : {{tokens}}. Envisagez de les déplacer dans la section Limites.',
            progressWithoutOnMax:
                'Limite(s) de progression sans « on_max » : {{limits}}. La limite se remplit et rien n’est imprimé pour elle.',
            polarWithoutSlash:
                'Limite(s) polaire(s) sans « / » dans leur nom : {{limits}}. Une Limite polaire relie ses deux pôles par une barre oblique, comme dans « catch/outrun ».',
            onMaxWithoutProgress:
                'Limite(s) portant un résultat « on_max » sans être une limite de progression : {{limits}}. Ce résultat ne sera jamais atteint.',
            noLimits:
                'Ce Défi n’a aucune Limite : rien d’imprimé ne permet de le surmonter.',
        },
    },
    characterTrope: {
        label: 'Archétype de personnage',
        newTitle: 'Nouvel archétype de personnage',
        description:
            'Un Archétype de personnage est un personnage prêt à l’emploi : les kits de thème qu’il accorde, ceux entre lesquels il propose de choisir, et l’équipement avec lequel il commence. Partez d’une fiche vierge, ouvrez l’exemple ou importez un fichier TOML.',
        exportToml:
            'Exporter les données de l’archétype de personnage en TOML.',
        exportPng: 'Exporter l’aperçu de l’archétype de personnage en PNG.',
        sections: {
            description: 'Description',
            themeKits: 'Kits de thème',
            choices: 'Choix',
            loadout: 'Équipement',
            meta: 'Pied de page méta',
        },
        warnings: {
            grantsNothing:
                'Cet Archétype de personnage n’accorde aucun kit de thème et n’en propose aucun à choisir : il ne donne rien sur quoi bâtir.',
            singleChoice:
                'Une seule entrée figure dans Choix : il n’y a donc rien entre quoi choisir. Déplacez-la vers les kits de thème accordés, ou ajoutez les options avec lesquelles elle doit être en concurrence.',
            grantedAndOffered:
                'Certains kits de thème sont à la fois accordés et proposés au choix : {{kits}}.',
        },
    },
    loadoutItem: {
        label: 'Pièce d’équipement',
        newTitle: 'Nouvelle pièce d’équipement',
        description:
            'Une Pièce d’équipement est une entrée du Street Catalog : son nom, la catégorie où elle est classée, le texte que le catalogue imprime, les tags qu’elle accorde et l’unique tag qu’elle retourne contre son porteur. Partez d’une fiche vierge, ouvrez l’exemple ou importez un fichier TOML.',
        exportToml: 'Exporter les données de la pièce d’équipement en TOML.',
        exportPng: 'Exporter la carte de la pièce d’équipement en PNG.',
        sections: {
            description: 'Description',
            featureTags: 'Tags d’atout',
            weaknessTag: 'Tag de faiblesse',
            meta: 'Pied de page méta',
        },
        warnings: {
            feature: {
                braced: 'Tags d’atout écrits avec des accolades : {{tags}}. Elles sont ajoutées au rendu de la carte, les accolades apparaîtront donc en double.',
                marked: 'Tags d’atout écrits avec un « ! » initial : {{tags}}. Un tag qui joue contre son porteur a sa place dans le tag de faiblesse.',
                statusLike:
                    'Tags d’atout qui se lisent comme un statut ou une limite : {{tags}}. Un « -<n> » ou « :<n> » final fait afficher le tag comme un statut plutôt que comme un tag.',
            },
            weakness: {
                braced: 'Tag de faiblesse écrit avec des accolades : {{tags}}. Elles sont ajoutées au rendu de la carte, les accolades apparaîtront donc en double.',
                marked: 'Tag de faiblesse écrit avec un « ! » initial : {{tags}}. Le tag de faiblesse est déjà signalé par le champ où il se trouve.',
                statusLike:
                    'Tag de faiblesse qui se lit comme un statut ou une limite : {{tags}}. Un « -<n> » ou « :<n> » final fait afficher le tag comme un statut plutôt que comme un tag.',
            },
            noTags: 'Cette Pièce d’équipement n’accorde aucun tag : il n’y a rien à invoquer avec elle.',
            firstTagNotName:
                'Le premier tag d’atout est « {{firstTag}} » et non le nom de la pièce, « {{name}} ». Le Street Catalog ouvre la liste sur le nom, et la carte imprime le reste de la liste en dessous.',
        },
    },
    powerSet: {
        label: 'Ensemble de pouvoirs',
        newTitle: 'Nouvel ensemble de pouvoirs',
        description:
            'Un Ensemble de pouvoirs regroupe des Spéciaux, des Menaces et des Conséquences tirés du Soi, du Mythos ou du Bruit, publié à part et greffé sur n’importe quel Défi. Partez d’une fiche vierge, ouvrez l’exemple ou importez un fichier TOML.',
        exportToml: 'Exporter les données de l’ensemble de pouvoirs en TOML.',
        exportPng: 'Exporter l’aperçu de l’ensemble de pouvoirs en PNG.',
        sections: {
            description: 'Description',
            specials: 'Particularités',
            threats: 'Menaces',
            generalConsequences: 'Conséquences générales',
            meta: 'Pied de page méta',
        },
        warnings: {
            grantsNothing:
                'Cet Ensemble de pouvoirs n’accorde ni Spéciaux ni Menaces : le greffer sur un Défi ne change rien.',
        },
    },
    theme: {
        label: 'Thème',
        newTitle: 'Nouveau thème',
        description:
            'Un Thème est une carte qu’un personnage a faite sienne : un tag de titre, le type de thème auquel il appartient, ses tags de pouvoir et de faiblesse, la quête qu’il fixe, et les jauges d’Évolution et de Déclin qui mesurent jusqu’où il a été joué. Partez d’une fiche vierge, ouvrez l’exemple ou importez un fichier TOML.',
        exportToml: 'Exporter les données du thème en TOML.',
        exportPng: 'Exporter la carte du thème en PNG.',
        sections: {
            powerTags: 'Tags de pouvoir',
            weaknessTags: 'Tags de faiblesse',
            quest: 'Quête',
            tracks: 'Jauges',
            meta: 'Pied de page méta',
        },
        warnings: {
            noTags: 'Ce Thème ne porte aucun tag : il n’y a rien à invoquer avec lui.',
        },
    },
    themeKit: {
        label: 'Kit de thème',
        newTitle: 'Nouveau kit de thème',
        description:
            'Un Kit de thème est la carte qu’un livre de thèmes propose à un personnage : un tag de titre, le type de thème auquel il appartient, les tags de pouvoir et de faiblesse qu’il suggère, et la quête qu’il fixe. Partez d’une fiche vierge, ouvrez l’exemple ou importez un fichier TOML.',
        exportToml: 'Exporter les données du kit de thème en TOML.',
        exportPng: 'Exporter la carte du kit de thème en PNG.',
        sections: {
            powerTags: 'Tags de pouvoir',
            weaknessTags: 'Tags de faiblesse',
            quest: 'Quête',
            meta: 'Pied de page méta',
        },
        warnings: {
            noTags: 'Ce Kit de thème ne suggère aucun tag : un personnage n’a rien parmi quoi choisir.',
        },
    },
    /* One file per template, so each template's form strings can change on their own. */
    forms: {
        challenge: challengeForms,
        characterTrope: characterTropeForms,
        loadoutItem: loadoutItemForms,
        powerSet: powerSetForms,
        theme: themeForms,
        themeKit: themeKitForms,
    },
}

export default otherscape
