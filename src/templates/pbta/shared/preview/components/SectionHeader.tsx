type Props = {
    title: string
    align?: 'center' | 'left'
    onClick?: () => void
}

/* PbtA playbooks head a region with a small caps label and a rule running off
   it, never a centred rule with the label cut into it, so `left` is the
   default here. Class names are the `pbta-` prefixed primitives declared in
   `shared/tokens.css` - the unprefixed City names would match no rule. */
export function SectionHeader({ title, align = 'left', onClick }: Props) {
    const base =
        (align === 'center' ? 'pbta-section--center' : 'pbta-section--left') +
        ' relative group w-full text-left'

    const content =
        align === 'center' ? (
            <>
                <div className="pbta-section-line" />
                <div className="pbta-section-title">{title}</div>
                <div className="pbta-section-line" />
            </>
        ) : (
            <>
                <div className="pbta-section-title">{title}</div>
                <div className="pbta-section-line" />
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
