import type { ResourceShape } from '@/i18n/resourceShape'
import type en from '../en/adrenaline'

const adrenaline: ResourceShape<typeof en> = {
    sections: {
        document: 'Document',
    },
    appearance: {
        printedProportions:
            'Les fiches Adrenaline gardent les proportions de leur carte imprimée pour l’export PNG.',
    },
    pj: {
        label: 'PJ',
        newTitle: 'Nouveau personnage joueur',
        description:
            'Créez la première page d’une fiche de personnage joueur Adrenaline, puis échangez-la en TOML validé.',
        exportToml: 'Exporter les données du PJ actuel en TOML.',
        exportPng: 'Exporter l’aperçu du PJ actuel en PNG.',
    },
    pnj: {
        label: 'PNJ',
        newTitle: 'Nouveau personnage non joueur',
        description:
            'Créez une carte de personnage non joueur Adrenaline, du simple figurant au PNJ majeur complet.',
        exportToml: 'Exporter les données du PNJ actuel en TOML.',
        exportPng: 'Exporter l’aperçu du PNJ actuel en PNG.',
    },
    monstre: {
        label: 'Monstre',
        newTitle: 'Nouveau monstre',
        description:
            'Créez une carte de créature Adrenaline avec ses données d’état altéré et de contagion.',
        exportToml: 'Exporter les données du monstre actuel en TOML.',
        exportPng: 'Exporter l’aperçu du monstre actuel en PNG.',
    },
}

export default adrenaline
