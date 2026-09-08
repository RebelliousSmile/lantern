import {
    useOtherscapeThemeKitSheetStore,
    useOtherscapeThemeKitStore,
    type PublicationType,
} from '../../hooks'

const TYPE_LABEL: Record<PublicationType, string> = {
    official: 'Official',
    third_party: 'Third Party',
    cauldron: 'Cauldron',
    homebrew: 'Homebrew',
}

export default function MetaFooterBlock() {
    const { otherscapeThemeKit } = useOtherscapeThemeKitStore()
    const { openSheet } = useOtherscapeThemeKitSheetStore()
    const m = otherscapeThemeKit.meta

    /* `publication_type` is left out of this test on purpose: the document
       always carries one, so it can never be what makes the footer worth
       printing. */
    const hasAny =
        !!m?.source ||
        (m?.authors != null && m.authors.length > 0) ||
        m?.page != null

    const typeLabel = m?.publication_type
        ? TYPE_LABEL[m.publication_type]
        : undefined

    return (
        <div className="theme-kit-meta mt-3">
            <button
                type="button"
                onClick={() => openSheet({ kind: 'meta', mode: 'edit' })}
                className="w-full"
                aria-label="Edit meta"
                title="Edit meta"
            >
                <div className="meta-footer group mx-auto text-center">
                    {hasAny ? (
                        <div className="inline-flex items-center gap-2 rounded-md px-2 py-1 transition-colors group-hover:bg-white/10">
                            {typeLabel && (
                                <span className="badge">{typeLabel}</span>
                            )}
                            {m?.source && (
                                <span className="font-semibold truncate">
                                    {m.source}
                                </span>
                            )}
                            {m?.authors && m.authors.length > 0 && (
                                <span>by {m.authors.join(', ')}</span>
                            )}
                            {m?.page != null && <span> (p.{m.page})</span>}
                        </div>
                    ) : (
                        <span className="text-xs cursor-pointer text-muted-foreground underline decoration-dotted">
                            add attribution (type, source, authors, page)
                        </span>
                    )}
                </div>
            </button>
        </div>
    )
}
