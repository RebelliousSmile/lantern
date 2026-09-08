import type { OtherscapeLoadoutItem } from './model'

/* Kestrel Whisperlink, the worked example of
   `../schema-in-the-mist/examples/otherscape/loadout-item/`. Held in the shape
   the import produces, so the example and an imported file are the same object
   to everything downstream. */
export function getSampleOtherscapeLoadoutItem(): OtherscapeLoadoutItem {
    return {
        name: 'Kestrel Whisperlink',
        category: 'Weapons',
        description:
            "A throat-mounted relay sold as a comms rig, which it is, right up until you route a targeting feed through it and let someone else's gun do the aiming.\n\nThe grey-market units still carry the factory handshake, so anyone who knows the model knows the frequency.",
        feature_tags: [
            'Kestrel Whisperlink',
            'subvocal, so nobody hears you talk',
            'paints a target for a friend',
            'reads as medical hardware on a scan',
        ],
        weakness_tag: 'still answers to the factory handshake',
        meta: {
            publication_type: 'homebrew',
            source: undefined,
            authors: ['schema-in-the-mist contributors'],
            page: undefined,
        },
    }
}
