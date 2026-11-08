import type { ThemeType } from '../../../theme-kit/model'

/* The mark the book prints beside a kit or a power set: the same heart, chip
   and eye Handbook's pack draws, filled in the ink of whatever carries it. Crew
   has no printed mark, so it keeps two standing figures. */
const SHAPES: Record<ThemeType, React.ReactNode> = {
    self: (
        <path d="M12 21.4 3.6 13.2A5.3 5.3 0 0 1 12 6.1a5.3 5.3 0 0 1 8.4 7.1z" />
    ),
    mythos: (
        <path
            fillRule="evenodd"
            d="M12 5c5.2 0 9 4.4 10.5 7-1.5 2.6-5.3 7-10.5 7S3 14.6 1.5 12C3 9.4 6.8 5 12 5m0 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8m0 2.2a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6"
        />
    ),
    noise: (
        <path
            fillRule="evenodd"
            d="M9 2h2v3h2V2h2v3h2a2 2 0 0 1 2 2v2h3v2h-3v2h3v2h-3v2a2 2 0 0 1-2 2h-2v3h-2v-3h-2v3H9v-3H7a2 2 0 0 1-2-2v-2H2v-2h3v-2H2V9h3V7a2 2 0 0 1 2-2h2zm0 6v8h6V8z"
        />
    ),
    crew: (
        <path d="M8 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm8 1a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM2 19v-2a6 6 0 0 1 12 0v2Zm13 0v-2a5 5 0 0 0-1.2-3.3A4.5 4.5 0 0 1 22 17v2Z" />
    ),
}

export function TypeGlyph({
    themeType,
    className,
}: {
    themeType: ThemeType
    className?: string
}) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
            focusable="false"
        >
            {SHAPES[themeType]}
        </svg>
    )
}
