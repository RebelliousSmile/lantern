import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUiText } from '@/i18n/text'
import { useOtherscapeCharacterStore } from '../../hooks'

export default function BasicForm() {
    const text = useUiText()
    const { otherscapeCharacter, setName } = useOtherscapeCharacterStore()

    return (
        <div className="grid gap-1">
            <Label htmlFor="os-character-name">
                {text('otherscape:forms.character.basic.nameLabel')}
            </Label>
            <Input
                id="os-character-name"
                className="h-8 px-2 text-sm"
                value={otherscapeCharacter.name}
                onChange={(event) => setName(event.target.value)}
                placeholder={text(
                    'otherscape:forms.character.basic.namePlaceholder'
                )}
            />
            <p className="text-xs text-muted-foreground">
                {text('otherscape:forms.character.basic.nameHelp')}
            </p>
        </div>
    )
}
