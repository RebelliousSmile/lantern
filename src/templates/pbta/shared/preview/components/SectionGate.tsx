/* A shared gate cannot read one template's store, so the caller resolves
   `show` against its own document and view and passes the answer down. */
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
