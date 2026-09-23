import {
    createContext,
    Component,
    lazy,
    Suspense,
    useContext,
    type ComponentType,
    type LazyExoticComponent,
    type ReactNode,
} from 'react'
import { loadTemplateDefinition } from './templateLoader'
import type {
    AnyStaticTemplateDefinition,
    AnyTemplateDefinition,
} from './types'

const TemplateModuleContext = createContext<AnyTemplateDefinition | null>(null)

type LoadedTemplateProviderProps = {
    template: AnyStaticTemplateDefinition
    children: ReactNode
}

const providers = new Map<
    string,
    LazyExoticComponent<ComponentType<LoadedTemplateProviderProps>>
>()

type ModuleErrorBoundaryProps = {
    fallback: ReactNode
    children: ReactNode
}

type ModuleErrorBoundaryState = { failed: boolean }

class ModuleErrorBoundary extends Component<
    ModuleErrorBoundaryProps,
    ModuleErrorBoundaryState
> {
    state: ModuleErrorBoundaryState = { failed: false }

    static getDerivedStateFromError(): ModuleErrorBoundaryState {
        return { failed: true }
    }

    render() {
        return this.state.failed ? this.props.fallback : this.props.children
    }
}

function providerFor(templateId: string) {
    const existing = providers.get(templateId)
    if (existing) return existing

    const Provider = lazy(async () => {
        const module = await loadTemplateDefinition(templateId)
        if (!module) {
            throw new Error(`template ${templateId} has no lazy module loader`)
        }

        return {
            default: function LoadedTemplateProvider({
                template,
                children,
            }: LoadedTemplateProviderProps) {
                return (
                    <TemplateModuleContext.Provider
                        value={{ ...template, ...module.default }}
                    >
                        {children}
                    </TemplateModuleContext.Provider>
                )
            },
        }
    })
    providers.set(templateId, Provider)
    return Provider
}

type TemplateModuleBoundaryProps = {
    template: AnyStaticTemplateDefinition | null
    fallback: ReactNode
    errorFallback?: ReactNode
    children: ReactNode
}

/**
 * Keeps template code out of the application entry chunk while supplying one
 * resolved template to the preview, import dialog and inspector.
 */
export function TemplateModuleBoundary({
    template,
    fallback,
    errorFallback = fallback,
    children,
}: TemplateModuleBoundaryProps) {
    if (!template?.implemented) {
        return (
            <TemplateModuleContext.Provider value={null}>
                {children}
            </TemplateModuleContext.Provider>
        )
    }

    const Provider = providerFor(template.id)
    return (
        <ModuleErrorBoundary key={template.id} fallback={errorFallback}>
            <Suspense fallback={fallback}>
                <Provider template={template}>{children}</Provider>
            </Suspense>
        </ModuleErrorBoundary>
    )
}

export function useResolvedTemplate() {
    return useContext(TemplateModuleContext)
}
