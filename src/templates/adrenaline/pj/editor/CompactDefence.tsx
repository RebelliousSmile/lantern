import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUiText } from '@/i18n/text'
import { CheckField } from '../../shared/editor/FieldPrimitives'
import { PlainNumberInput } from './CompactFields'

const record = (value: unknown): Record<string, unknown> =>
    value && typeof value === 'object' && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : {}

const strings = (value: unknown): string[] =>
    Array.isArray(value)
        ? value.filter((entry): entry is string => typeof entry === 'string')
        : []

type Location = { id: string; label: string }

/**
 * One side of the protections of the player sheet: the armour points as a line of one grid under
 * shared column heads, the armour name on a line, the published locations ticked in three columns.
 * The paper sheet prints neither a toughness nor a shield, so the editor offers neither.
 */
export function PjDefence({
    mental,
    locations,
    value,
    onChange,
}: {
    mental?: boolean
    locations: readonly Location[]
    value: unknown
    onChange: (value: Record<string, unknown>) => void
}) {
    const text = useUiText()
    const current = record(value)
    const armourKey = mental ? 'caractere' : 'armure'
    const at = `/protections/${mental ? 'mentales' : 'physiques'}`
    const armour = record(current[armourKey])
    const heading = text(
        mental
            ? 'adrenaline:shared.protection.mentalHeading'
            : 'adrenaline:shared.protection.physicalHeading'
    )
    const armourLabel = text(
        mental
            ? 'adrenaline:shared.protection.characterTrait'
            : 'adrenaline:shared.protection.armour'
    )
    const pointsLabel = text('adrenaline:shared.protection.points')
    const setArmour = (next: Record<string, unknown>) =>
        onChange({ ...current, [armourKey]: { ...armour, ...next } })
    /* A text left empty leaves the document: the contract wants at least one character. */
    const allIds = locations.map((location) => location.id)
    const setLocations = (next: string[]) => {
        /* The contract wants at least one location: none ticked leaves the key. */
        const rest = { ...armour }
        if (next.length === 0) delete rest.localisations
        else rest.localisations = next
        onChange({ ...current, [armourKey]: rest })
    }
    const setText = (key: string, value: string) => {
        const next = { ...armour }
        if (value === '') delete next[key]
        else next[key] = value
        onChange({ ...current, [armourKey]: next })
    }
    return (
        <div
            className="grid gap-2 rounded border p-2"
            role="group"
            aria-label={heading}
        >
            <h4 className="font-medium">{heading}</h4>
            <div className="grid grid-cols-[minmax(4.5rem,auto)_minmax(0,1fr)] items-center gap-x-1 gap-y-1.5 text-sm">
                <span className="pr-1 font-medium">{pointsLabel}</span>
                <PlainNumberInput
                    name={`${heading} — ${armourLabel} — ${pointsLabel}`}
                    pointer={`${at}/${armourKey}/points`}
                    value={armour.points}
                    onChange={(points) => setArmour({ points })}
                />
                <label className="col-span-2 grid grid-cols-subgrid items-center">
                    <span className="pr-1 font-medium">{armourLabel}</span>
                    <Input
                        className="h-8"
                        value={String(armour[mental ? 'trait' : 'nom'] ?? '')}
                        onChange={(event) =>
                            setText(
                                mental ? 'trait' : 'nom',
                                event.target.value
                            )
                        }
                    />
                </label>
            </div>
            {locations.length > 0 && (
                <fieldset className="grid gap-1 text-sm">
                    <legend className="px-1">
                        {text('adrenaline:shared.protection.locations')}
                    </legend>
                    <div className="flex gap-1">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="px-2 text-xs"
                            onClick={() => setLocations(allIds)}
                        >
                            {text('adrenaline:shared.protection.locationsAll')}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="px-2 text-xs"
                            onClick={() => setLocations([])}
                        >
                            {text('adrenaline:shared.protection.locationsNone')}
                        </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-x-1 gap-y-0.5">
                        {locations.map((location) => {
                            const values = strings(armour.localisations)
                            return (
                                <CheckField
                                    key={location.id}
                                    label={location.label}
                                    checked={values.indexOf(location.id) >= 0}
                                    onChange={(checked) => {
                                        const next = checked
                                            ? [...values, location.id]
                                            : values.filter(
                                                  (id) => id !== location.id
                                              )
                                        /* The contract wants at least one location: none ticked leaves the key. */
                                        const rest = { ...armour }
                                        if (next.length === 0)
                                            delete rest.localisations
                                        else rest.localisations = next
                                        onChange({
                                            ...current,
                                            [armourKey]: rest,
                                        })
                                    }}
                                />
                            )
                        })}
                    </div>
                </fieldset>
            )}
        </div>
    )
}
