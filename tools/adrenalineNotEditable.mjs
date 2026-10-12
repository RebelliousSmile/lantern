/**
 * What a published block shows but no editor carries yet, per sheet (root keys of the document).
 * The list is the debt: it can only shrink. The coverage guard and the contract harness read it.
 */
export const NOT_EDITABLE = {
    pj: ['etatDePartie'],
    pnj: ['etatDePartie'],
    monstre: ['etatPrincipal', 'etatDeBase', 'etatAlternatif'],
}
