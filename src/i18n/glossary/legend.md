# Glossaire français : Legend in the Mist

Validé par le mainteneur le 2026-09-18. Fixe les libellés de l’interface (formulaires, sections,
avertissements) ; l’aperçu, l’export PNG et le fichier TOML restent en anglais.

Aucun terme n’est une traduction officielle éditée : la mention « à confirmer (VF officielle ?) »
reste une note indiquant qu’une VF publiée existe peut-être et primerait le cas échéant, non une
question encore ouverte.

## Commun

| English term | French term | note |
| --- | --- | --- |
| Tag | tag | masc. (« un tag »). Décision transversale (2026-09-18) : les trois jeux du moteur Mist partagent ce terme. à confirmer (VF officielle ?) |
| Power tag | tag de pouvoir | masc. Pluriel « Tags de pouvoir ». à confirmer (VF officielle ?) |
| Weakness tag | tag de faiblesse | masc. à confirmer (VF officielle ?) |
| Status | statut | masc. à confirmer (VF officielle ?) |
| Limit | limite | fém. (« une limite immunisée »). à confirmer (VF officielle ?) |
| Consequence | conséquence | fém. à confirmer (VF officielle ?) |
| General consequences | Conséquences générales | fém. plur. Même libellé pour le Défi et le Voyage. |
| Hero | Héros | masc., invariable. Majuscule appliquée de façon inégale dans `legend.ts` (« un Héros » / « les héros »). à confirmer (VF officielle ?) |
| Narrator | Narrateur | masc. Apparaît dans l’aide du Voyage. à confirmer (VF officielle ?) |
| Theme | thème | masc. à confirmer (VF officielle ?) |
| Quest | quête | fém. à confirmer (VF officielle ?) |
| Improvement | amélioration | fém. Distinct de la jauge Improve du Thème d’histoire, qui garde « Progression » (décision transversale 2026-09-18). à confirmer (VF officielle ?) |
| Origin (niveau) | Origine | fém. Niveau commun à la Puissance du Défi et au niveau du Thème d’histoire. à confirmer (VF officielle ?) |
| Adventure (niveau) | Aventure | fém. à confirmer (VF officielle ?) |
| Greatness (niveau) | Grandeur | fém. à confirmer (VF officielle ?) |
| Track (rendu jauge) | jauge | fém. Réservé aux jauges Improve/Abandon du Thème d’histoire (décision transversale 2026-09-18 : « jauge » ne désigne plus que ceci). Les avertissements qui l’employaient pour l’affichage d’un tag comme statut ont été reformulés (voir `fr/legend.ts`). |
| Official (type de publication) | Officiel | Libellé d’option de la section méta. |
| Third Party | Tierce partie | fém. |
| Cauldron | Cauldron | Nom propre, laissé tel quel. À vérifier s’il existe un nom francisé. |
| Homebrew | Fait maison | |

## Challenge

| English term | French term | note |
| --- | --- | --- |
| Challenge | Défi | masc. (« Nouveau défi »). à confirmer (VF officielle ?) |
| Rating | Échelle | fém. Aucun choix provisoire dans `legend.ts` ; `otherscape.ts` parle déjà de « son échelle ». à confirmer (VF officielle ?) |
| Role | Rôle | masc. Les valeurs de rôle sont stockées en anglais dans le document et le TOML : traduire l’affichage seulement. à confirmer (VF officielle ?) |
| Aggressor | Agresseur | masc. à confirmer (VF officielle ?) |
| Charge | Protégé | masc. Celui qu’il faut protéger. à confirmer (VF officielle ?) |
| Countdown | Compte à rebours | masc. à confirmer (VF officielle ?) |
| Influence | Influence | fém. à confirmer (VF officielle ?) |
| Mystery | Mystère | masc. à confirmer (VF officielle ?) |
| Obstacle | Obstacle | masc. à confirmer (VF officielle ?) |
| Pursuer | Poursuivant | masc. à confirmer (VF officielle ?) |
| Quarry | Proie | fém. à confirmer (VF officielle ?) |
| Sapper | Sapeur | masc. à confirmer (VF officielle ?) |
| Support | Soutien | masc. à confirmer (VF officielle ?) |
| Watcher | Guetteur | masc. à confirmer (VF officielle ?) |
| Roles & description (section) | Rôles et description | Libellé de section. |
| Immune (limit) | immunisée | S’accorde avec « limite » (fém.). à confirmer (VF officielle ?) |
| Progress limit | limite de progression | fém. La clé `on_max` reste en anglais dans les messages. à confirmer (VF officielle ?) |
| Tags & statuses (section) | Tags et statuts | |
| Might | Puissance | fém. à confirmer (VF officielle ?) |
| Vulnerability | Vulnérabilité | fém. à confirmer (VF officielle ?) |
| Special features | Particularités | fém. plur. Aligné sur `otherscape.md` (Specials), décision transversale (2026-09-18). |
| Threat | Menace | fém. (« Nouvelle menace »). à confirmer (VF officielle ?) |

## Journey

| English term | French term | note |
| --- | --- | --- |
| Journey | Voyage | masc. (« Nouveau voyage »). Majuscule inégale dans `legend.ts` (« Ce Voyage » / « le voyage »). à confirmer (VF officielle ?) |
| Landscape | Paysage | masc. Type de voyage. à confirmer (VF officielle ?) |
| Occasion | Occasion | fém. à confirmer (VF officielle ?) |
| Undertaking | Entreprise | fém. à confirmer (VF officielle ?) |
| Benefits | Bénéfices | masc. plur. à confirmer (VF officielle ?) |
| Vignette | vignette | fém. à confirmer (VF officielle ?) |
| Trigger | Déclencheur | masc. Champ d’une vignette. à confirmer (VF officielle ?) |

## Story Theme

| English term | French term | note |
| --- | --- | --- |
| Story Theme | Thème d’histoire | masc. (« Nouveau thème d’histoire »). à confirmer (VF officielle ?) |
| Title tag | tag de titre | masc. Même forme que `otherscape.ts`. à confirmer (VF officielle ?) |
| Level | Niveau | masc. Valeurs : Origine, Aventure, Grandeur (voir Commun). |
| Category | Catégorie | fém. Même champ de données (`category`) que « Themebook » du Kit de thème, libellé différemment. |
| Quest & tracks (section) | Quête et jauges | Libellé de section. |
| Improve (jauge) | Progression | fém. Distinct d’Improvement (Kit de thème), qui garde « Amélioration » (décision transversale 2026-09-18). |
| Abandon (jauge) | Abandon | masc. à confirmer (VF officielle ?) |
| Milestone | Jalon | masc. à confirmer (VF officielle ?) |

## Theme Kit

| English term | French term | note |
| --- | --- | --- |
| Theme Kit | Kit de thème | masc. (« Nouveau kit de thème »). à confirmer (VF officielle ?) |
| Themebook | Livre de thèmes | masc. Terme unique pour tout le moteur Mist (décision transversale 2026-09-18) ; `city.ts` bascule depuis « livret de thème ». |
| Improvements | Améliorations | fém. plur. à confirmer (VF officielle ?) |
| Quest | Quête | fém. Voir Commun. |
