import { PJ_PRESENTATION } from 'schema-adrenaline/presentation'

/*
 * A click on the sheet opens the fields of the zone it hit and no others. The zone is a published
 * block: the document pointers it prints say which fields the panel carries, and the locations,
 * durations and damage natures the panel offers are the ones the presentation publishes. Nothing
 * is listed here by hand.
 */
type Block = {
    id: string
    form: string
    label?: string
    paths: readonly string[]
    pointerRows?: readonly (readonly { path: string }[])[]
    thresholdLevels?: readonly { key: string; label: string; malus: number }[]
    referenceTable?: {
        lines?: readonly { name: string }[]
        legend?: readonly { nature: string; meaning?: string }[]
    }
    decoration?: {
        kind: string
        side?: string
        durations?: readonly string[]
        locations?: readonly { id: string; label: string }[]
        columns?: readonly { key: string }[]
    }
}

const blocks: Block[] = (
    PJ_PRESENTATION.sections as readonly { blocks: readonly unknown[] }[]
).flatMap((section) => section.blocks as Block[])

/** The pointers of a block: its paths, and the ones its printed rows name. */
function pointersOf(block: Block): string[] {
    const rows = block.pointerRows ?? []
    return [
        ...block.paths,
        ...rows.reduce<string[]>(
            (all, row) => all.concat(row.map((cell) => cell.path)),
            []
        ),
    ]
}

const parentOf = (pointer: string) => pointer.slice(0, pointer.lastIndexOf('/'))

/** Every pointer some block of the presentation prints. */
const printed: string[] = blocks.reduce<string[]>(
    (all, block) => all.concat(pointersOf(block)),
    []
)

/**
 * Whether the panel carries the document pointer. With no zone (the section list opens a whole
 * section) every field is carried, the ones no block prints included. A pointer no block prints
 * (a hidden path of the contract) is carried by the zone that prints its siblings, and by no other.
 */
export function zoneCarries(zone: readonly string[] | undefined) {
    if (!zone || zone.length === 0) return () => true
    const pointers = blocks
        .filter((block) => zone.indexOf(block.id) >= 0)
        .reduce<string[]>((all, block) => all.concat(pointersOf(block)), [])
    return (pointer: string) =>
        pointers.indexOf(pointer) >= 0 ||
        (printed.indexOf(pointer) < 0 &&
            pointers.some((own) => parentOf(own) === parentOf(pointer)))
}

export type PublishedZone = { id: string; label: string }

/**
 * The zones of the identity as the sheet prints them once it holds something: one block each. A
 * blank sheet draws none of them, so the panel offers them itself, one click per zone.
 */
export function identityZones(): PublishedZone[] {
    return blocks.flatMap((block) =>
        block.paths.length > 0 &&
        block.paths.every(
            (path) => path === '/identite' || path.indexOf('/identite/') === 0
        )
            ? [{ id: block.id, label: block.label ?? block.id }]
            : []
    )
}

export type PublishedLocation = { id: string; label: string }

/** The locations of a side of the sheet, as the presentation publishes them. */
export function publishedLocations(
    side: 'physical' | 'mental'
): PublishedLocation[] {
    return blocks.flatMap((block) =>
        block.decoration?.kind === 'location-grid' &&
        block.decoration.side === side
            ? (block.decoration.locations ?? []).map(({ id, label }) => ({
                  id,
                  label,
              }))
            : []
    )
}

export type PublishedWounds = {
    durations: readonly string[]
    columns: readonly { key: string }[]
}

/** The wound circles of a side: their durations and their two columns. */
export function publishedWounds(
    side: 'physical' | 'mental'
): PublishedWounds | undefined {
    for (const block of blocks) {
        const decoration = block.decoration
        if (decoration?.kind === 'wound-circles' && decoration.side === side)
            return {
                durations: decoration.durations ?? [],
                columns: (decoration.columns ?? []).map(({ key }) => ({
                    key,
                })),
            }
    }
    return undefined
}

export type PublishedNature = { value: string; label: string }

/** The damage natures the legend of the reference table of weapons publishes, named by the nature itself: the legend's sentence is too long for a menu. */
export function publishedNatures(): PublishedNature[] {
    return blocks.reduce<PublishedNature[]>(
        (all, block) =>
            (block.referenceTable?.legend ?? []).reduce(
                (natures, entry) =>
                    natures.some((known) => known.value === entry.nature)
                        ? natures
                        : natures.concat({
                              value: entry.nature,
                              label:
                                  entry.nature.charAt(0).toUpperCase() +
                                  entry.nature.slice(1),
                          }),
                all
            ),
        []
    )
}

/** The names of the social weapons the reference table publishes, in the order of the sheet. */
export function publishedSocialWeapons(): string[] {
    return blocks.reduce<string[]>(
        (all, block) =>
            all.concat(
                (block.referenceTable?.lines ?? []).map((line) => line.name)
            ),
        []
    )
}

export type PublishedThreshold = { key: string; label: string; malus: number }

/** The threshold levels of a side, as the thresholds block publishes them (label and malus). */
export function publishedThresholds(
    kind: 'physique' | 'mental'
): PublishedThreshold[] {
    for (const block of blocks)
        if (block.paths.indexOf(`/sante/${kind}`) >= 0 && block.thresholdLevels)
            return block.thresholdLevels.map(({ key, label, malus }) => ({
                key,
                label,
                malus,
            }))
    return []
}
