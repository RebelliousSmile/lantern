# Glossaire français : City of Mist

Validé par le mainteneur le 2026-09-18, aligné sur la VF officielle le 2026-11-08. Il fixe les
libellés de l'interface (formulaires, sections, options) ; les aperçus, les PNG exportés et le TOML
restent en anglais.

La colonne « terme français » est le choix retenu, utilisé par `src/i18n/locales/fr/city.ts` et
`src/i18n/locales/fr/city/*.ts`.

## Règle : la VF officielle prime

Règle du mainteneur (2026-11-08) : « S'il y a déjà une traduction française validée, ne la modifie
pas. » La traduction française officielle de _City of Mist_ est cette traduction validée : elle
l'emporte sur ce glossaire et sur les chaînes existantes. Là où la VF ne nomme pas un terme, le
choix propre de ce glossaire reste en place.

Sources (PDF de la VF, `Perso/RPG/city-of-mist/_sources/`), citées par leur sigle avec le nombre
d'occurrences relevé dans le texte extrait (`pdftotext`, recherche insensible à la casse, formes
au singulier et au pluriel) :

- **GdJ** : `cityofmist_vf_guidedujoueur_ebook_v11.pdf` (Guide du joueur).
- **BAO** : `cityofmist_vf_boiteoutilsmeneuse_ebook_v1.pdf` (Boîte à outils de la MC).

La mention « VF officielle (source, n) » marque un terme repris de la VF.

## Décisions transverses appliquées ici

- Tag = « trait » (masculin) : trait d'atout, trait de contrainte. Les accords qui en dépendent
  (Burnt, Invoked) restent au masculin.
- Themebook = « livret de thème ». Le nom du gabarit Theme Kit reste « Kit de thème » : la VF n'a
  aucun terme pour un gabarit d'édition (« kit de thème » : 0 occurrence dans GdJ et BAO), et le
  gabarit n'est pas l'objet du jeu qu'il édite.
- Theme card = « fiche de thème » (la VF n'emploie jamais « carte de thème »).
- Move = « manœuvre » (féminin). L'ancien « action » est remplacé partout où il désignait un Move.
- MC = « la MC » (féminin dans la VF) : « Note de la MC ».
- Danger prend la majuscule, comme dans la VF (« un Danger » 75, « un danger » 2 dans BAO).
- MC/GM : la règle « MJ partout » ne couvre que PbtA et Adrenaline ; City garde « MC », comme la VF.

## Commun

| English term                                                   | French term                                       | note                                                                                                                                                                            |
| -------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mythos                                                         | Mythos                                            | Masculin. VF officielle (GdJ, 507).                                                                                                                                             |
| Logos                                                          | Logos                                             | Masculin. VF officielle (GdJ, 174).                                                                                                                                             |
| Crew (theme type)                                              | Équipe                                            | Féminin : « thème d'équipe ». VF officielle (GdJ, « thème(s) d'équipe » 70).                                                                                                    |
| Extra (theme type)                                             | Extra                                             | Invariable. La VF ne nomme pas ce type de thème (0 occurrence dans GdJ et BAO) : choix propre conservé.                                                                         |
| Theme                                                          | Thème                                             | Masculin.                                                                                                                                                                       |
| Theme type                                                     | Type de thème                                     | VF officielle (GdJ, 30).                                                                                                                                                        |
| Tag                                                            | Trait                                             | Masculin. VF officielle (GdJ, 1 204). Remplace « tag » et « étiquette ».                                                                                                        |
| Power tag                                                      | Trait d'atout                                     | VF officielle (GdJ, 333).                                                                                                                                                       |
| Weakness tag                                                   | Trait de contrainte                               | VF officielle (GdJ, 208).                                                                                                                                                       |
| Story tag                                                      | Trait d'intrigue                                  | VF officielle (GdJ, 83 ; BAO, 38). Pas encore employé par l'interface.                                                                                                          |
| Tag question                                                   | Question de trait                                 | VF officielle (GdJ, 109).                                                                                                                                                       |
| Status                                                         | Statut                                            | Masculin. VF officielle (GdJ, 600 ; BAO, 469).                                                                                                                                  |
| Tier (of a status)                                             | Rang                                              | Masculin : « statut de rang 2 ». VF officielle (GdJ, « statut(s) de rang » 48). Remplace « niveau ». Voir aussi « Tier » côté Custom Move, sens différent (palier de résultat). |
| Move                                                           | Manœuvre                                          | Féminin. VF officielle (GdJ, 491 ; BAO, 477). Remplace « action ».                                                                                                              |
| Custom move                                                    | Manœuvre personnalisée                            | Féminin. VF officielle (BAO, 61).                                                                                                                                               |
| Improvement                                                    | Amélioration                                      | Féminin (« amélioration prise »). VF officielle (GdJ, 120).                                                                                                                     |
| Mystery                                                        | Mystère                                           | Masculin. Motivation d'un thème Mythos. VF officielle (GdJ, 186).                                                                                                               |
| Identity                                                       | Identité                                          | Féminin. Motivation d'un thème Logos. VF officielle (GdJ, 207).                                                                                                                 |
| Motivation                                                     | Motivation                                        | Féminin. VF officielle (GdJ, 15).                                                                                                                                               |
| MC                                                             | MC (la MC)                                        | Féminin dans la VF : « la MC » (GdJ, 446 ; « le MC », 1).                                                                                                                       |
| Publication type: Official / Third Party / Cauldron / Homebrew | Officiel / Tiers / Cauldron / Maison              | « Cauldron » est un nom propre, gardé. Le genre suit « type de publication » (masculin).                                                                                        |
| Layout                                                         | Disposition                                       | Danger ; validé le 2026-11-08                                                                                                                                                   |
| Columns (One column / Two columns)                             | Colonnes (Une colonne / Deux colonnes)            | Theme Kit ; le Danger dit « 1 colonne / 2 colonnes » ; validé le 2026-11-08                                                                                                     |
| Block height                                                   | Hauteur du bloc                                   | validé le 2026-11-08                                                                                                                                                            |
| Title placement (Outside / Inside)                             | Position du titre (À l'extérieur / À l'intérieur) | validé le 2026-11-08                                                                                                                                                            |
| Show separators                                                | Afficher les séparateurs                          | validé le 2026-11-08                                                                                                                                                            |
| Catalog source                                                 | Source du catalogue                               | validé le 2026-11-08                                                                                                                                                            |

