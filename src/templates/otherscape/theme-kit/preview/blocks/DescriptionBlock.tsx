import SharedDescriptionBlock from '../../../shared/preview/DescriptionBlock'
import {
    useOtherscapeThemeKitSheetStore,
    useOtherscapeThemeKitStore,
} from '../../hooks'

export default function DescriptionBlock() {
    const { otherscapeThemeKit } = useOtherscapeThemeKitStore()
    const { openSheet } = useOtherscapeThemeKitSheetStore()

    return (
        <SharedDescriptionBlock
            description={otherscapeThemeKit.description}
            onOpen={() => openSheet({ kind: 'description', mode: 'edit' })}
        />
    )
}
