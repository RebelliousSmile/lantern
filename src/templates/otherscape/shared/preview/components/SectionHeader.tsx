type Props = {
    title: string
    align?: 'center' | 'left' | 'end'
    onClick?: () => void
}

/* The book heads a region with a small caps label and a rule running off it,
   never a centred rule with the label cut into it, so `left` is the default
   here where the Legend card centres. The Tokyo cards run the rule in from the
   left and set the label flush right: that is `end`. */
export function SectionHeader({ title, align = 'left', onClick }: Props) {
    const base =
        `section--${align}` +
        ' relative group w-full ' +
        (align === 'end' ? 'text-right' : 'text-left')

    const content =
        align === 'center' ? (
            <>
                <div className="section-line" />
                <div className="section-title">{title}</div>
                <div className="section-line" />
            </>
        ) : align === 'end' ? (
            <>
                <div className="section-line" />
                <div className="section-title">{title}</div>
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
