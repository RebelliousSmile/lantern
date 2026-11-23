import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useUiText, type TranslationKey } from '@/i18n/text'
import { ATTITUDE_LEVELS } from 'schema-adrenaline/presentation'
import { put, withoutHollow } from '../../shared/editor/clean'
import { SchemaProvider } from '../../shared/editor/draft'
import {
    NumberField,
    OptionSelect,
    RecordRows,
    RequiredTextField,
    TextField,
} from '../../shared/editor/FieldPrimitives'
import {
    OptionalNumberField,
    OptionalTextField,
} from '../../shared/editor/OptionalFields'
import { limitAt } from '../../shared/editor/pjLimits'
import {
    enumAt,
    maxLengthAt,
    shapeAt,
} from '../../shared/editor/schemaShapes'
import { MetaFields } from '../../shared/editor/AdrenalineFields'
import { useAdrenalineDocument } from '../../shared/hooks'
import type { RelationsSection } from '../../shared/sections'
import { blankRelations } from '../sample'
import { nextNumber } from './numbers'

type Entry = Record<string, unknown>
const records = (value: unknown): Entry[] =>
    Array.isArray(value)
        ? value.filter(
              (entry): entry is Entry =>
                  Boolean(entry) &&
                  typeof entry === 'object' &&
                  !Array.isArray(entry)
          )
        : []

const sheetLabel = (key: string) =>
    `adrenaline:relations.sheet.${key}` as TranslationKey

const lengthAt = (pointer: string) => maxLengthAt('relations', pointer)

/** The entry of a list a click on the sheet named (`npc:3`, `tie:1`), when it named one. */
function openedEntry(
    keys: readonly string[] | undefined,
    prefix: string
): number | undefined {
    const zone = (keys ?? []).find((key) => key.startsWith(`${prefix}:`))
    const index = zone === undefined ? NaN : Number(zone.split(':')[1])
    return Number.isInteger(index) ? index : undefined
}

/** Which blocks of a section the click named: none named means the whole section. */
const shows = (keys: readonly string[] | undefined, block: string) =>
    !keys || keys.length === 0 || keys.includes(block)

function RelatedTo({
    entry,
    numbers,
    onChange,
}: {
    entry: Entry
    numbers: readonly number[]
    onChange: (reliesA: number[] | undefined) => void
}) {
    const text = useUiText()
    const own = typeof entry.numero === 'number' ? entry.numero : undefined
    const chosen = Array.isArray(entry.reliesA)
        ? entry.reliesA.filter(
              (item): item is number => typeof item === 'number'
          )
        : []
    const max = shapeAt('relations', '/pnjs[]/reliesA')?.maxItems
    /* A number no NPC carries stays selectable as typed, flagged, so that choosing nothing else never erases it. */
    const orphans = chosen.filter((number) => !numbers.includes(number))
    const offered = numbers
        .filter((number) => number !== own)
        .concat(orphans)
        .sort((a, b) => a - b)
    const toggle = (number: number) =>
        onChange(
            chosen.includes(number)
                ? chosen.filter((item) => item !== number)
                : chosen.concat(number).sort((a, b) => a - b)
        )
    return (
        <div className="grid gap-1 text-sm">
            <Label className="font-normal">
                {text('adrenaline:relations.form.relatedTo')}
            </Label>
            {offered.length === 0 ? (
                <span className="text-xs text-muted-foreground">
                    {text('adrenaline:relations.form.relatedToNone')}
                </span>
            ) : (
                <div className="flex flex-wrap gap-1">
                    {offered.map((number) => {
                        const on = chosen.includes(number)
                        return (
                            <Button
                                key={number}
                                type="button"
                                size="sm"
                                variant={on ? 'default' : 'outline'}
                                aria-pressed={on}
                                disabled={
                                    !on &&
                                    max !== undefined &&
                                    chosen.length >= max
                                }
                                onClick={() => toggle(number)}
                            >
                                {number}
                            </Button>
                        )
                    })}
                </div>
            )}
            {orphans.length > 0 && (
                <p role="status" className="text-xs text-muted-foreground">
                    {text('adrenaline:relations.form.orphanLink', {
                        numbers: orphans.join(', '),
                    })}
                </p>
            )}
        </div>
    )
}

