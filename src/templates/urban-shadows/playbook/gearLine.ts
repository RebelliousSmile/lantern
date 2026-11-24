import { localizedLabel } from '@/templates/pbta/shared/localizedLabel'
import contract from 'schema-pbta/packs/urban-shadows/presentation-contract.json'
import type { UrbanShadowsPlaybook } from './model'

type GearItem = NonNullable<UrbanShadowsPlaybook['gear']>[number]

const { tags: TAGS } = contract.equipment

/**
 * A piece of gear as the booklet prints it: `2-harm near loud concealable`,
 * armour as `2-armor` or `armor+1`. A tag the contract names is printed in the
 * reader's language; a tag the player added is printed as typed.
 */
export function gearStats(item: GearItem): string {
    const parts: string[] = []
    if (typeof item.harm === 'number') parts.push(`${item.harm}-harm`)
    else if (item.harm === 'stun') parts.push('stun')
    if (item.armor)
        parts.push(
            item.armor.mode === 'bonus'
                ? `armor+${item.armor.value}`
                : `${item.armor.value}-armor`
        )
    parts.push(...(item.range ?? []))
    for (const tag of item.tags ?? []) {
        const known = TAGS.find((entry) => entry.id === tag)
        parts.push(known ? localizedLabel(known.label) : tag)
    }
    return parts.join(' ')
}

/** The line a preview prints for a piece of gear: name, stats, then the description. */
export function gearLine(item: GearItem): string {
    const stats = gearStats(item)
    return `${item.name}${stats ? ` — ${stats}` : ''}${item.description ? ` — ${item.description}` : ''}`
}
