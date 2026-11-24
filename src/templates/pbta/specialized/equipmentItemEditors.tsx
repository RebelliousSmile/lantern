import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { localizedLabel } from '@/templates/pbta/shared/localizedLabel'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import contract from 'schema-pbta/packs/urban-shadows/presentation-contract.json'

type Item = Record<string, unknown>
type Update = (next: Item) => void

/** The label vocabulary the Urban Shadows presentation contract publishes for equipment. */
const { ranges: RANGES, tags: TAGS } = contract.equipment

const ARMOR_MODES = ['base', 'bonus'] as const

/** Sets `key` to `value`, or drops the key when the value is empty: the contract has no empty form. */
function assign(item: Item, key: string, value: unknown): Item {
    const next = { ...item }
    if (
        value === undefined ||
        value === '' ||
        (Array.isArray(value) && !value.length)
    )
        delete next[key]
    else next[key] = value
    return next
}

const strings = (value: unknown): string[] =>
    Array.isArray(value)
        ? value.filter((entry): entry is string => typeof entry === 'string')
        : []

/** The name and description every piece of equipment shares. */
function NameAndDescription({
    item,
    update,
}: {
    item: Item
    update: Update
}) {
    const { t } = useTranslation()
    return (
        <>
            <Label className="grid gap-1 text-sm">
                {t('pbta:equipment.name')}
                <Input
                    value={String(item.name ?? '')}
                    onChange={(event) =>
                        update({ ...item, name: event.target.value })
                    }
                />
            </Label>
            <Label className="grid gap-1 text-sm">
                {t('pbta:equipment.description')}
                <Textarea
                    value={String(item.description ?? '')}
                    onChange={(event) =>
                        update(assign(item, 'description', event.target.value))
                    }
                />
            </Label>
        </>
    )
}

/** Monsterhearts gear: a name and a description, nothing else. */
export function NamedObjectItemEditor({
    item,
    update,
}: {
    item: Item
    update: Update
}) {
    return <NameAndDescription item={item} update={update} />
}

function Pill({
    pressed,
    onClick,
    children,
}: {
    pressed: boolean
    onClick: () => void
    children: string
}) {
    return (
        <Button
            type="button"
            size="sm"
            variant={pressed ? 'default' : 'outline'}
            aria-pressed={pressed}
            onClick={onClick}
        >
            {children}
        </Button>
    )
}

/** Urban Shadows gear: harm, armour, range and tags, chosen from the published vocabulary. */
export function EquipmentItemEditor({
    item,
    update,
}: {
    item: Item
    update: Update
}) {
    const { t } = useTranslation()
    const [freeTag, setFreeTag] = useState('')
    const stun = item.harm === 'stun'
    const armor =
        item.armor && typeof item.armor === 'object'
            ? (item.armor as { value?: number; mode?: string })
            : undefined
    const ranges = strings(item.range)
    const tags = strings(item.tags)
    const known = TAGS.map((tag) => tag.id)
    const own = tags.filter((tag) => !known.includes(tag))
    const toggle = (key: string, list: string[], id: string) =>
        update(
            assign(
                item,
                key,
                list.includes(id)
                    ? list.filter((entry) => entry !== id)
                    : [...list, id]
            )
        )
    const addFreeTag = () => {
        const tag = freeTag.trim()
        if (tag && !tags.includes(tag))
            update(assign(item, 'tags', [...tags, tag]))
        setFreeTag('')
    }
    return (
        <div className="space-y-3">
            <NameAndDescription item={item} update={update} />
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2">
                <Label className="grid gap-1 text-sm">
                    {t('pbta:equipment.harm')}
                    <Input
                        type="number"
                        min={0}
                        disabled={stun}
                        value={typeof item.harm === 'number' ? item.harm : ''}
                        onChange={(event) =>
                            update(
                                assign(
                                    item,
                                    'harm',
                                    event.target.value === ''
                                        ? undefined
                                        : Math.max(
                                              0,
                                              Math.trunc(
                                                  Number(event.target.value)
                                              )
                                          )
                                )
                            )
                        }
                    />
                </Label>
                <Label className="flex items-end gap-2 pb-2 text-sm">
                    <Checkbox
                        checked={stun}
                        onCheckedChange={(checked) =>
                            update(
                                assign(
                                    item,
                                    'harm',
                                    checked === true ? 'stun' : undefined
                                )
                            )
                        }
                    />
                    {t('pbta:equipment.stun')}
                </Label>
            </div>
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2">
                <Label className="grid gap-1 text-sm">
                    {t('pbta:equipment.armor')}
                    <Input
                        type="number"
                        min={0}
                        value={armor?.value ?? ''}
                        onChange={(event) =>
                            update(
                                assign(
                                    item,
                                    'armor',
                                    event.target.value === ''
                                        ? undefined
                                        : {
                                              value: Math.max(
                                                  0,
                                                  Math.trunc(
                                                      Number(
                                                          event.target.value
                                                      )
                                                  )
                                              ),
                                              mode: armor?.mode ?? 'base',
                                          }
                                )
                            )
                        }
                    />
                </Label>
                <Label className="grid gap-1 text-sm">
                    {t('pbta:equipment.armorMode')}
                    <select
                        className="h-9 rounded-md border bg-background px-2 text-sm"
                        disabled={!armor}
                        value={armor?.mode ?? 'base'}
                        onChange={(event) =>
                            armor &&
                            update({
                                ...item,
                                armor: { ...armor, mode: event.target.value },
                            })
                        }
                    >
                        {ARMOR_MODES.map((mode) => (
                            <option key={mode} value={mode}>
                                {t(`pbta:equipment.armorModes.${mode}`)}
                            </option>
                        ))}
                    </select>
                </Label>
            </div>
            <fieldset className="space-y-1">
                <legend className="text-sm">{t('pbta:equipment.range')}</legend>
                <div className="flex flex-wrap gap-1">
                    {RANGES.map((range) => (
                        <Pill
                            key={range.id}
                            pressed={ranges.includes(range.id)}
                            onClick={() => toggle('range', ranges, range.id)}
                        >
                            {localizedLabel(range.label)}
                        </Pill>
                    ))}
                </div>
            </fieldset>
            <fieldset className="space-y-1">
                <legend className="text-sm">{t('pbta:equipment.tags')}</legend>
                <div className="flex flex-wrap gap-1">
                    {TAGS.map((tag) => (
                        <Pill
                            key={tag.id}
                            pressed={tags.includes(tag.id)}
                            onClick={() => toggle('tags', tags, tag.id)}
                        >
                            {localizedLabel(tag.label)}
                        </Pill>
                    ))}
                    {own.map((tag) => (
                        <Pill
                            key={tag}
                            pressed
                            onClick={() => toggle('tags', tags, tag)}
                        >
                            {tag}
                        </Pill>
                    ))}
                </div>
                <div className="flex gap-1">
                    <Input
                        value={freeTag}
                        placeholder={t('pbta:equipment.freeTag')}
                        onChange={(event) => setFreeTag(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key !== 'Enter') return
                            event.preventDefault()
                            addFreeTag()
                        }}
                    />
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        disabled={!freeTag.trim()}
                        onClick={addFreeTag}
                    >
                        {t('pbta:equipment.addTag')}
                    </Button>
                </div>
            </fieldset>
        </div>
    )
}
