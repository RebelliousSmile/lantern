import { createImageExportAction } from '@/core/templates/shell/imageExportAction'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { toast } from 'sonner'
import { MonsterheartsPlaybookAppearancePanel } from './editor/MonsterheartsPlaybookAppearancePanel'
import { MonsterheartsPlaybookEditorPanel } from './editor/MonsterheartsPlaybookEditorPanel'
import { MonsterheartsPlaybookImageExportSettings } from './editor/MonsterheartsPlaybookImageExportSettings'
import { blankPlaybook,defaultSheet,defaultView,sections,type MonsterheartsPlaybook,type ViewState } from './model'
import { MonsterheartsPlaybookPreview } from './preview/MonsterheartsPlaybookPreview'
import { getSampleMonsterheartsPlaybook } from './sample'
import { exportToTOML,importFromTOMLWithWarnings } from './toml'
const clone=<T,>(x:T):T=>structuredClone(x)
const template:AnyTemplateDefinition={id:'monsterhearts.playbook',gameId:'monsterhearts',gameLabel:'Monsterhearts',label:'Skin',implemented:true,contractKey:'pbta/monsterhearts-playbook',createBlank:blankPlaybook,createExample:getSampleMonsterheartsPlaybook,createInitialView:()=>clone(defaultView),createInitialSheet:()=>clone(defaultSheet),getTabTitle:(d:MonsterheartsPlaybook)=>d.name,sections,landing:{description:'Create an original Monsterhearts skin.',exampleLabel:'Start with example',blankLabel:'Start blank',importLabel:'Import TOML'},io:{importToml:(t)=>{const {playbook,warnings}=importFromTOMLWithWarnings(t);return {doc:playbook,warnings,previewName:playbook.name}},exportToml:exportToTOML},preview:{getRootSelector:(id)=>`[data-preview-root="${id}"]`,render:()=> <MonsterheartsPlaybookPreview/>},editor:{emptyState:'Click a skin section to edit it.',renderPanel:()=> <MonsterheartsPlaybookEditorPanel/>},appearance:{getPreviewWidth:(v:ViewState)=>v.previewWidth,renderPanel:()=> <MonsterheartsPlaybookAppearancePanel/>},export:{actions:[{id:'toml',label:'TOML',buttonLabel:'Export TOML',description:'Export this skin as TOML.',run:({doc,fileStem}:{doc:MonsterheartsPlaybook;fileStem:string})=>{try{const url=URL.createObjectURL(new Blob([exportToTOML(doc)]));const a=document.createElement('a');a.href=url;a.download=`${fileStem}.toml`;a.click();URL.revokeObjectURL(url);toast.success('Exported TOML.')}catch(e:any){toast.error(e?.message||'Failed to export TOML.')}}},createImageExportAction({description:'Export this skin as PNG.',renderSettings:()=> <MonsterheartsPlaybookImageExportSettings/>})]}}
export default template