## Danger

| English term                     | French term              | note                                                                                                                                                 |
| -------------------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Danger                           | Danger                   | Masculin, avec majuscule (« nouveau Danger »). VF officielle (BAO, 434).                                                                             |
| Level / rating (0-5)             | Rang                     | Masculin. VF officielle (BAO, « Rang de Danger » 5, « compris entre zéro et cinq »). Remplace « niveau ».                                            |
| Spectrum                         | Indicateur               | Masculin, pluriel « Indicateurs ». VF officielle (BAO, 162 : « Un indicateur est constitué d'un trait et d'un rang maximum »). Remplace « spectre ». |
| Maximum (of a spectrum)          | Rang maximum             | VF officielle (BAO, 6).                                                                                                                              |
| Immune                           | Immunisé                 | Accord avec « indicateur » : masculin. VF officielle (GdJ, 6 ; BAO, 5).                                                                              |
| Soft move                        | Manœuvre mineure         | VF officielle (BAO, « manœuvre(s) (de Danger) mineure(s) » 51).                                                                                      |
| Hard move                        | Manœuvre majeure         | VF officielle (BAO, « manœuvre(s) (de Danger) majeure(s) » 93).                                                                                      |
| Custom moves (section)           | Manœuvres personnalisées | VF officielle (BAO, 61). Même terme que le gabarit Custom Move.                                                                                      |
| Crew (in « threatens the crew ») | Équipe                   | Même terme que le type de thème.                                                                                                                     |
| Danger name                      | Nom du Danger            | validé le 2026-11-08 ; majuscule de la VF                                                                                                            |
| Spectrum name                    | Nom de l'indicateur      | validé le 2026-11-08 ; terme de la VF                                                                                                                |

## Custom Move

