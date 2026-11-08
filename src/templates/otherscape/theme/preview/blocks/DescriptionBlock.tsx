import SharedDescriptionBlock from '../../../shared/preview/DescriptionBlock'
import {
    useOtherscapeThemeSheetStore,
    useOtherscapeThemeStore,
} from '../../hooks'

export default function DescriptionBlock() {
    const { otherscapeTheme } = useOtherscapeThemeStore()
    const { openSheet } = useOtherscapeThemeSheetStore()

    return (
        <SharedDescriptionBlock
            description={otherscapeTheme.description}
            onOpen={() => openSheet({ kind: 'description', mode: 'edit' })}
        />
    )
}
