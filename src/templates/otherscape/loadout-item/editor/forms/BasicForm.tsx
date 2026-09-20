import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useTranslation } from 'react-i18next'
import { useOtherscapeLoadoutItemStore } from '../../hooks'

export default function BasicForm() {
    const { t } = useTranslation()
    const { otherscapeLoadoutItem, setName, setCategory, setDescription } =
        useOtherscapeLoadoutItemStore()

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label htmlFor="os-loadout-item-name">
                    {t('otherscape:forms.loadoutItem.basic.nameLabel')}
                </Label>
                <Input
                    id="os-loadout-item-name"
                    className="h-8 px-2 text-sm"
                    value={otherscapeLoadoutItem.name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder={t(
                        'otherscape:forms.loadoutItem.basic.namePlaceholder'
                    )}
                />
                <p className="text-xs text-muted-foreground">
                    {t('otherscape:forms.loadoutItem.basic.nameHelp')}
                </p>
            </div>

            <div className="grid gap-1">
                <Label htmlFor="os-loadout-item-category">
                    {t('otherscape:forms.loadoutItem.basic.categoryLabel')}{' '}
                    <span className="text-muted-foreground">
                        {t(
                            'otherscape:forms.loadoutItem.basic.categoryOptional'
                        )}
                    </span>
                </Label>
                <Input
                    id="os-loadout-item-category"
                    className="h-8 px-2 text-sm"
                    value={otherscapeLoadoutItem.category}
                    onChange={(event) => setCategory(event.target.value)}
                    placeholder={t(
                        'otherscape:forms.loadoutItem.basic.categoryPlaceholder'
                    )}
                />
                <p className="text-xs text-muted-foreground">
                    {t('otherscape:forms.loadoutItem.basic.categoryHelp')}
                </p>
            </div>

            <div className="grid gap-1">
                <Label htmlFor="os-loadout-item-description">
                    {t('otherscape:forms.loadoutItem.basic.descriptionLabel')}{' '}
                    <span className="text-muted-foreground">
                        {t(
                            'otherscape:forms.loadoutItem.basic.descriptionOptional'
                        )}
                    </span>
                </Label>
                <Textarea
                    id="os-loadout-item-description"
                    className="min-h-24 text-sm"
                    value={otherscapeLoadoutItem.description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder={t(
                        'otherscape:forms.loadoutItem.basic.descriptionPlaceholder'
                    )}
                />
                <p className="text-xs text-muted-foreground">
                    {t('otherscape:forms.loadoutItem.basic.descriptionHelp')}
                </p>
            </div>
        </div>
    )
}
