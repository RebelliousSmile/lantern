import type { ThemeKitDocument } from './model'

/* Personality, a Logos themebook: the ordinary self a character keeps proving.
   Ten power questions, four weakness questions, an Identity and five
   improvements — the shape every themebook the books print carries. The wording
   is written for this app rather than transcribed, since the published text is
   not ours to ship. */
export function getSampleThemeKit(): ThemeKitDocument {
    return {
        name: 'Personality',
        theme_type: 'logos',
        keywords: ['character', 'temper', 'reputation', 'habit'],
        introduction:
            'Some people are remembered for what they did. You are remembered for how you were while doing it. This theme is the part of you everyone can name before they can name your job, and the part you cannot put down when it stops being useful.',
        concept: 'You are who you are, and that is enough.',
        power_tag_questions: [
            {
                letter: 'A',
                text: 'What is the trait everyone names first when they describe you?',
                examples: ['stubborn', 'warm to strangers', 'never rattled'],
            },
            {
                letter: 'B',
                text: 'What do you do better than anyone expects of someone like you?',
                examples: ['read a room', 'hold my tongue', 'take a hit'],
            },
            {
                letter: 'C',
                text: 'What do people come to you for, even when they should not?',
                examples: ['the blunt answer', 'a place to sleep'],
            },
            {
                letter: 'D',
                text: 'What did you learn about yourself the hard way?',
                examples: ['I do not run', 'I lie well'],
            },
            {
                letter: 'E',
                text: 'How do you win an argument you should lose?',
                examples: ['outlast them', 'make them laugh'],
            },
            {
                letter: 'F',
                text: 'What does your face do that words cannot?',
                examples: ['a stare that ends it', 'that grin'],
            },
            {
                letter: 'G',
                text: 'What kind of person do you get along with instantly?',
                examples: ['bartenders', 'anyone with a grudge'],
            },
            {
                letter: 'H',
                text: 'What keeps you standing when the night goes badly?',
                examples: ['spite', 'the routine'],
            },
            {
                letter: 'I',
                text: 'What promise have you never broken?',
                examples: ['I show up', 'I do not sell out a friend'],
            },
            {
                letter: 'J',
                text: 'What do you carry that says who you are without a word?',
                examples: ["my father's coat", 'the same cheap lighter'],
            },
        ],
        power_tag_rule: {
            required_count: 1,
            chosen_count: 2,
            note: 'Answer the first question, then two more of your choice.',
        },
        weakness_tag_questions: [
            {
                letter: 'A',
                text: 'What does that same trait cost you when it is the wrong room?',
                examples: ['too blunt', 'cannot let it go'],
            },
            {
                letter: 'B',
                text: 'Who has learned exactly how to use you?',
                examples: ['anyone who flatters me'],
            },
            {
                letter: 'C',
                text: 'What do you refuse to do, even when refusing is the worse option?',
                examples: ['ask for help', 'apologise first'],
            },
            {
                letter: 'D',
                text: 'What happens to you when someone says you have changed?',
                examples: ['I prove them wrong the stupid way'],
            },
        ],
        weakness_tag_rule: {
            required_count: 1,
            chosen_count: 0,
            note: 'One extra power tag costs one extra weakness tag.',
        },
        extra_tags: [],
        motivation: {
            kind: 'identity',
            intro: 'Write the statement about yourself you keep proving, in whatever the city throws at you.',
            examples: [
                'I am the one who stays.',
                'Nobody tells me what I am.',
                'I am worth more than they paid for me.',
            ],
            rule: 'When you stop proving it, the theme cracks and you lose it.',
        },
        title_guidance:
            'Name the part of yourself this theme is about, in the words you would use, not the words a file would.',
        crew_relationships: [],
        improvements: [
            {
                name: 'Known Quantity',
                effect: 'Take an additional power tag for this theme.',
            },
            {
                name: 'Second Wind',
                effect: 'Once per session, clear a status someone put on you by naming what they got wrong about you.',
            },
            {
                name: 'Force of Habit',
                effect: 'Unlock a custom move for this theme.',
            },
            {
                name: 'Reputation Precedes You',
                effect: 'When you enter a scene where someone already knows of you, take a +1 ongoing to change their mind.',
            },
            {
                name: 'Unshakeable',
                effect: 'When you would mark erosion for holding to your Identity, mark attention instead.',
            },
        ],
        meta: {
            publication_type: 'homebrew',
            source: 'Lantern in the Mist',
            authors: ['RebelliousSmile'],
        },
    }
}
