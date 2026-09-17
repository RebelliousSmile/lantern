import { RadioGroup,RadioGroupItem } from '@/components/ui/radio-group'
import { useMonsterheartsView } from '../hooks'
export function MonsterheartsPlaybookImageExportSettings(){const {exportPrefs,setExportPrefs}=useMonsterheartsView();return <RadioGroup value={String(exportPrefs.scale)} onValueChange={v=>setExportPrefs(Number(v) as 1|2|3)}>{[1,2,3].map(n=><label key={n}><RadioGroupItem value={String(n)}/> {n}x</label>)}</RadioGroup>}
