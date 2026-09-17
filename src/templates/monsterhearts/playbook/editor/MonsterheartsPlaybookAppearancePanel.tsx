import { Checkbox } from '@/components/ui/checkbox'
import { sections } from '../model'
import { useMonsterheartsView } from '../hooks'
export function MonsterheartsPlaybookAppearancePanel(){const {hidden,setHidden}=useMonsterheartsView();return <div className="space-y-2">{sections.map(s=><label className="flex gap-2" key={s.id}><Checkbox checked={!hidden[s.id]} onCheckedChange={v=>setHidden(s.id,!v)}/>{s.label}</label>)}</div>}