| English term                             | French term                                                | note                                                                                                                    |
| ---------------------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Custom Move (template)                   | Manœuvre personnalisée                                     | VF officielle (BAO, 61).                                                                                                |
| Trigger                                  | Déclencheur                                                | Masculin. La VF n'a pas de libellé fixe (BAO, 1) : choix propre conservé.                                               |
| Roll                                     | Jet                                                        | Masculin. VF officielle (GdJ, 215).                                                                                     |
| Stat (Power / Mythos / Logos / Custom)   | Caractéristique (Pouvoir / Mythos / Logos / Personnalisée) | « Pouvoir » : VF officielle (GdJ, 314). « Caractéristique » n'est pas un terme de jeu de la VF : choix propre conservé. |
| Modifier                                 | Modificateur                                               |                                                                                                                         |
| Outcome                                  | Résultat                                                   | Masculin.                                                                                                               |
| Tier (Miss / 7-9 / 10+ / 12+ / Hit)      | Palier                                                     | Ne pas confondre avec le rang d'un statut.                                                                              |
| Miss                                     | Échec                                                      | Masculin. La VF écrit « 6 ou moins » plutôt qu'un nom (GdJ : « Échec » 3) : choix propre conservé.                      |
| Hit                                      | Réussite                                                   | Féminin. VF officielle (GdJ, 91 ; « réussite mitigée / marquée »).                                                      |
| Kind: Danger / Situational / Improvement | Danger / Situationnelle / Amélioration                     | Accord avec « manœuvre » : féminin.                                                                                     |
| Impact (0-3)                             | Impact                                                     | Masculin. La VF n'en fait pas un terme de règle : choix propre conservé.                                                |
| Toolkit                                  | Boîte à outils de la MC                                    | VF officielle (titre de BAO ; GdJ, 4). Remplace « Toolkit ».                                                            |
| Active Shield                            | Bouclier actif                                             | VF officielle (BAO, 7).                                                                                                 |
| Countdown Outcome                        | Conséquence du compte à rebours                            | VF officielle (BAO, 1). Remplace « Compte à rebours ».                                                                  |
| Starting Status                          | Statut ou trait de départ                                  | VF officielle (BAO, 1). Remplace « Statut de départ ».                                                                  |
| Status Filter                            | Filtre de statut                                           | VF officielle (GdJ, 10 ; BAO, 6). Remplace « Statut filtre ».                                                           |
| Status Payload                           | Surcharge de statut                                        | VF officielle (BAO, 4). Remplace « Statut à retardement ».                                                              |
| Burn (a tag)                             | Dépenser                                                   | VF officielle (GdJ, « dépenser un trait » 45, « trait dépensé » 21). Remplace « brûler ».                               |
| Move name                                | Nom de la manœuvre                                         | validé le 2026-11-08 ; terme de la VF                                                                                   |
| Add a roll / Remove the roll             | Ajouter un jet / Retirer le jet                            | validé le 2026-11-08                                                                                                    |
| Choose how many (options of an outcome)  | Choisir combien                                            | validé le 2026-11-08                                                                                                    |
| Start from a Toolkit template            | Partir d'un patron de la Boîte à outils de la MC           | validé le 2026-11-08 ; titre de la VF                                                                                   |
| Generate trigger and outcomes            | Générer le déclencheur et les résultats                    | validé le 2026-11-08                                                                                                    |

## Theme Kit

| English term                             | French term                                                                 | note                                                                                                                                                 |
| ---------------------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Theme Kit (template)                     | Kit de thème                                                                | Nom du gabarit ; la VF n'a pas de terme (0 occurrence). Distinct du « livret de thème », l'objet du jeu qu'il édite.                                 |
| Themebook                                | Livret de thème                                                             | Masculin. VF officielle (GdJ, 86 ; « livre de thèmes » 0).                                                                                           |
| Concept                                  | Concept                                                                     | Masculin. VF officielle (GdJ, 84).                                                                                                                   |
| Keywords                                 | Mots-clés                                                                   |                                                                                                                                                      |
| Power tag questions                      | Questions de trait d'atout                                                  | VF officielle (GdJ, « question de trait d'atout »).                                                                                                  |
| Weakness tag questions                   | Questions de trait de contrainte                                            | VF officielle (GdJ, « question de trait de contrainte »).                                                                                            |
| Extra tags                               | Traits bonus                                                                | VF officielle (GdJ, 16 : rubrique « TRAIT BONUS » des livrets, là où la VO imprime « EXTRA TAG »). Ne pas confondre avec le type de thème « Extra ». |
| Required / Free choice                   | Obligatoire / Au choix                                                      | Règle de sélection des questions.                                                                                                                    |
| Title guidance                           | Conseils pour le titre                                                      | « titre » : VF officielle (GdJ, 49 ; rubrique « TITRE »).                                                                                            |
| Player's choice (motivation)             | Au choix du joueur                                                          |                                                                                                                                                      |
| Crew relationships                       | Relations d'équipe                                                          | Féminin pluriel. VF officielle (GdJ, 39).                                                                                                            |
| Helps / Hurts / Either                   | Aide / Nuit / Au choix                                                      | Relation d'équipe.                                                                                                                                   |
| Scenario                                 | Scénario                                                                    |                                                                                                                                                      |
| Effect (of an improvement)               | Effet                                                                       |                                                                                                                                                      |
| Themebook name                           | Nom du livret de thème                                                      | validé le 2026-11-08 ; terme de la VF                                                                                                                |
| Introduction                             | Introduction                                                                | validé le 2026-11-08                                                                                                                                 |
| Intro line                               | Phrase d'introduction                                                       | validé le 2026-11-08                                                                                                                                 |
| Written as (kind of the motivation zone) | Forme                                                                       | validé le 2026-11-08                                                                                                                                 |
| How many are answered                    | Nombre de réponses                                                          | validé le 2026-11-08                                                                                                                                 |
| Remove the motivation zone               | Retirer la zone de motivation                                               | validé le 2026-11-08                                                                                                                                 |
| What it does to the crew                 | Ce qu'il fait à l'équipe                                                    | validé le 2026-11-08                                                                                                                                 |
| Placeholders                             | Seconde vue ; Divination ; Personnalité ; La lecture que je ne peux arrêter | Exemples de saisie des formulaires (amélioration, livret de thème, titre de fiche) ; validé le 2026-11-08                                            |

