import { Button } from '@/components/ui/button'
import type { AnyTemplateDefinition } from '@/core/templates/types'
import { useUiText } from '@/i18n/text'

type TemplateLandingProps = {
    template: AnyTemplateDefinition
    onStartBlank: () => void
    onStartExample: () => void
    onImport: () => void
}

export function TemplateLanding({
    template,
    onStartBlank,
    onStartExample,
    onImport,
}: TemplateLandingProps) {
    const text = useUiText()
    const { landing } = template

    return (
        // Opaque, not a tint: the panel floats over whatever ground the active
        // game paints, and a translucent one left the description unreadable on
        // the darker backgrounds.
        <div className="rounded-lg border bg-card/95 p-4 shadow-sm backdrop-blur-sm">
            <h2 className="text-lg font-semibold">{text(landing.newTitle)}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
                {text(landing.description)}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={onStartExample}>
                    {text(landing.exampleLabel ?? 'landing.startExample')}
                </Button>
                <Button variant="outline" onClick={onStartBlank}>
                    {text(landing.blankLabel ?? 'landing.startBlank')}
                </Button>
                <Button
                    variant="outline"
                    onClick={onImport}
                    disabled={!template.io.importToml}
                >
                    {text(landing.importLabel ?? 'landing.importToml')}
                </Button>
            </div>
        </div>
    )
}
