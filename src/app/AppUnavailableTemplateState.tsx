import { useTranslation } from 'react-i18next'

export default function AppUnavailableTemplateState() {
    const { t } = useTranslation()

    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
            <h2 className="text-xl font-semibold">{t('unavailable.title')}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
                {t('unavailable.body')}
            </p>
        </div>
    )
}