## Theme Card

| English term           | French term    | note                                                                                                                                 |
| ---------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Theme Card             | Fiche de thème | Féminin. VF officielle (GdJ, 5 : « Fiche de thème (recto/verso) » ; « carte de thème » 0).                                           |
| Card title             | Titre          | VF officielle (GdJ, 49 ; rubrique « TITRE » de la fiche).                                                                            |
| Tracks                 | Jauges         | Féminin. VF officielle (GdJ, 9 : « Cette jauge mesure… »).                                                                           |
| Attention              | Attention      | Féminin. VF officielle (GdJ, 137).                                                                                                   |
| Fade                   | Déclin         | Masculin. Jauge d'érosion Mythos. VF officielle (GdJ, 58 : « cochez une case de Déclin »). Remplace « Effacement ».                  |
| Crack                  | Trauma         | Masculin. Jauge d'érosion Logos. VF officielle (GdJ, 64 : « case de Trauma sur l'un de vos thèmes de Logos »). Remplace « Fissure ». |
| Erosion (track)        | Érosion        | Féminin. VF officielle (GdJ, 2 : « Cette lente érosion est représentée par les pistes de Déclin ou de Trauma »).                     |
| Burnt (power tag)      | Dépensé        | Accord avec « trait », masculin. VF officielle (GdJ, « trait dépensé » 21). Remplace « brûlé ».                                      |
| Invoked (weakness tag) | Activé         | Accord avec « trait », masculin. VF officielle (GdJ, « activer un trait » 51). Remplace « invoqué ».                                 |
| Letter (of a tag)      | Lettre         | Renvoie à la question du livret de thème (A, B, C…).                                                                                 |
| Taken (improvement)    | Prise          | Accord avec « amélioration ».                                                                                                        |

## Choix naturels en attente de validation

Employés par l'interface sans figurer ci-dessus ; à valider avec le mainteneur.

| English term                                                                  | French term                                                       | note                                                                        |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Frequency (Custom Move)                                                       | Fréquence                                                         |                                                                             |
| MC note                                                                       | Note de la MC                                                     | Féminin de la VF (« la MC »).                                               |
| Stat: Power                                                                   | Pouvoir                                                           | Déjà au glossaire (Caractéristique), non validé comme libellé de sélecteur. |
| Kind / Stat: Custom / Situational                                             | Type / Personnalisée / Situationnelle                             | Accord féminin avec « manœuvre ».                                           |
| Erosion                                                                       | érosion                                                           | Reste dans les textes d'aide du formulaire de fiche.                        |
| Background colours                                                            | Crème, Papier, Ocre, Sable, Citron, Sauge, Argile (Rose inchangé) | Noms des pastilles d'arrière-plan.                                          |
| Use {{name}} background                                                       | Utiliser l'arrière-plan {{name}}                                  | Étiquette d'accessibilité des pastilles.                                    |
| (optional)                                                                    | (optionnel)                                                       | Même forme que l'interface Otherscape.                                      |
| Example placeholders (blessure, p. ex. Ville en guerre, La Salle rouge, etc.) | Exemples de saisie en français naturel                            | Réutilisent les termes du glossaire.                                        |
