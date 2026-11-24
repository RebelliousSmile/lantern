import type { CSSProperties } from 'react'
import { FoldablePage } from '../FoldablePage'
import { NOTES_BODY_ATTRIBUTE } from './notesFit'
import './notesPage.css'

/**
 * The notes page as it prints: a sheet of fixed size holding the free text. It is marked as an
 * export page so it leaves as one image, or on one printed sheet, of its own.
 */
export function NotesPage({
    id,
    title,
    value,
    className,
    style,
    onOpen,
}: {
    id: string
    title: string
    value: string | undefined
    /** The classes of the sheet this page belongs to, so it carries the same paper. */
    className?: string
    style?: CSSProperties
    onOpen?: () => void
}) {
    return (
        <FoldablePage label={title}>
            <article
                className={['lantern-notes-page', className]
                    .filter(Boolean)
                    .join(' ')}
                style={style}
                data-export-page={id}
            >
                <h4 className="lantern-notes-page__title">{title}</h4>
                <div
                    className="lantern-notes-page__body"
                    {...{ [NOTES_BODY_ATTRIBUTE]: '' }}
                    role={onOpen ? 'button' : undefined}
                    tabIndex={onOpen ? 0 : undefined}
                    onClick={onOpen}
                    onKeyDown={(event) => {
                        if (
                            onOpen &&
                            (event.key === 'Enter' || event.key === ' ')
                        ) {
                            event.preventDefault()
                            onOpen()
                        }
                    }}
                >
                    {value}
                </div>
            </article>
        </FoldablePage>
    )
}
