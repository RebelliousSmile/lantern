import SharedSpecialBlock from '../../../shared/preview/SpecialBlock'
import {
    useOtherscapeThemeKitSheetStore,
    useOtherscapeThemeKitStore,
} from '../../hooks'

export default function SpecialBlock() {
    const { otherscapeThemeKit } = useOtherscapeThemeKitStore()
    const { openSheet } = useOtherscapeThemeKitSheetStore()

    return (
        <SharedSpecialBlock
            special={otherscapeThemeKit.special}
            onOpen={() => openSheet({ kind: 'special', mode: 'edit' })}
        />
    )
}
