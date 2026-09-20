# Glossaire français — famille PbtA (brouillon)

Ce glossaire est un brouillon que le mainteneur valide avant toute traduction définitive ; il ne concerne que l’interface (éditeur, panneau d’apparence, accueil), car les aperçus, les PNG et le TOML restent en anglais.

Conventions :

- « VF officielle ? » signale un terme pour lequel une édition française existe peut-être : ses choix n’ont pas été vérifiés, rien ici n’est présenté comme officiel.
- « actuel » renvoie au choix provisoire de `src/i18n/locales/fr/pbta.ts`.
- Le genre (m./f.) est indiqué quand il commande un accord dans l’interface (« Nouvelle … », « … courante », « aucun/aucune … »).
- Les noms de caractéristiques (Hot, Charm, Blood…) sont des données du document, saisies par l’utilisateur et exportées telles quelles ; ils figurent ici pour mémoire, pas comme libellés à traduire.

## PbtA (tronc commun : Livret et Définition de jeu)

| English term | French term | note |
| --- | --- | --- |
| Playbook | Livret (m.) | Actuel. Alternative : garder « Playbook » (m.), très répandu chez les joueurs francophones. À confirmer (VF officielle ?). La description actuelle dit « un type de personnage d’Apocalypse World » : exact pour le livret générique, mais le même libellé sert à Masks, MotW, The Sprawl et Urban Shadows. |
| Game Definition | Définition de jeu (f.) | Actuel. Terme propre à Lantern, pas un terme de jeu publié : pas de VF à attendre. Accord : « Nouvelle définition de jeu », « courante ». |
| Move | Action (f.) | Actuel. Alternative : « Manœuvre » (f.). « Action » est l’usage le plus courant dans les traductions PbtA, mais reste à confirmer (VF officielle ?) jeu par jeu. Accord : « Nouvelle action ». |
| Basic move | Action de base (f.) | À confirmer (VF officielle ?). |
| Starting moves | Actions de départ | Suit le choix fait pour Move. |
| Move type | Type d’action (m.) | Clé de la Définition de jeu (basic, playbook, peripheral…). |
| Trigger | Déclencheur (m.) | Placeholder « Trigger, e.g. you act despite danger ». |
| Stat | Caractéristique (f.) | Actuel. Alternative : « Carac » en abrégé ; « Stat » est courant à l’oral mais peu élégant. |
| Stat profile / Starting stat profile | Profil de caractéristiques / Profil de départ (m.) | Collection `statProfiles`. |
| Stat toggle | Bascule de caractéristique (f.) | Libellé technique de l’éditeur ; alternative « Caractéristique au choix ». |
| Roll | Jet (m.) | Actuel. |
| Roll formula | Formule de jet (f.) | |
| Roll results | Résultats du jet | |
| Strong hit (10+) | Réussite totale (f.) | À confirmer (VF officielle ?). Alternative : « Succès complet ». |
| Weak hit (7-9) | Réussite partielle (f.) | À confirmer (VF officielle ?). Alternative : « Succès mitigé ». |
| Miss (6-) | Échec (m.) | |
| Choice Sets | Jeux de choix | Actuel, mais calque de l’anglais. Alternatives : « Listes de choix », « Choix à la création ». À trancher. |
| Advancement | Progression (f.) | Actuel. Alternative : « Avancement » (m.). Voir la collision avec l’en-tête éditorial « Progression » (Monsterhearts). |
| Advance | Avancée (f.) | Actuel (Monsterhearts). Alternative : « Amélioration » ; garder ce mot pour Improvement (MotW) évite l’ambiguïté. |
| Creation | Création (f.) | Actuel. |
| Gear | Équipement (m.) | Actuel. |
| Equipment type | Type d’équipement (m.) | Clé de la Définition de jeu. |
| Look | Apparence (f.) | À confirmer (VF officielle ?). Alternative : « Allure », « Look ». Apparaît dans les exemples, pas dans les libellés. |
| Harm | Blessures (f. pl.) | Actuel (Monsterhearts, Urban Shadows). Alternative : « Dégâts » (m. pl.). À confirmer (VF officielle ?). |
| Armor | Armure (f.) | |
| Hx / History, Bond | Hx / Historique (m.), Lien (m.) | Absents de l’interface actuelle ; pour mémoire. À confirmer (VF officielle ?). |
| Attribute | Attribut (m.) | Dictionnaire d’attributs de la Définition de jeu. Les types (Number, Text, Clock, Track…) sont des clés techniques : ne pas les traduire dans le TOML, seulement dans les libellés. |
| Clock / Clock presets | Horloge (f.) / Horloges prédéfinies | « Horloge » est l’usage courant ; à confirmer (VF officielle ?). |
| Track | Piste (f.) | Alternative : « Jauge » (f.). |
| Character | Personnage (m.) | Actuel. |
| NPC | PNJ (m.) | Actuel. |
| MC | MC (m.) | Actuel. Alternative : « MJ ». Le sigle anglais est souvent conservé dans les VF PbtA ; à confirmer (VF officielle ?). |
| Front | Front (m.) | Actuel (« Fronts »). |
| Threat / Threat type | Menace (f.) / Type de menace (m.) | |
| Impulse | Pulsion (f.) | À confirmer (VF officielle ?). Alternative : « Impulsion ». |
| Tags (de move / d’équipement) | Étiquettes (f. pl.) ou Mots-clés (m. pl.) | Collision : « Étiquettes » sert déjà aux tags Mist (`city.ts`) et à Labels (Masks). Proposer « Mots-clés » ici. |
| Editorial (Opening, Advice, Identity, Progression) | Éditorial (m.) : Ouverture, Conseils, Identité, Progression | Actuel pour « Éditorial ». Les en-têtes sont des données du document (`heading`), imprimées en anglais. |
| For the MC | Pour le MC | Idem, donnée ; suit le choix MC/MJ. |

