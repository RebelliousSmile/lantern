import { cn } from '@/utils/cn'
import { renderLitmInline } from '@/utils/markdown'
import { ClickableInline } from '../../../shared/preview/components/Clickable'
import {
    useOtherscapeCharacterSheetStore,
    useOtherscapeCharacterStore,
} from '../../hooks'
import { blankLoadoutItem } from '../../model'
import { printedZoneLabel } from '../../zoneLabels'

/* What the character carries. An item that is not loaded stays on the sheet,
   dimmed: it is gear the character owns but has not brought. A file that never
   says whether an item is loaded reads as not loaded. */
export default function LoadoutBlock() {
    const { otherscapeCharacter, addLoadoutItem } =
        useOtherscapeCharacterStore()
    const { openSheet } = useOtherscapeCharacterSheetStore()
    const loadout = otherscapeCharacter.loadout

    return (
        <div className="os-character-band os-character-loadout">
            <span className="os-rule-label">{printedZoneLabel('loadout')}</span>
            {loadout.length > 0 && (
                <ul className="os-character-loadout__list">
                    {loadout.map((item, index) => {
                        const loaded = item.loaded === true
                        const weakness = item.weakness_tag.trim()
                        const tags = item.feature_tags
                            .map((tag) => `{${tag}}`)
                            .concat(weakness ? [`{!${weakness}}`] : [])
                            .join(' ')
                        return (
                            <li key={index}>
                                <ClickableInline
                                    onClick={() =>
                                        openSheet({
                                            kind: 'loadout',
                                            index,
                                            mode: 'edit',
                                        })
                                    }
                                    ariaLabel={`Edit loadout item ${index + 1}`}
                                    className={cn(
                                        'os-character-item',
                                        loaded ? 'is-loaded' : 'is-unloaded'
                                    )}
                                >
                                    <span
                                        className="os-character-item__box"
                                        data-loaded={loaded}
                                        aria-hidden
                                    />
                                    <span className="os-character-item__name">
                                        {item.name}
                                    </span>
                                    <span
                                        className="os-character-item__tags"
                                        dangerouslySetInnerHTML={{
                                            __html: renderLitmInline(tags),
                                        }}
                                    />
                                </ClickableInline>
                            </li>
                        )
                    })}
                </ul>
            )}
            <button
                type="button"
                className="os-character-add"
                onClick={() => {
                    addLoadoutItem(blankLoadoutItem())
                    openSheet({
                        kind: 'loadout',
                        index: loadout.length,
                        mode: 'create',
                    })
                }}
            >
                add a loadout item
            </button>
        </div>
    )
}
