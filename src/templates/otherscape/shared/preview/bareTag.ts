/* The printed cards set their tags as words, not as tokens: the braces a
   document may carry and the weakness mark are the editor's syntax, not the
   page's. */
export function bareTag(tag: string): string {
    return tag
        .trim()
        .replace(/^\{([\s\S]*)\}$/, '$1')
        .replace(/^!/, '')
        .trim()
}
