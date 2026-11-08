/* The book's rating mark: a crosshair, a ring with four ticks standing out of
   it and a dot at its heart. The `⊕` character only approximates it. Shared
   by the Challenge's tab and the Power Set's added rating, which print the
   same mark. */
function RatingMark({ className }: { className: string }) {
    return (
        <svg className={className} viewBox="0 0 16 16" aria-hidden="true">
            <circle
                cx="8"
                cy="8"
                r="4.6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            />
            <path
                d="M8 0.5v4M8 11.5v4M0.5 8h4M11.5 8h4"
                stroke="currentColor"
                strokeWidth="2"
            />
            <circle cx="8" cy="8" r="1.2" fill="currentColor" />
        </svg>
    )
}

export function RatingMarks({
    count,
    className,
}: {
    count: number
    className: string
}) {
    return (
        <>
            {Array.from({ length: count }, (_, index) => (
                <RatingMark key={index} className={className} />
            ))}
        </>
    )
}
