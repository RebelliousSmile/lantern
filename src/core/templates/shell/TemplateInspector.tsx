import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { SidebarContent, SidebarFooter } from '@/components/ui/sidebar'
import { useUiText } from '@/i18n/text'
import { useActiveTab, useActiveTemplate } from '@/core/workspace/selectors'
import { useTranslation } from 'react-i18next'
import { TemplateExportPanel } from './TemplateExportPanel'

export function TemplateInspector() {
    const { t } = useTranslation()
    const activeTemplate = useActiveTemplate()
    const activeTab = useActiveTab()
    const text = useUiText()

    if (!activeTemplate || !activeTemplate.implemented) {
        return null
    }
    const target = (activeTab?.sheet as { target?: string } | undefined)
        ?.target
    const activeSection = activeTemplate.sections.find(
        (section) => section.id === target
    )

    return (
        // The shared inspector keeps layout and accordions consistent while
        // delegating the actual editor/appearance panels to the template module.
        <div className="flex min-h-0 max-h-[calc(100svh-6rem)] flex-col overflow-hidden rounded-2xl">
            <SidebarContent className="min-h-0 flex-1 px-3 py-2 [scrollbar-width:thin] [scrollbar-color:rgba(100,116,139,0.28)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/35 hover:[&::-webkit-scrollbar-thumb]:bg-border/50">
                <Accordion
                    type="multiple"
                    defaultValue={['editor']}
                    className="w-full"
                >
                    <AccordionItem value="editor">
                        <AccordionTrigger className="py-3 text-sm">
                            {t('inspector.editor')}
                            {activeSection
                                ? ` · ${text(activeSection.label)}`
                                : ''}
                        </AccordionTrigger>
                        <AccordionContent className="pb-3">
                            <div className="[&_input[data-slot=input]]:text-xs [&_textarea[data-slot=textarea]]:text-xs [&_textarea[data-slot=textarea]]:leading-snug">
                                {activeTemplate.editor.renderPanel()}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </SidebarContent>

            <div className="shrink-0 border-t bg-background/95 px-3 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/80">
                <Accordion type="multiple" defaultValue={[]} className="w-full">
                    <AccordionItem value="appearance">
                        <AccordionTrigger className="py-2 text-sm">
                            {t('inspector.appearance')}
                        </AccordionTrigger>
                        <AccordionContent className="pb-2">
                            {activeTemplate.appearance.renderPanel()}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            <SidebarFooter className="shrink-0 border-t bg-background/95 px-3 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/80">
                <Accordion
                    type="multiple"
                    defaultValue={['export']}
                    className="w-full"
                >
                    <AccordionItem value="export">
                        <AccordionTrigger className="py-2 text-sm">
                            {t('inspector.export')}
                        </AccordionTrigger>
                        <AccordionContent className="pb-2">
                            <TemplateExportPanel />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </SidebarFooter>
        </div>
    )
}
