import { Button } from '@/components/ui/button'
import type { AnyTemplateDefinition } from '@/core/templates/types'

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
    return (
        // Opaque, not a tint: the panel floats over whatever ground the active
        // game paints, and a translucent one left the description unreadable on
        // the darker backgrounds.
        <div className="rounded-lg border bg-card/95 p-4 shadow-sm backdrop-blur-sm">
            <h2 className="text-lg font-semibold">New {template.label}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
                {template.landing.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={onStartExample}>
                    {template.landing.exampleLabel ?? 'Start with example'}
                </Button>
                <Button variant="outline" onClick={onStartBlank}>
                    {template.landing.blankLabel ?? 'Start blank'}
                </Button>
                <Button
                    variant="outline"
                    onClick={onImport}
                    disabled={!template.io.importToml}
                >
                    {template.landing.importLabel ?? 'Import TOML'}
                </Button>
            </div>
        </div>
    )
}