## Masks

| English term | French term | note |
| --- | --- | --- |
| Labels | Étiquettes (f. pl.) | Actuel (section `stats` de Masks). À confirmer (VF officielle ?). Collision avec les tags Mist et les tags PbtA ; alternative : « Rôles » ou garder « Labels ». |
| Danger, Freak, Savior, Superior, Mundane | Danger, Monstre, Sauveur, Supérieur, Banal | Noms de Labels, donnée du document. À confirmer (VF officielle ?). |
| Conditions | États (m. pl.) | Absent de la section Masks actuelle ; aligner sur Monsterhearts. À confirmer (VF officielle ?). |
| Influence | Influence (f.) | Collection `influence`. |
| Potential | Potentiel (m.) | Champ `potential`. |
| Moment of Truth | Moment de vérité (m.) | Actuel. |
| Team | Équipe (f.) | Absent de l’interface actuelle ; pour mémoire. |

## Monster of the Week

| English term | French term | note |
| --- | --- | --- |
| Playbook (Hunter’s) | Livret (m.) | Même clé que le tronc commun. |
| Hunter | Chasseur, chasseuse | Apparaît dans le nom par défaut (« Untitled Hunter », donnée). À confirmer (VF officielle ?). |
| Improvements | Améliorations (f. pl.) | Actuel. |
| Luck | Chance (f.) | Champ `luck`. À confirmer (VF officielle ?). |
| Ratings | Valeurs (f. pl.) | Champ `ratings` ; alternative : « Profils ». |
| Charm, Cool, Sharp, Tough, Weird | Charme, Calme, Vivacité, Dur, Étrange | Données du document. « Weird » a plusieurs rendus plausibles (« Étrange », « Bizarre », « Surnaturel »). À confirmer (VF officielle ?). |

## Monsterhearts

| English term | French term | note |
| --- | --- | --- |
| Skin | Peau (f.) | Actuel. Accord : « Nouvelle peau ». À confirmer (VF officielle ?). Alternative : garder « Skin ». |
| Strings | Ficelles (f. pl.) | Actuel. Alternative : « Emprises » ; à confirmer (VF officielle ?). |
| Conditions | États (m. pl.) | Actuel. Alternative : « Conditions ». |
| Darkest Self | Moi le plus sombre (m.) | À confirmer (VF officielle ?). Alternative : « Part d’ombre » (f.). Donnée d’en-tête éditorial. |
| Sex Move | Action sexuelle (f.) | À confirmer (VF officielle ?). Alternative : « Action d’intimité ». Suit le choix fait pour Move. |
| Ascendants | Ascendants (m. pl.) | Collection `ascendants`. |
| Backstory | Passé (m.) | Alternative : « Histoire ». |
| Advances | Avancées (f. pl.) | Actuel. Coexiste avec « Progression » (Advancement) dans la même liste de sections. |
| Harm | Blessures (f. pl.) | Actuel. |
| MC guidance | Conseils au MC | Donnée d’en-tête éditorial. |
| Hot, Cold, Volatile, Dark | Ardent, Froid, Instable, Sombre | Données du document. À confirmer (VF officielle ?). |

## The Sprawl

| English term | French term | note |
| --- | --- | --- |
| Directives | Directives (f. pl.) | Actuel. |
| Mission gear | Équipement de mission (m.) | Collection `missionGear`. |
| Cred | Cred (f.) | Champ `cred`. Alternative : « Réputation ». |
| Links | Liens (m. pl.) | Absent de l’interface actuelle ; pour mémoire. |
| Cyberware | Cybernétique (f.) | Absent de l’interface actuelle ; alternative : « Implants ». |
| Cool, Edge, Meat, Mind, Style, Synth | Sang-froid, Tranchant, Chair, Esprit, Style, Synth | Données du document ; pas de VF connue. |

## Urban Shadows

| English term | French term | note |
| --- | --- | --- |
| Circles | Cercles (m. pl.) | Actuel (« Cercles et statut »). À confirmer (VF officielle ?). |
| Status | Statut (m.) | Actuel au singulier alors que le champ `statuses` est un statut par cercle : « Cercles et statuts » serait plus juste. Même mot que les statuts Mist, sans conflit réel (jeux distincts). |
| Mortalis, Night, Power, Wild | Mortalis, Nuit, Pouvoir, Sauvage | Noms de cercles, données du document. À confirmer (VF officielle ?). |
| Blood, Heart, Mind, Spirit | Sang, Cœur, Esprit, Âme | Données du document. À confirmer (VF officielle ?). |
| Mortal relationships | Relations avec les mortels | Actuel « Relations mortelles » : contresens, cela signifie « relations qui tuent ». À corriger. |
| Scars | Cicatrices (f. pl.) | Actuel. |
| Harm: Faint, Serious, Critical | Blessures : légères, graves, critiques | Accord au féminin pluriel avec « Blessures ». |
| Corruption | Corruption (f.) | Actuel. |
| Corruption advances / Corruption moves | Avancées de corruption / Actions de corruption | |
| End move | Action finale (f.) | Actuel. |
| Debts | Dettes (f. pl.) | Absent de l’interface actuelle ; pour mémoire. |
