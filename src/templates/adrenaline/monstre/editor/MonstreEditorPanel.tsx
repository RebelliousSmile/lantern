import { useUiText } from '@/i18n/text'
import { SchemaProvider } from '../../shared/editor/draft'
import { useAdrenalineDocument } from '../../shared/hooks'
import type { MonstreSection } from '../../shared/sections'
import { blankMonstre } from '../sample'
import { BasicForm } from './forms/BasicForm'
import { BehaviourForm } from './forms/BehaviourForm'
import { ContagionForm } from './forms/ContagionForm'
import { EquipmentForm } from './forms/EquipmentForm'
import { HealthForm } from './forms/HealthForm'
import { MetaForm } from './forms/MetaForm'
import { NarrativeForm } from './forms/NarrativeForm'
import { ProtectionsForm } from './forms/ProtectionsForm'
import { SkillsForm } from './forms/SkillsForm'
import { StatesForm } from './forms/StatesForm'
import { StatisticsForm } from './forms/StatisticsForm'

/* One small form per section, as the Legend in the Mist editors do: the panel only chooses which. */
export function MonstreEditorPanel() {
    const text = useUiText()
    const { sheet } = useAdrenalineDocument<
        Record<string, unknown>,
        MonstreSection
    >(
        'adrenaline.monstre',
        blankMonstre() as unknown as Record<string, unknown>
    )
    if (!sheet.open || !sheet.target) {
        return (
            <div className="rounded-md border border-dashed px-3 py-4 text-sm text-muted-foreground">
                {text('adrenaline:sections.emptyState')}
            </div>
        )
    }
    return <SchemaProvider value="monstre">{form(sheet.target)}</SchemaProvider>
}

function form(target: MonstreSection) {
    switch (target) {
        case 'basic':
            return <BasicForm />
        case 'statistics':
            return <StatisticsForm />
        case 'health':
            return <HealthForm />
        case 'protections':
            return <ProtectionsForm />
        case 'behaviour':
            return <BehaviourForm />
        case 'skills':
            return <SkillsForm />
        case 'equipment':
            return <EquipmentForm />
        case 'states':
            return <StatesForm />
        case 'contagion':
            return <ContagionForm />
        case 'narrative':
            return <NarrativeForm />
        case 'meta':
            return <MetaForm />
        default:
            return null
    }
}
