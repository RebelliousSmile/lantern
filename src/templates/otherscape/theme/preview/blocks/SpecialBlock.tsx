import SharedSpecialBlock from '../../../shared/preview/SpecialBlock'
import {
    useOtherscapeThemeSheetStore,
    useOtherscapeThemeStore,
} from '../../hooks'

export default function SpecialBlock() {
    const { otherscapeTheme } = useOtherscapeThemeStore()
    const { openSheet } = useOtherscapeThemeSheetStore()

    return (
        <SharedSpecialBlock
            special={otherscapeTheme.special}
            onOpen={() => openSheet({ kind: 'special', mode: 'edit' })}
        />
    )
}
