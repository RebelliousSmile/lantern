import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    useOtherscapeLoadoutItemStore,
    type PublicationType,
} from '../../hooks'

import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { getCatalogSources, type CatalogItem } from '@/utils/catalog'
import { cn } from '@/utils/cn'
import { Check, ChevronsUpDown, X } from 'lucide-react'

/* ---------- Authors chips input ---------- */
function AuthorsInput({
    value,
    onChange,
    placeholder,
}: {
    value: string[]
    onChange: (next: string[]) => void
    placeholder?: string
}) {
    const { t } = useTranslation()
    const effectivePlaceholder =
        placeholder ??
        t('otherscape:forms.loadoutItem.meta.authorsInputPlaceholder')
    const [draft, setDraft] = useState('')

    function commitDraft() {
        const name = draft.trim()
        if (!name) return
        if (!value.includes(name)) onChange([...value, name])
        setDraft('')
    }

    return (
        <div className="rounded-md border px-2 py-1">
            <div className="flex flex-wrap gap-1">
                {value.map((author) => (
                    <span
                        key={author}
                        className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-xs"
                    >
                        {author}
                        <button
                            type="button"
                            className="opacity-70 hover:opacity-100"
                            aria-label={t(
                                'otherscape:forms.loadoutItem.meta.removeAuthor',
                                { author }
                            )}
                            onClick={() =>
                                onChange(value.filter((x) => x !== author))
                            }
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </span>
                ))}
                <input
                    className="min-w-[10ch] flex-1 bg-transparent px-1 py-0.5 text-sm outline-none"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ',') {
                            event.preventDefault()
                            commitDraft()
                        }
                        if (
                            event.key === 'Backspace' &&
                            !draft &&
                            value.length
                        ) {
                            onChange(value.slice(0, -1))
                        }
                    }}
                    placeholder={value.length ? '' : effectivePlaceholder}
                />
            </div>
        </div>
    )
}

