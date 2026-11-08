import { renderLitmInline } from '@/utils/markdown'
import { ClickableInline } from '../../../shared/preview/components/Clickable'
import {
    useOtherscapeCharacterSheetStore,
    useOtherscapeCharacterStore,
} from '../../hooks'
import { blankTagCombo } from '../../model'
import { printedZoneLabel } from '../../zoneLabels'

/* One row per combo: the tags it joins, the Power it adds and the effect. A
   combo is a single click target, so the editor opens on that combo only. */
export default function CombosBlock() {
    const { otherscapeCharacter, addCombo } = useOtherscapeCharacterStore()
    const { openSheet } = useOtherscapeCharacterSheetStore()
    const combos = otherscapeCharacter.tag_combos

    return (
        <div className="os-character-band os-character-combos">
            <span className="os-rule-label">
                {printedZoneLabel('tag_combos')}
            </span>
            {combos.length > 0 && (
                <ul className="os-character-combos__list">
                    {combos.map((combo, index) => (
                        <li key={index}>
                            <ClickableInline
                                onClick={() =>
                                    openSheet({
                                        kind: 'combo',
                                        index,
                                        mode: 'edit',
                                    })
                                }
                                ariaLabel={`Edit tag combo ${index + 1}`}
                                className="os-character-combo"
                            >
                                <span className="os-character-combo__label">
                                    {combo.label.trim() || (
                                        <span className="os-placeholder">
                                            unnamed combo
                                        </span>
                                    )}
                                </span>
                                <span
                                    className="os-character-combo__tags"
                                    dangerouslySetInnerHTML={{
                                        __html: renderLitmInline(
                                            combo.tags
                                                .map((tag) => `{${tag}}`)
                                                .join(' + ')
                                        ),
                                    }}
                                />
                                <span className="os-character-combo__power">
                                    {printedZoneLabel('power')} {combo.power}
                                </span>
                                <span
                                    className="os-character-combo__effect"
                                    dangerouslySetInnerHTML={{
                                        __html: renderLitmInline(combo.effect),
                                    }}
                                />
                            </ClickableInline>
                        </li>
                    ))}
                </ul>
            )}
            <button
                type="button"
                className="os-character-add"
                onClick={() => {
                    addCombo(blankTagCombo())
                    openSheet({
                        kind: 'combo',
                        index: combos.length,
                        mode: 'create',
                    })
                }}
            >
                add a tag combo
            </button>
        </div>
    )
}
