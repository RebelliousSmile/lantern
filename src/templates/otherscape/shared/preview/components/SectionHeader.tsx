type Props = {
    title: string
    align?: 'center' | 'left'
    onClick?: () => void
}

/* The book heads a region with a small caps label and a rule running off it,
   never a centred rule with the label cut into it, so `left` is the default
   here where the Legend card centres. */
export function SectionHeader({ title, align = 'left', onClick }: Props) {
    const base =
        (align === 'center' ? 'section--center' : 'section--left') +
        ' relative group w-full text-left'

    const content =
        align === 'center' ? (
            <>
                <div className="section-line" />
                <div className="section-title">{title}</div>
                <div className="section-line" />
            </>
        ) : (
            <>
                <div className="section-title">{title}</div>
                <div className="section-line" />
            </>
        )

    if (onClick) {
        return (
            <button
                type="button"
                onClick={onClick}
                aria-label={`Edit ${title}`}
                className={base}
            >
                {content}
            </button>
        )
    }

    return <div className={base}>{content}</div>
}
