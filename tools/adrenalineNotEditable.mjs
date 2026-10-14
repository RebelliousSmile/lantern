/**
 * What a published block shows but no editor carries yet, per sheet (root keys of the document).
 * The list is the debt: it can only shrink. The coverage guard and the contract harness read it.
 */
export const NOT_EDITABLE = {
    pj: [],
    pnj: ['etatDePartie'],
    monstre: ['etatPrincipal', 'etatDeBase', 'etatAlternatif'],
}

/**
 * Leaves of a sheet's schema that no field of its editor types, by pointer (array items as `[]`).
 * `assert:adrenaline-pj` derives every leaf from the schema and proves each one has a field, so a
 * leaf is listed here only with the reason the schema itself gives, and the proof refuses an entry
 * that has become editable.
 */
export const NOT_EDITABLE_LEAVES = {
    pj: [
        /* "le type est imprimé, seul l'intitulé s'écrit" (pj.schema.json): the column a formation sits in is its type. */
        '/formations[]/type',
    ],
}
