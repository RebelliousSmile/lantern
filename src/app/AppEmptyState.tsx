import { FileDown, Layers, MousePointerClick, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'

/* The first screen a bare `/` shows, and the only place the app explains
   itself: every other view already has a document in it. It used to spend its
   whole lower half on an early-development warning, which told a first-time
   visitor nothing about how to use the tool. The four steps below are the
   actual path through the app, in order. */
const STEPS = [
    { id: 'pack', icon: Layers },
    { id: 'template', icon: Sparkles },
    { id: 'edit', icon: MousePointerClick },
    { id: 'export', icon: FileDown },
] as const

export default function AppEmptyState() {
    const { t } = useTranslation()

    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center py-10 text-center">
            <img
                src="/lantern-logo.svg"
                alt={t('sidebar.logoAlt')}
                className="mb-4 h-20 w-20"
            />
            <h2 className="text-xl font-semibold">{t('emptyState.title')}</h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                {t('emptyState.intro')}
            </p>

            <div className="mt-8 grid w-full max-w-3xl gap-3 text-left sm:grid-cols-2">
                {STEPS.map((step) => (
                    <div
                        key={step.id}
                        className="rounded-lg border bg-card/95 p-4 shadow-sm"
                    >
                        <div className="flex items-center gap-2">
                            <step.icon className="size-4 shrink-0 text-muted-foreground" />
                            <h3 className="text-sm font-semibold">
                                {t(`emptyState.steps.${step.id}.title`)}
                            </h3>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {t(`emptyState.steps.${step.id}.body`)}
                        </p>
                    </div>
                ))}
            </div>

            <p className="mt-6 max-w-2xl text-xs text-muted-foreground">
                {t('emptyState.localOnly')}
            </p>
            <p className="mt-2 max-w-2xl text-xs text-muted-foreground">
                {t('emptyState.copyright')}
            </p>
        </div>
    )
}
