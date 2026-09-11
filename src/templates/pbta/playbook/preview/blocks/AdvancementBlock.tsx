import { ClickableSection } from '../../../shared/preview/components/Clickable'
import { usePlaybookStore } from '../../hooks'
import { SimpleList } from '../components/DefinitionList'

export default function AdvancementBlock({ onClick }: { onClick: () => void }) {
    const { playbook } = usePlaybookStore()

    return (
        <ClickableSection onClick={onClick} ariaLabel="Edit advancement">
            <div className="pbta-pb-section">
                <SimpleList
                    items={playbook.advancement}
                    emptyLabel="No advancement options defined."
                />
            </div>
        </ClickableSection>
    )
}
