import 'i18next'
import type { resources } from './index'
import type { NAMESPACES } from './namespaces'

declare module 'i18next' {
    interface CustomTypeOptions {
        /*
         * Every namespace, not just `common`. i18next resolves a bare key against the first entry
         * and a prefixed one (`legend:challenge.label`) against its own namespace, so declaring the
         * whole tuple types a component's `t` the way the runtime already behaves — without each
         * call site having to repeat its game's namespace.
         */
        defaultNS: typeof NAMESPACES
        resources: (typeof resources)['en']
    }
}
