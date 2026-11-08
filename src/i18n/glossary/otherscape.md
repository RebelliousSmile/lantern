# Glossaire français : :Otherscape

Validé par le mainteneur le 2026-09-18. Fixe les libellés de l'interface (formulaires, sections,
options) ; les aperçus, les PNG exportés et le TOML restent en anglais.

**Types de carte gardés en anglais (2026-11-08).** Challenge, Character Trope, Loadout Item, Power Set,
Theme et Theme Kit gardent leur nom anglais dans l'interface française, tant que la traduction
officielle de Barbus Inc et Antre Monde n'est pas publiée. Mainteneur : « pour les éléments technique
principaux, il vaut mieux garder les termes originaux pour le moment, sinon on va cliquer sur un élément
en pensant en avoir un autre. » Les sous-termes (tags, limites, menaces, particularités, quête…) restent
en français, comme « type de thème » et « thème du Soi », qui désignent la notion de jeu et non la carte.
Legend in the Mist et City of Mist ne sont pas concernés.

## Commun

| English term | French term | note |
| --- | --- | --- |
| Tag | Tag | Masculin (« tag brûlé »). Décision transversale (2026-09-18) : les trois jeux du moteur Mist partagent ce terme, City of Mist bascule depuis « Étiquette ». |
| Power tag | Tag de pouvoir | Identique dans `legend.ts` et `otherscape.ts` (Theme, Theme Kit, avertissements). Ne pas confondre avec « Tag d'atout », qui traduit *Feature tag* (voir Loadout Item). |
| Weakness tag | Tag de faiblesse | Identique dans `legend.ts`. |
| Title tag | Tag de titre | Masculin. Tag imprimé comme titre du Thème ou du Kit, et nom des kits cités par un Character Trope. |
| Status | Statut | Masculin. |
| Crew | Équipe | Féminin. Même choix que `city.md` et que la description provisoire du Défi (« l'Équipe »). Sert aussi de type de thème. |
| Self | Soi | Masculin (« le Soi »). Décision de jeu (2026-09-18) : traduit partout, y compris les options de formulaire (auparavant « Self » en dur). |
| Mythos | Mythos | Masculin, invariable. Gardé comme nom propre, aligné sur `city.md`. |
| Noise | Bruit | Masculin (« le Bruit »). Décision de jeu (2026-09-18) : traduit partout, y compris les options de formulaire (auparavant « Noise » en dur). Les valeurs stockées dans le document restent `noise` en anglais ; seul le libellé affiché change. |
| Theme type (Self / Mythos / Noise / Crew) | Type de thème (Soi / Mythos / Bruit / Équipe) | Masculin. « thème du Soi », « thème de Bruit », « thème d'Équipe » accordent mieux qu'un adjectif direct. |
| Character | Personnage | Masculin. `legend.ts` dit « Héros » pour son propre jeu ; ne pas l'importer ici. |
| Scale | Échelle | Féminin. Absent de `otherscape.ts` (libellé en dur dans le formulaire). |
| Publication type: Official / Third Party / Cauldron / Homebrew | Officiel / Tiers / Cauldron / Maison | Aligné sur `city.md`. « Cauldron » est un nom propre. Accord avec « type de publication » (masculin). |

## Challenge

| English term | French term | note |
| --- | --- | --- |
| Challenge | Challenge | Masculin (« nouveau Challenge »). Gardé en anglais (2026-11-08) ; `legend.ts` garde « Défi ». |
| Tags & Statuses | Tags et statuts | Identique dans `legend.ts`. |
| Limit | Limite | Féminin (« limite polaire »). Identique dans `legend.ts`. |
| Level (of a limit, 1-6) | Niveau | Masculin. |
| Polar limit | Limite polaire | Relie deux pôles par une barre oblique (« catch/outrun » reste en anglais dans l'avertissement, c'est un exemple de donnée). |
| Progress limit | Limite de progression | |
| on_max (outcome of a progress limit) | Au maximum | Le fichier provisoire garde la clé TOML « on_max » entre guillemets ; un libellé d'interface pourrait dire « Effet au maximum ». |
| Specials | Particularités | Décision transversale (2026-09-18) : même terme que *Special features* de Legend in the Mist (féminin). Remplace l'ancien « Spéciaux ». |
| Threat | Menace | Féminin. Identique dans `legend.ts`. |
| Consequence | Conséquence | Féminin. |
| General Consequences | Conséquences générales | Identique dans `legend.ts`. |

## Power Set

| English term | French term | note |
| --- | --- | --- |
| Power Set | Power Set | Masculin. Gardé en anglais (2026-11-08). |
| Type (Self / Mythos / Noise) | Type (Soi / Mythos / Bruit) | Voir Commun : même décision que le type de thème. Le formulaire affiche le libellé traduit ; la valeur stockée dans le document et le libellé imprimé sur la carte (aperçu) restent en anglais (Self/Mythos/Noise). |
| Specials / Threats / General Consequences | Particularités / Menaces / Conséquences générales | Mêmes termes que le Défi, sur lequel l'ensemble se greffe : les garder alignés. |

## Theme / Theme Kit

| English term | French term | note |
| --- | --- | --- |
| Theme | Theme | Masculin, pour la carte. Gardé en anglais (2026-11-08) ; la notion de jeu reste « thème » (« type de thème », « thème du Soi »). |
| Theme Kit | Theme Kit | Masculin. Gardé en anglais (2026-11-08) ; `legend.ts` garde « Kit de thème ». |
| Themebook | Livre de thèmes | Décision transversale (2026-09-18) : terme unique pour tout le moteur Mist, City of Mist bascule depuis « Livret de thème ». |
| Category (of a theme) | Catégorie | Féminin. Valeurs libres (« Street Trade », « Augmented ») laissées à l'auteur. |
| Quest | Quête | Féminin. Titre de section ; le champ lui-même prend le libellé propre au type ci-dessous. |
| Identity (Self quest) | Identité | Féminin. Même terme que `city.md` pour Logos. |
| Ritual (Mythos quest) | Rituel | Masculin. |
| Itch (Noise quest) | Démangeaison | Féminin. Calque littéral assumé, faute de meilleure option courte. |
| Motivation (Crew quest) | Motivation | Féminin. Aligné sur `city.md`. |
| Tracks | Jauges | Féminin. Décision transversale (2026-09-18) : « jauge » ne désigne plus que ceci dans l'interface. Les avertissements qui employaient « jauge » pour une limite de progression ou pour un tag affiché « comme une jauge » sont reformulés (voir `fr/otherscape.ts`). |
| Upgrade (track) | Évolution | Féminin. Décision transversale (2026-09-18) : « Amélioration » reste réservé à *Improvement* (Legend in the Mist, City of Mist) ; Otherscape emploie « Évolution » pour ne pas entrer en collision. |
| Decay (track) | Déclin | Masculin. |

## Loadout Item

| English term | French term | note |
| --- | --- | --- |
| Loadout Item | Loadout Item | Masculin (« nouveau Loadout Item »). Gardé en anglais (2026-11-08). |
| Loadout | Loadout | Masculin. Même racine que Loadout Item, gardée alignée. |
| Feature tag | Tag d'atout | Masculin. Seul endroit où apparaît « atout » ; ce n'est pas la traduction de *Power tag*. |
| Weakness tag (singular) | Tag de faiblesse | Une pièce n'en porte qu'un : section au singulier. |
| Category (of an item) | Catégorie | Féminin. Terme unifié (2026-09-18) : l'ancien « Rubrique » de la description provisoire est remplacé par « Catégorie », aligné sur le Thème et le Character Trope. |
| Street Catalog | Street Catalog | Nom d'un supplément, gardé tel quel. |

## Character Trope

| English term | French term | note |
| --- | --- | --- |
| Character Trope | Character Trope | Masculin. Gardé en anglais (2026-11-08). |
| Category (of a trope) | Catégorie | Féminin. Valeurs libres (« Mystics & Mediums ») laissées à l'auteur. |
| Theme kits granted | Theme Kits accordés | Accord masculin pluriel. |
| Theme kit choices | Choix de Theme Kits | Section « Choix » dans le fichier provisoire. |
| Loadout | Loadout | Même terme que Loadout Item. Une entrée de la trope est une « entrée de loadout », pas un Loadout Item. |

## Fiche de personnage

La fiche n'est pas une carte à nom anglais protégé : le terme de jeu est « personnage ». Les titres de zone
(Mise à niveau, Combos de tags, Pouvoir) viennent de la présentation publiée du schéma et ne se retraduisent pas ici.

| English term | French term | note |
| --- | --- | --- |
| Character (sheet) | Fiche de personnage | Féminin. Titre du modèle ; le nom du personnage lui-même reste « personnage » (voir Commun). |
| Upgrades | Mise à niveau | Féminin. Libellé imprimé de la zone, lu dans le schéma publié. Distinct de « Évolution », qui traduit *Upgrade (track)* d'un Theme. |
| Tag combo | Combo de tags | Masculin. Libellé imprimé de la zone, lu dans le schéma publié. |
| Power (of a combo) | Pouvoir | Masculin. Nombre ajouté par le combo. |
| Loadout | Loadout | Masculin. Gardé en anglais, comme Loadout Item. |
| Loaded | Chargé | Case d'un objet de loadout que le personnage a sur lui ; un objet non chargé est estompé sur la fiche. |
| Feature tag | Tag d'atout | Même terme que pour un Loadout Item. |
| Themes (of a character) | Themes | Les cartes de la fiche sont des Theme, nom gardé en anglais. L'interface écrit « Theme 2 » pour une position ; « thème du Soi » désigne le type, pas la carte. |
