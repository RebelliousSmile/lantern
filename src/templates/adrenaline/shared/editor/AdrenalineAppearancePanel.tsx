import { useUiText } from '@/i18n/text'

export function AdrenalineAppearancePanel() {
    const text = useUiText()
    return (
        <p className="p-2 text-sm text-muted-foreground">
            {text('adrenaline:appearance.printedProportions')}
        </p>
    )
}
