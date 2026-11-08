/* One kit as the book lists it in a trope: the name, then its category and
   page in brackets, "Hacker (EXPERTISE, p. 238)". Granted kits and choices
   print the same line; only what stands in front of it differs. */
export function KitLine({
    title,
    category,
    page,
}: {
    title: string
    category: string
    page?: number | null
}) {
    const source = [
        category.trim() ? category.toUpperCase() : '',
        page != null ? `p. ${page}` : '',
    ]
        .filter(Boolean)
        .join(', ')

    return (
        <span className="character-trope-kit">
            <span className="character-trope-kit__title">
                {title || 'Untitled kit'}
            </span>
            {source && (
                <span className="character-trope-kit__source"> ({source})</span>
            )}
        </span>
    )
}