/* ---------- Combobox for sources (Official / Third Party) ---------- */
function SourceCombobox({
    items,
    value,
    onSelect,
    placeholder,
}: {
    items: CatalogItem[]
    value?: string
    onSelect: (item: CatalogItem) => void
    placeholder: string
}) {
    const { t } = useTranslation()
    const [open, setOpen] = useState(false)
    const current = items.find((item) => item.title === value)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="h-8 w-full justify-between px-2 text-sm"
                >
                    {current ? current.title : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-60" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                    <CommandInput
                        placeholder={t(
                            'otherscape:forms.loadoutItem.meta.sourceSearchPlaceholder'
                        )}
                    />
                    <CommandEmpty>
                        {t('otherscape:forms.loadoutItem.meta.sourceEmpty')}
                    </CommandEmpty>
                    <CommandGroup>
                        {items.map((item) => (
                            <CommandItem
                                key={item.id}
                                value={item.title}
                                onSelect={() => {
                                    onSelect(item)
                                    setOpen(false)
                                }}
                            >
                                <Check
                                    className={cn(
                                        'mr-2 h-4 w-4',
                                        current?.id === item.id
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                    )}
                                />
                                {item.title}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

/* ---------- Publication type segmented buttons ---------- */
function TypeSegment({
    types,
    value,
    onChange,
}: {
    types: { value: PublicationType; label: string }[]
    value?: PublicationType
    onChange: (next: PublicationType) => void
}) {
    return (
        <div className="grid grid-cols-2 overflow-hidden rounded-md border sm:inline-grid sm:grid-cols-4">
            {types.map((type) => (
                <Button
                    key={type.value}
                    type="button"
                    variant={value === type.value ? 'default' : 'ghost'}
                    className={cn(
                        'h-8 rounded-none border-none px-2 text-xs',
                        value === type.value ? '' : 'bg-background'
                    )}
                    onClick={() => onChange(type.value)}
                >
                    {type.label}
                </Button>
            ))}
        </div>
    )
}

/* ---------- Main MetaForm ---------- */
export default function MetaForm() {
    const { t } = useTranslation()
    const { otherscapeLoadoutItem, updateMeta } =
        useOtherscapeLoadoutItemStore()
    const meta = otherscapeLoadoutItem.meta

    const type = meta?.publication_type as PublicationType | undefined
    const authors = useMemo(() => meta?.authors ?? [], [meta?.authors])
    const sourceOptions =
        type === 'official' || type === 'third_party'
            ? getCatalogSources('otherscape', type)
            : []

    const types: { value: PublicationType; label: string }[] = [
        {
            value: 'official',
            label: t('otherscape:forms.loadoutItem.meta.typeOfficial'),
        },
        {
            value: 'third_party',
            label: t('otherscape:forms.loadoutItem.meta.typeThirdParty'),
        },
        {
            value: 'cauldron',
            label: t('otherscape:forms.loadoutItem.meta.typeCauldron'),
        },
        {
            value: 'homebrew',
            label: t('otherscape:forms.loadoutItem.meta.typeHomebrew'),
        },
    ]

    function setType(next: PublicationType) {
        updateMeta({
            publication_type: next,
            source: '',
            authors: [],
        })
    }

    function pickFromCatalog(item: CatalogItem) {
        updateMeta({
            source: item.title,
            authors: item.authors,
        })
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label>
                    {t(
                        'otherscape:forms.loadoutItem.meta.publicationTypeLabel'
                    )}
                </Label>
                <TypeSegment types={types} value={type} onChange={setType} />
            </div>

            {sourceOptions.length > 0 ? (
                <div className="grid gap-1">
                    <Label>
                        {t('otherscape:forms.loadoutItem.meta.sourceLabel')}
                    </Label>
                    <SourceCombobox
                        items={sourceOptions}
                        value={meta?.source}
                        onSelect={pickFromCatalog}
                        placeholder={
                            type === 'official'
                                ? t(
                                      'otherscape:forms.loadoutItem.meta.officialPlaceholder'
                                  )
                                : t(
                                      'otherscape:forms.loadoutItem.meta.thirdPartyPlaceholder'
                                  )
                        }
                    />
                    <div className="text-xs text-muted-foreground">
                        {t('otherscape:forms.loadoutItem.meta.autofillHelp')}
                    </div>
                </div>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_110px] sm:items-end">
                <div className="grid gap-1">
                    <Label htmlFor="os-loadout-item-meta-source">
                        {type === 'cauldron'
                            ? t(
                                  'otherscape:forms.loadoutItem.meta.sourceTitleCauldronLabel'
                              )
                            : type === 'homebrew'
                              ? t(
                                    'otherscape:forms.loadoutItem.meta.sourceTitleHomebrewLabel'
                                )
                              : t(
                                    'otherscape:forms.loadoutItem.meta.sourceTitleDefaultLabel'
                                )}{' '}
                        <span className="text-muted-foreground">
                            {t(
                                'otherscape:forms.loadoutItem.meta.sourceTitleOptional'
                            )}
                        </span>
                    </Label>
                    <Input
                        id="os-loadout-item-meta-source"
                        className="h-8 px-2 text-sm"
                        value={meta?.source ?? ''}
                        onChange={(event) =>
                            updateMeta({ source: event.target.value })
                        }
                        placeholder={
                            type === 'cauldron'
                                ? t(
                                      'otherscape:forms.loadoutItem.meta.sourceTitleCauldronPlaceholder'
                                  )
                                : type === 'homebrew'
                                  ? t(
                                        'otherscape:forms.loadoutItem.meta.sourceTitleHomebrewPlaceholder'
                                    )
                                  : t(
                                        'otherscape:forms.loadoutItem.meta.sourceTitleDefaultPlaceholder'
                                    )
                        }
                    />
                </div>

                <div className="grid gap-1">
                    <Label htmlFor="os-loadout-item-meta-page">
                        {t('otherscape:forms.loadoutItem.meta.pageLabel')}{' '}
                        <span className="text-muted-foreground">
                            {t(
                                'otherscape:forms.loadoutItem.meta.pageOptional'
                            )}
                        </span>
                    </Label>
                    <Input
                        id="os-loadout-item-meta-page"
                        className="h-8 px-2 text-sm"
                        type="number"
                        min={1}
                        value={meta?.page ?? ''}
                        onChange={(event) =>
                            updateMeta({
                                page: event.target.value
                                    ? Math.max(
                                          1,
                                          Math.floor(+event.target.value)
                                      )
                                    : undefined,
                            })
                        }
                        placeholder={t(
                            'otherscape:forms.loadoutItem.meta.pagePlaceholder'
                        )}
                    />
                </div>
            </div>

            <div className="grid gap-1">
                <Label>
                    {t('otherscape:forms.loadoutItem.meta.authorsLabel')}
                </Label>
                <AuthorsInput
                    value={authors}
                    onChange={(next) => updateMeta({ authors: next })}
                    placeholder={t(
                        'otherscape:forms.loadoutItem.meta.authorsAddPlaceholder'
                    )}
                />
            </div>

            <div className="text-xs text-muted-foreground">
                {t('otherscape:forms.loadoutItem.meta.footerHelp')}
            </div>
        </div>
    )
}