/* The modifier an attitude sets is the published level's: it is shown, never typed. */
function attitudeModifier(
    attitude: unknown,
    text: ReturnType<typeof useUiText>
) {
    const level = ATTITUDE_LEVELS.find((candidate) => candidate.key === attitude)
    if (!level) return undefined
    return level.nature === 'aucun'
        ? text(sheetLabel('aucun'))
        : `${text(sheetLabel(level.nature))} ${level.count}`
}

export function RelationsEditorPanel() {
    const text = useUiText()
    const { document, update, sheet } = useAdrenalineDocument<
        Record<string, unknown>,
        RelationsSection
    >(
        'adrenaline.relations',
        blankRelations() as unknown as Record<string, unknown>
    )
    /* A field is a value or it is not there: nothing hollow is held by the document. */
    const set = (key: string, value: unknown) =>
        update((next) => {
            const kept = withoutHollow(value)
            if (kept === undefined) delete next[key]
            else next[key] = kept
        })
    if (!sheet.open || !sheet.target) {
        return (
            <div className="rounded-md border border-dashed px-3 py-4 text-sm text-muted-foreground">
                {text('adrenaline:sections.emptyState')}
            </div>
        )
    }
    const target = sheet.target
    const keys = sheet.keys
    const ties = records(document.autresPersonnages)
    const npcs = records(document.pnjs)
    const numbers = npcs.flatMap((entry) =>
        typeof entry.numero === 'number' ? [entry.numero] : []
    )
    const tie = openedEntry(keys, 'tie')
    const npc = openedEntry(keys, 'npc')
    const tieMax = shapeAt('relations', '/autresPersonnages')?.maxItems
    const tieDefault = shapeAt('relations', '/nombreDAutresPersonnages')?.default
    const npcMax = shapeAt('relations', '/pnjs')?.maxItems
    const linkTypes = enumAt('relations', '/pnjs[]/lien/type')
    return (
        <SchemaProvider value="relations">
            <div className="space-y-6 p-1">
                {target === 'entete' && (
                    <section className="grid gap-2">
                        <h3 className="font-semibold">
                            {text('adrenaline:relations.form.headerHeading')}
                        </h3>
                        <RequiredTextField
                            label={text('adrenaline:relations.form.character')}
                            maxLength={lengthAt('/personnage')}
                            value={String(document.personnage ?? '')}
                            onChange={(personnage) =>
                                set('personnage', personnage)
                            }
                        />
                        <OptionalTextField
                            label={text('adrenaline:relations.form.player')}
                            maxLength={lengthAt('/joueur')}
                            value={document.joueur}
                            onChange={(joueur) => set('joueur', joueur)}
                        />
                        <OptionalTextField
                            label={text('adrenaline:relations.form.game')}
                            maxLength={lengthAt('/partie')}
                            value={document.partie}
                            onChange={(partie) => set('partie', partie)}
                        />
                    </section>
                )}
                {target === 'autresPersonnages' && (
                    <section className="grid gap-2">
                        <h3 className="font-semibold">
                            {text(
                                'adrenaline:relations.form.otherCharactersHeading'
                            )}
                        </h3>
                        <OptionalNumberField
                            label={text(
                                'adrenaline:relations.form.otherCharactersCount',
                                { count: tieDefault }
                            )}
                            at="/nombreDAutresPersonnages"
                            value={document.nombreDAutresPersonnages}
                            onChange={(count) =>
                                set('nombreDAutresPersonnages', count)
                            }
                        />
                        <RecordRows
                            key={`tie:${tie ?? ''}`}
                            at="/autresPersonnages[]"
                            label={text(
                                'adrenaline:relations.form.otherCharacter'
                            )}
                            values={ties}
                            max={tieMax}
                            fold={{
                                summary: (entry) => String(entry.nom ?? ''),
                                open: tie,
                                only: tie !== undefined && tie < ties.length,
                            }}
                            create={() => ({}) as Entry}
                            onChange={(next) => set('autresPersonnages', next)}
                        >
                            {(entry, _, replace) => (
                                <div className="grid gap-2">
                                    <TextField
                                        label={text(sheetLabel('nom'))}
                                        maxLength={lengthAt(
                                            '/autresPersonnages[]/nom'
                                        )}
                                        value={String(entry.nom ?? '')}
                                        onChange={(nom) =>
                                            replace({ ...entry, nom })
                                        }
                                    />
                                    {(
                                        [
                                            'ceQueJeSais',
                                            'ceQueJeLuiDois',
                                            'ceQuIlMeDoit',
                                        ] as const
                                    ).map((field) => (
                                        <OptionalTextField
                                            key={field}
                                            label={text(sheetLabel(field))}
                                            maxLength={lengthAt(
                                                `/autresPersonnages[]/${field}`
                                            )}
                                            value={entry[field]}
                                            onChange={(value) =>
                                                replace(put(entry, field, value))
                                            }
                                        />
                                    ))}
                                </div>
                            )}
                        </RecordRows>
                        {tieMax !== undefined && ties.length >= tieMax && (
                            <p className="text-xs text-muted-foreground">
                                {text('adrenaline:relations.form.full', {
                                    max: tieMax,
                                })}
                            </p>
                        )}
                    </section>
                )}
                {target === 'pnjs' && (
                    <section className="grid gap-2">
                        <h3 className="font-semibold">
                            {text('adrenaline:relations.form.npcsHeading')}
                        </h3>
                        {shows(keys, 'testsDeDrame') && (
                            <OptionalNumberField
                                label={text('adrenaline:relations.form.dramaTests')}
                                at="/testsDeDrame"
                                value={document.testsDeDrame}
                                onChange={(tests) => set('testsDeDrame', tests)}
                            />
                        )}
                        {shows(keys, 'pnjs') && (
                            <RecordRows
                                key={`npc:${npc ?? ''}`}
                                at="/pnjs[]"
                                label={text('adrenaline:relations.form.npc')}
                                values={npcs}
                                max={npcMax}
                                fold={{
                                    summary: (entry) =>
                                        [entry.numero, entry.nom]
                                            .filter(
                                                (part) =>
                                                    part !== undefined &&
                                                    part !== ''
                                            )
                                            .join(' · '),
                                    open: npc,
                                    only: npc !== undefined && npc < npcs.length,
                                }}
                                create={() => {
                                    const numero = nextNumber(npcs)
                                    return (
                                        numero === undefined ? {} : { numero }
                                    ) as Entry
                                }}
                                onChange={(next) => set('pnjs', next)}
                            >
                                {(entry, index, replace) => {
                                    const duplicate =
                                        typeof entry.numero === 'number' &&
                                        npcs.some(
                                            (other, position) =>
                                                position !== index &&
                                                other.numero === entry.numero
                                        )
                                    const link =
                                        entry.lien &&
                                        typeof entry.lien === 'object'
                                            ? (entry.lien as Entry)
                                            : undefined
                                    const modifier = attitudeModifier(
                                        entry.attitude,
                                        text
                                    )
                                    return (
                                        <div className="grid gap-2">
                                            <div className="grid grid-cols-[6rem_1fr] gap-2">
                                                <NumberField
                                                    label={text(
                                                        'adrenaline:relations.form.number'
                                                    )}
                                                    limit={limitAt(
                                                        'relations',
                                                        '/pnjs[]/numero'
                                                    )}
                                                    value={
                                                        typeof entry.numero ===
                                                        'number'
                                                            ? entry.numero
                                                            : undefined
                                                    }
                                                    onChange={(numero) =>
                                                        replace({
                                                            ...entry,
                                                            numero,
                                                        })
                                                    }
                                                />
                                                <TextField
                                                    label={text(
                                                        sheetLabel('nom')
                                                    )}
                                                    maxLength={lengthAt(
                                                        '/pnjs[]/nom'
                                                    )}
                                                    value={String(
                                                        entry.nom ?? ''
                                                    )}
                                                    onChange={(nom) =>
                                                        replace({
                                                            ...entry,
                                                            nom,
                                                        })
                                                    }
                                                />
                                            </div>
                                            {duplicate && (
                                                <p
                                                    role="status"
                                                    className="text-xs text-muted-foreground"
                                                >
                                                    {text(
                                                        'adrenaline:relations.form.duplicateNumber',
                                                        {
                                                            number: String(
                                                                entry.numero
                                                            ),
                                                        }
                                                    )}
                                                </p>
                                            )}
                                            <OptionSelect
                                                label={text(
                                                    'adrenaline:relations.form.attitude'
                                                )}
                                                value={entry.attitude}
                                                options={ATTITUDE_LEVELS.map(
                                                    (level) => ({
                                                        value: level.key,
                                                        label: level.label,
                                                    })
                                                )}
                                                noneLabel={text(
                                                    'adrenaline:relations.form.attitudeNone'
                                                )}
                                                onChange={(attitude) =>
                                                    replace(
                                                        put(
                                                            entry,
                                                            'attitude',
                                                            attitude
                                                        )
                                                    )
                                                }
                                            />
                                            {modifier !== undefined && (
                                                <p className="text-xs text-muted-foreground">
                                                    {text(
                                                        'adrenaline:relations.form.modifier',
                                                        { modifier }
                                                    )}
                                                </p>
                                            )}
                                            <OptionSelect
                                                label={text(
                                                    'adrenaline:relations.form.linkType'
                                                )}
                                                value={link?.type}
                                                options={linkTypes.map(
                                                    (type) => ({
                                                        value: type,
                                                        label: text(
                                                            sheetLabel(type)
                                                        ),
                                                    })
                                                )}
                                                noneLabel={text(
                                                    'adrenaline:relations.form.linkNone'
                                                )}
                                                onChange={(type) =>
                                                    replace(
                                                        put(
                                                            entry,
                                                            'lien',
                                                            type === undefined
                                                                ? undefined
                                                                : { ...link, type }
                                                        )
                                                    )
                                                }
                                            />
                                            {link?.type !== undefined && (
                                                <OptionalTextField
                                                    label={text(
                                                        'adrenaline:relations.form.linkDescription'
                                                    )}
                                                    maxLength={lengthAt(
                                                        '/pnjs[]/lien/description'
                                                    )}
                                                    value={link.description}
                                                    onChange={(description) =>
                                                        replace(
                                                            put(entry, 'lien', {
                                                                ...put(
                                                                    link,
                                                                    'description',
                                                                    description
                                                                ),
                                                            })
                                                        )
                                                    }
                                                />
                                            )}
                                            <RelatedTo
                                                entry={entry}
                                                numbers={numbers}
                                                onChange={(reliesA) =>
                                                    replace(
                                                        put(
                                                            entry,
                                                            'reliesA',
                                                            reliesA &&
                                                                reliesA.length >
                                                                    0
                                                                ? reliesA
                                                                : undefined
                                                        )
                                                    )
                                                }
                                            />
                                            {(
                                                ['ceQuiLuiEstArrive', 'notes'] as const
                                            ).map((field) => (
                                                <OptionalTextField
                                                    key={field}
                                                    label={text(
                                                        sheetLabel(field)
                                                    )}
                                                    maxLength={lengthAt(
                                                        `/pnjs[]/${field}`
                                                    )}
                                                    value={entry[field]}
                                                    onChange={(value) =>
                                                        replace(
                                                            put(
                                                                entry,
                                                                field,
                                                                value
                                                            )
                                                        )
                                                    }
                                                />
                                            ))}
                                        </div>
                                    )
                                }}
                            </RecordRows>
                        )}
                        {shows(keys, 'pnjs') &&
                            npcMax !== undefined &&
                            npcs.length >= npcMax && (
                                <p className="text-xs text-muted-foreground">
                                    {text('adrenaline:relations.form.full', {
                                        max: npcMax,
                                    })}
                                </p>
                            )}
                    </section>
                )}
                {target === 'meta' && (
                    <section className="grid gap-2">
                        <h3 className="font-semibold">
                            {text('adrenaline:shared.headings.provenance')}
                        </h3>
                        <MetaFields
                            value={document.meta}
                            onChange={(meta) => set('meta', meta)}
                        />
                    </section>
                )}
            </div>
        </SchemaProvider>
    )
}
