import type { ResourceShape } from '@/i18n/resourceShape'
import type en from '../en/legend'
import challengeForms from './legend/challengeForms'
import journeyForms from './legend/journeyForms'
import storyThemeForms from './legend/storyThemeForms'
import themeKitForms from './legend/themeKitForms'

/* Game terms are provisional until the French glossary is validated. */
const legend: ResourceShape<typeof en> = {
    challenge: {
        label: 'Défi',
        newTitle: 'Nouveau défi',
        exportToml: 'Exporter les données du défi en TOML.',
        exportPng: 'Exporter l’aperçu du défi en PNG.',
        sections: {
            rolesDesc: 'Rôles et description',
            limits: 'Limites',
            tagsStatuses: 'Tags et statuts',
            might: 'Puissance',
            specialFeatures: 'Particularités',
            threats: 'Menaces',
            generalConsequences: 'Conséquences générales',
            meta: 'Pied de page méta',
        },
        warnings: {
            unknownRoles: 'Rôle(s) inconnu(s) : {{roles}}.',
            unrecognizedTokens:
                'Certains marqueurs ne sont reconnus ni comme {!weakness}, ni comme {status-<n>}, ni comme {tag} : {{tokens}}.',
            limitTokens:
                'Des marqueurs de type limite figurent dans Tags et statuts et seront ignorés par certains outils : {{tokens}}. Envisagez de les déplacer dans la section Limites.',
            progressWithoutOnMax:
                'Limite(s) de progression sans « on_max » : {{limits}}.',
        },
    },
    journey: {
        label: 'Voyage',
        newTitle: 'Nouveau voyage',
        description:
            'Un Voyage est le passage de l’histoire entre deux lieux : une route traversée, une occasion vécue ou une entreprise menée à bien. Il porte les tags qu’il offre, ce que les héros gagnent à le mener à bien, ce qu’il peut coûter à chaque étape, et les vignettes qui le découpent. Partez d’une fiche vierge, ouvrez l’exemple ou importez un fichier TOML.',
        exportToml: 'Exporter les données du voyage en TOML.',
        exportPng: 'Exporter la double page du voyage en PNG.',
        sections: {
            description: 'Description',
            tags: 'Tags',
            benefits: 'Bénéfices',
            consequences: 'Conséquences générales',
            vignettes: 'Vignettes',
            meta: 'Pied de page méta',
        },
        warnings: {
            bracedTags:
                'Tags écrits avec des accolades : {{tags}}. Elles sont ajoutées au rendu de la fiche, les accolades apparaîtront donc en double.',
            statusLikeTags:
                'Tags qui se lisent comme un statut ou une limite : {{tags}}. Un « -<n> » ou « :<n> » final fait afficher le tag comme un indicateur plutôt que comme un tag. Un statut infligé par le Voyage a sa place dans ses Conséquences.',
            unnamedVignette: 'une vignette sans nom',
            vignettesWithoutConsequence:
                'Vignettes sans Conséquence : {{vignettes}}. Une vignette en porte au moins une, et le fichier ne pourra pas être exporté tant que chacune d’elles n’en aura pas.',
            noConsequence:
                'Ce Voyage ne coûte rien, nulle part : aucune Conséquence générale et aucune vignette d’où en tirer une.',
            noTags: 'Ce Voyage n’offre aucun tag : un Héros n’a rien à invoquer en le traversant.',
        },
    },
    storyTheme: {
        label: 'Thème d’histoire',
        newTitle: 'Nouveau thème d’histoire',
        exportToml: 'Exporter les données du thème d’histoire en TOML.',
        exportPng: 'Exporter l’aperçu du thème d’histoire en PNG.',
        sections: {
            category: 'Catégorie',
            powerTags: 'Tags de pouvoir',
            weaknessTags: 'Tags de faiblesse',
            quest: 'Quête et jauges',
            meta: 'Pied de page méta',
        },
        warnings: {
            power: {
                braced: 'Tags de pouvoir écrits avec des accolades : {{tags}}. Elles sont ajoutées au rendu de la carte, les accolades apparaîtront donc en double.',
                marked: 'Tags de pouvoir écrits avec un « ! » initial : {{tags}}. Un tag qui joue contre le Héros a sa place dans les Tags de faiblesse.',
                statusLike:
                    'Tags de pouvoir qui se lisent comme un statut ou une limite : {{tags}}. Un « -<n> » ou « :<n> » final fait afficher le tag comme un indicateur plutôt que comme un tag.',
            },
            weakness: {
                braced: 'Tags de faiblesse écrits avec des accolades : {{tags}}. Elles sont ajoutées au rendu de la carte, les accolades apparaîtront donc en double.',
                marked: 'Tags de faiblesse écrits avec un « ! » initial : {{tags}}. Les tags de faiblesse sont déjà signalés par le champ où ils se trouvent.',
                statusLike:
                    'Tags de faiblesse qui se lisent comme un statut ou une limite : {{tags}}. Un « -<n> » ou « :<n> » final fait afficher le tag comme un indicateur plutôt que comme un tag.',
            },
            noTags: 'Ce Thème d’histoire n’accorde aucun tag : un Héros n’a rien à invoquer.',
        },
    },
    themeKit: {
        label: 'Kit de thème',
        newTitle: 'Nouveau kit de thème',
        description:
            'Un Kit de thème est la carte qu’un livre de thèmes propose à un Héros : un nom, les tags de pouvoir et de faiblesse qu’il suggère, la quête qu’il désigne et les améliorations qu’il ouvre. Partez d’une fiche vierge, ouvrez l’exemple ou importez un fichier TOML.',
        exportToml: 'Exporter les données du kit de thème en TOML.',
        exportPng: 'Exporter la carte du kit de thème en PNG.',
        sections: {
            powerTags: 'Tags de pouvoir',
            weaknessTags: 'Tags de faiblesse',
            quest: 'Quête',
            improvements: 'Améliorations',
            meta: 'Pied de page méta',
        },
        warnings: {
            power: {
                braced: 'Tags de pouvoir écrits avec des accolades : {{tags}}. Elles sont ajoutées au rendu de la carte, les accolades apparaîtront donc en double.',
                marked: 'Tags de pouvoir écrits avec un « ! » initial : {{tags}}. Un tag qui joue contre le Héros a sa place dans les Tags de faiblesse.',
                statusLike:
                    'Tags de pouvoir qui se lisent comme un statut ou une limite : {{tags}}. Un « -<n> » ou « :<n> » final fait afficher le tag comme un indicateur plutôt que comme un tag.',
            },
            weakness: {
                braced: 'Tags de faiblesse écrits avec des accolades : {{tags}}. Elles sont ajoutées au rendu de la carte, les accolades apparaîtront donc en double.',
                marked: 'Tags de faiblesse écrits avec un « ! » initial : {{tags}}. Les tags de faiblesse sont déjà signalés par le champ où ils se trouvent.',
                statusLike:
                    'Tags de faiblesse qui se lisent comme un statut ou une limite : {{tags}}. Un « -<n> » ou « :<n> » final fait afficher le tag comme un indicateur plutôt que comme un tag.',
            },
            noTags: 'Ce Kit de thème ne suggère aucun tag : un Héros n’a rien parmi quoi choisir.',
            improvementsWithoutEffect:
                'Améliorations nommées sans effet : {{improvements}}. La carte n’imprime que l’intitulé, ce qui n’est juste que si le livre de thèmes n’en dit pas plus.',
        },
    },
    /* One file per template, so each template's form strings can change on their own. */
    forms: {
        challenge: challengeForms,
        journey: journeyForms,
        storyTheme: storyThemeForms,
        themeKit: themeKitForms,
    },
}

export default legend
