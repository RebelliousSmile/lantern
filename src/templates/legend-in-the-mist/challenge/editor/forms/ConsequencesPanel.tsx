import { SystemMarkdownScope } from '@/components/markdown/SystemMarkdownScope'
import { Button } from '@/components/ui/button'
import { renderLitmMarkdown } from '@/utils/markdown'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { ArrowLeft, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import type { Threat } from '../../model'
import {
    ConsequenceRow,
    InlineConsequenceEditor,
} from './threatEditorPrimitives'

type Panel =
    | { kind: 'threats' }
    | { kind: 'cons'; tIdx: number }
    | { kind: 'general' }

export function ConsequencesPanel({
    panel,
    threat,
    consequenceIds,
    generalConsequences,
    generalIds,
    editingConsequence,
    editingGeneralConsequence,
    dragDisabled,
    onBack,
    onAddConsequence,
    onSaveConsequence,
    onEditConsequence,
    onRemoveConsequence,
    onAddGeneral,
    onSaveGeneral,
    onEditGeneral,
    onRemoveGeneral,
}: {
    panel: Panel
    threat: Threat | null
    consequenceIds: string[]
    generalConsequences: string[]
    generalIds: string[]
    editingConsequence: number | null
    editingGeneralConsequence: number | null
    dragDisabled: boolean
    onBack: () => void
    onAddConsequence: () => void
    onSaveConsequence: (index: number, value: string) => void
    onEditConsequence: (index: number | null) => void
    onRemoveConsequence: (index: number) => void
    onAddGeneral: () => void
    onSaveGeneral: (index: number, value: string) => void
    onEditGeneral: (index: number | null) => void
    onRemoveGeneral: (index: number) => void
}) {
    const { t } = useTranslation()
    if (panel.kind === 'cons' && threat)
        return (
            <ThreatConsequences
                threat={threat}
                ids={consequenceIds}
                editing={editingConsequence}
                dragDisabled={dragDisabled}
                onBack={onBack}
                onAdd={onAddConsequence}
                onSave={onSaveConsequence}
                onEdit={onEditConsequence}
                onRemove={onRemoveConsequence}
            />
        )
    if (panel.kind === 'general')
        return (
            <GeneralConsequences
                values={generalConsequences}
                ids={generalIds}
                editing={editingGeneralConsequence}
                dragDisabled={dragDisabled}
                onBack={onBack}
                onAdd={onAddGeneral}
                onSave={onSaveGeneral}
                onEdit={onEditGeneral}
                onRemove={onRemoveGeneral}
            />
        )
    return (
        <div className="flex items-center justify-center text-muted-foreground">
            {t('legend:forms.challenge.consequencesPanel.selectThreatPrompt')}
        </div>
    )
}

function ThreatConsequences({
    threat,
    ids,
    editing,
    dragDisabled,
    onBack,
    onAdd,
    onSave,
    onEdit,
    onRemove,
}: {
    threat: Threat
    ids: string[]
    editing: number | null
    dragDisabled: boolean
    onBack: () => void
    onAdd: () => void
    onSave: (index: number, value: string) => void
    onEdit: (index: number | null) => void
    onRemove: (index: number) => void
}) {
    const { t } = useTranslation()
    const [draft, setDraft] = useState('')
    useEffect(
        () =>
            setDraft(
                editing === null ? '' : (threat.consequences[editing] ?? '')
            ),
        [editing, threat.consequences]
    )
    function save() {
        if (editing === null) return
        const value = draft.trim()
        if (!value)
            return toast.error(
                t(
                    'legend:forms.challenge.consequencesPanel.consequenceEmptyError'
                )
            )
        onSave(editing, value)
    }
    return (
        <div className="w-full min-w-0 space-y-3 pl-2">
            <PanelTitle onBack={onBack}>
                {t(
                    'legend:forms.challenge.consequencesPanel.consequencesForTitle',
                    {
                        name: threat.name,
                    }
                )}
            </PanelTitle>
            {threat.description ? (
                <SystemMarkdownScope
                    className="text-sm text-foreground/80 prose-sm max-w-none"
                    as="div"
                >
                    <div
                        dangerouslySetInnerHTML={{
                            __html: renderLitmMarkdown(threat.description),
                        }}
                    />
                </SystemMarkdownScope>
            ) : null}
            <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                <ul className="space-y-1.5">
                    {threat.consequences.map((value, index) => (
                        <ConsequenceRow
                            key={ids[index]}
                            id={ids[index]}
                            text={value}
                            dragDisabled={dragDisabled}
                            isEditing={editing === index}
                            onEdit={() => onEdit(index)}
                            onRemove={() =>
                                threat.consequences.length <= 1
                                    ? toast.error(
                                          t(
                                              'legend:forms.challenge.consequencesPanel.consequenceMinError'
                                          )
                                      )
                                    : onRemove(index)
                            }
                        >
                            {editing === index ? (
                                <InlineConsequenceEditor
                                    value={draft}
                                    onChange={setDraft}
                                    onSave={save}
                                    onCancel={() => onEdit(null)}
                                />
                            ) : null}
                        </ConsequenceRow>
                    ))}
                    <AddButton onClick={onAdd}>
                        {t(
                            'legend:forms.challenge.consequencesPanel.addConsequence'
                        )}
                    </AddButton>
                </ul>
            </SortableContext>
        </div>
    )
}

function GeneralConsequences({
    values,
    ids,
    editing,
    dragDisabled,
    onBack,
    onAdd,
    onSave,
    onEdit,
    onRemove,
}: {
    values: string[]
    ids: string[]
    editing: number | null
    dragDisabled: boolean
    onBack: () => void
    onAdd: () => void
    onSave: (index: number, value: string) => void
    onEdit: (index: number | null) => void
    onRemove: (index: number) => void
}) {
    const { t } = useTranslation()
    const [draft, setDraft] = useState('')
    useEffect(
        () => setDraft(editing === null ? '' : (values[editing] ?? '')),
        [editing, values]
    )
    return (
        <div className="w-full min-w-0 space-y-3 pl-2">
            <PanelTitle onBack={onBack}>
                {t('legend:challenge.sections.generalConsequences')}
            </PanelTitle>
            <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                <ul className="space-y-1.5">
                    {values.map((value, index) => (
                        <ConsequenceRow
                            key={ids[index]}
                            id={ids[index]}
                            text={value}
                            dragDisabled={dragDisabled}
                            isEditing={editing === index}
                            onEdit={() => onEdit(index)}
                            onRemove={() => onRemove(index)}
                        >
                            {editing === index ? (
                                <InlineConsequenceEditor
                                    value={draft}
                                    onChange={setDraft}
                                    onSave={() => {
                                        if (editing !== null)
                                            onSave(editing, draft.trim())
                                    }}
                                    onCancel={() => onEdit(null)}
                                />
                            ) : null}
                        </ConsequenceRow>
                    ))}
                    <AddButton onClick={onAdd}>
                        {t(
                            'legend:forms.challenge.consequencesPanel.addGeneralConsequence'
                        )}
                    </AddButton>
                </ul>
            </SortableContext>
        </div>
    )
}

function PanelTitle({
    children,
    onBack,
}: {
    children: React.ReactNode
    onBack: () => void
}) {
    const { t } = useTranslation()
    return (
        <div className="flex items-center gap-2">
            <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={onBack}
            >
                <ArrowLeft className="mr-1 h-3.5 w-3.5" />{' '}
                {t('legend:forms.challenge.consequencesPanel.back')}
            </Button>
            <div className="font-semibold">{children}</div>
        </div>
    )
}

function AddButton({
    children,
    onClick,
}: {
    children: React.ReactNode
    onClick: () => void
}) {
    return (
        <li className="flex">
            <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-1 h-8 w-full justify-center gap-1.5 border-dashed px-2.5 text-xs"
                onClick={onClick}
            >
                <Plus className="h-3.5 w-3.5" /> {children}
            </Button>
        </li>
    )
}
