/* Editor form strings for this template, grouped by form. English is the source of truth. */
const forms = {
    basic: {
        namePlaceholder: 'The Long Road to Blackmere',
        nameHint: 'What the Narrator calls this journey at the table.',
        typeLabel: 'Type',
        typeHint:
            'A Landscape is a place crossed, an Occasion an event lived through, an Undertaking a task carried out. The band takes its colour from this.',
        typeOptions: {
            landscape: 'Landscape',
            occasion: 'Occasion',
            undertaking: 'Undertaking',
        },
        descriptionPlaceholder: 'Read this out when the heroes set off.',
        descriptionHint:
            'Markdown and braced tags are rendered on the spread.',
    },
    benefits: {
        placeholder: 'What the heroes gain by making it through.',
        hint: 'Printed as a sentence after a bold label, not as a list. Markdown and braced tags are rendered on the spread.',
    },
    consequences: {
        hint: 'What the road can cost anywhere.',
        emptyError: 'A consequence needs some text.',
        fieldLabel: 'Consequence',
        fieldPlaceholder: 'Someone in the party takes {tired-2}.',
        fieldHint: 'Opening with <em>New Challenge:</em> prints that prefix in bold.',
        add: 'Add consequence',
    },
    shared: {
        dragDisabledTitle: 'Finish editing to reorder',
    },
    appearance: {
        backgroundOptions: {
            parchment: 'Parchment',
            plain: 'Plain',
        },
    },
}

export default forms
