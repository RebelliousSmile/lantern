/* Deliberately dumb: a shared gate cannot read one template's store, so the
   caller resolves `shouldShow` against its own document and view and passes the
   answer down. That keeps a single gate for the six Otherscape templates
   instead of one pair of gates per template. */
export function SectionGate({
    show,
    children,
}: {
    show: boolean
    children: React.ReactNode
}) {
    if (!show) return null
    return <>{children}</>
}
