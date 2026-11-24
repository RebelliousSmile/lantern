import { NOTES_BODY_ATTRIBUTE } from './notesFit'
import './notesPage.css'

/**
 * The notes as a region of a sheet's back: the lined area the player writes the notes of the game
 * in, drawn inside the face that holds it. Unlike the notes page it takes the room of the region,
 * and the editor measures the text against this very body. The region is opened by the click on
 * the section that wraps it, so nothing here is interactive.
 */
export function NotesRegion({
    title,
    value,
}: {
    title: string
    value: string | undefined
}) {
    return (
        <>
            <h3>{title}</h3>
            <div
                className="lantern-notes-region__body"
                {...{ [NOTES_BODY_ATTRIBUTE]: '' }}
            >
                {value}
            </div>
        </>
    )
}
