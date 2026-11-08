import { ClickableSection } from '../../../shared/preview/components/Clickable'
import { useOtherscapeCharacterSheetStore } from '../../hooks'
import { printedZoneLabel } from '../../zoneLabels'

/* The rule the sheet prints under the same words for every character. It is
   not part of the file; it comes from the published schema. */
export default function UpgradesBlock() {
    const { openSheet } = useOtherscapeCharacterSheetStore()

    return (
        <ClickableSection
            onClick={() => openSheet({ kind: 'upgrades', mode: 'edit' })}
            ariaLabel={printedZoneLabel('upgrades')}
        >
            <div className="os-character-band os-character-upgrades">
                <span className="os-rule-label">
                    {printedZoneLabel('upgrades')}
                </span>
                <p className="os-character-upgrades__rule">
                    {printedZoneLabel('upgrades_rule')}
                </p>
                <ul className="os-character-upgrades__options">
                    <li>
                        <span className="os-character-box" aria-hidden />
                        {printedZoneLabel('upgrade_power_tag')}
                    </li>
                    <li>
                        <span className="os-character-box" aria-hidden />
                        {printedZoneLabel('upgrade_special')}
                    </li>
                </ul>
            </div>
        </ClickableSection>
    )
}
