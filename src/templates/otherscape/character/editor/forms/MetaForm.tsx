import { MetaFields } from '../../../theme/editor/forms/MetaForm'
import { useOtherscapeCharacterStore } from '../../hooks'

export default function MetaForm() {
    const { otherscapeCharacter, updateMeta } = useOtherscapeCharacterStore()

    return (
        <MetaFields
            idPrefix="os-character"
            meta={otherscapeCharacter.meta}
            updateMeta={updateMeta}
        />
    )
}
