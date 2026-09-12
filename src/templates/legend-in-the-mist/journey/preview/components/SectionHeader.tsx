type Props = {
    title: string
    align?: 'center' | 'left'
    onClick?: () => void
}

/* The spread carries no rules around its headings: a letterspaced small-caps
   line in maroon is the whole device, centred over a vignette and flush left
   over a column. */
export function SectionHeader({ title, align = 'left', onClick }: Props) {
    const className = [
        'journey-heading',
        align === 'center'
            ? 'journey-heading--center'
            : 'journey-heading--left',
    ].join(' ')

    if (onClick) {
        return (
            <button
                type="button"
                onClick={onClick}
                aria-label={`Edit ${title}`}
                className={`${className} journey-heading--button`}
            >
                {title}
            </button>
        )
    }

    return <div className={className}>{title}</div>
}
