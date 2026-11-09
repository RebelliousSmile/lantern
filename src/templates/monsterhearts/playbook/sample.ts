import { blankPlaybook, type MonsterheartsPlaybook } from './model'

/*
 * La Selkie, the skin of schema-pbta's example
 * `examples/monsterhearts/monsterhearts-playbook/la-selkie.toml`: the same
 * content Handbook renders in Obsidian, so both hosts and the booklet PDF can
 * be compared on one playbook. The example has no harm nor conditions;
 * Lantern's model carries them empty.
 */
export const getSampleMonsterheartsPlaybook = (): MonsterheartsPlaybook => ({
    ...blankPlaybook(),
    slug: 'la-selkie',
    name: 'La Selkie',
    description:
        'Venant d’ailleurs, avide de découvertes, mais aussi indécise et hantée par le mal du pays, la Selkie tire son pouvoir des flots.',
    stats: { hot: -1, cold: 2, volatile: -1, dark: 1 },
    moves: [
        {
            name: 'Dragée haute',
            moveType: 'skin',
            description: 'On peut voler ta peau, mais jamais la détruire.',
            trigger:
                'Quand tu cherches à accomplir une tâche pour la personne qui la détient, ajoute +1 sur tous tes jets.',
        },
        {
            name: 'Peau des Profondeurs',
            moveType: 'skin',
            description:
                'Revêts ta peau pour ressembler à une otarie, respirer sous l’eau et nager incroyablement vite.',
        },
    ],
    advances: [
        { label: 'Choisis l’océan ou la terre ferme.' },
        { label: 'Gagne 1 point d’expérience quand tu fais le mauvais choix.' },
    ],
    creation: [
        {
            label: 'Apparence',
            options: [
                'brillante',
                'débraillée',
                'ébouriffée',
                'étrangère',
                'fascinante',
                'moite',
            ],
            attribute: 'look',
        },
    ],
    strings: { max: 5, starting: 1 },
    conditions: [],
    harm: 0,
    editorial: {
        opening: {
            heading: 'Entre deux mondes',
            paragraphs: [
                'Tu es née sous la surface et tu peux enlever ta peau lorsque tu le souhaites. Quand tu la portes, tu ressembles à une otarie ; sans elle, tu te sens aussi pure et belle qu’un diamant brut.',
                'Tu vis désormais sur la terre ferme, attirée par ses possibilités et hantée par l’envie de retourner d’où tu viens.',
            ],
        },
        darkestSelf: {
            heading: 'Faire monter les eaux',
            paragraphs: [
                'Les gens t’ont maltraitée et rejetée. Il est temps de leur montrer ce que cela fait de se sentir perdue en mer, séparée de ce que tu aimes, et de te faire voler des parts de toi-même.',
                'Tu veux faire disparaître la Terre sous les flots, détruire ce qu’ils chérissent et voler leur peau. Tu échappes à ton démon intérieur lorsqu’un lieu te rappelle d’où tu viens, ou lorsque tu fais face à la raison pour laquelle tu as choisi la terre ferme.',
            ],
        },
        sexMove: {
            heading: 'Quand tu couches avec quelqu’un',
            paragraphs: [
                'C’est comme si tu t’immergeais entièrement dans l’eau. Comme les océans n’ont aucun secret pour toi, gagne un ascendant sur quelqu’un d’autre avec qui ton partenaire a déjà couché.',
            ],
        },
        play: {
            heading: 'Jouer la Selkie',
            paragraphs: [
                'Tirée entre deux mondes, la Selkie se demande sans cesse si elle doit rester sur la terre ferme ou retourner à la mer. Sa faible Impulsivité montre qu’elle réfléchit avant d’agir.',
                'Si ta peau t’a été volée, faire ce que la personne qui la détient te demande est un moyen efficace de provoquer des situations intéressantes et d’obtenir des ascendants.',
            ],
        },
        identity: {
            heading: 'Identité',
            paragraphs: [
                'Choisis un nom, une apparence, un regard et une origine.',
                'Nom : Bersh, Dominic, Fiona, Jasdeep, John, Louie, Mathieu, Nula, Phillipa, Rowan.',
                'Apparence : brillante, débraillée, ébouriffée, étrangère, fascinante, moite.',
                'Regard : confus, pétillant, profond, vague, vitreux.',
                'Origine : attrait pour l’art des humains, curiosité, exemple de ta grand-mère, fugue, rébellion.',
            ],
        },
        progression: {
            heading: 'Actions, suite et progression',
            paragraphs: [
                'Quand tu ressens vraiment le mal du pays, choisis : l’océan t’offre ce qu’il te faut ici, t’aidera à te sentir mieux ; ou il emporte au loin ce qui, selon lui, te blesse le plus.',
                'Quand tu ne comprends pas ce qui se passe ou ce que quelqu’un veut dire, et que cela t’attire des ennuis ou te pousse à faire de mauvais choix, gagne 1 point d’expérience.',
            ],
        },
    },
})
