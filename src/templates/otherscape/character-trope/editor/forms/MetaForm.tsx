import { useMemo, useState } from 'react'
import {
    useOtherscapeCharacterTropeStore,
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
import { useUiText, type TranslationKey } from '@/i18n/text'
import { getCatalogSources, type CatalogItem } from '@/utils/catalog'
import { cn } from '@/utils/cn'
import { Check, ChevronsUpDown, X } from 'lucide-react'

const TYPES: { value: PublicationType; label: TranslationKey }[] = [
    {
        value: 'official',
        label: 'otherscape:forms.characterTrope.meta.type.official',
    },
    {
        value: 'third_party',
        label: 'otherscape:forms.characterTrope.meta.type.thirdParty',
    },
    {
        value: 'cauldron',
        label: 'otherscape:forms.characterTrope.meta.type.cauldron',
    },
    {
        value: 'homebrew',
        label: 'otherscape:forms.characterTrope.meta.type.homebrew',
    },
]

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
    const text = useUiText()
    const [draft, setDraft] = useState('')
    const resolvedPlaceholder =
        placeholder ??
        text('otherscape:forms.characterTrope.meta.authorsPlaceholderDefault')

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
                            aria-label={text(
                                'otherscape:forms.characterTrope.meta.removeAuthorAriaLabel',
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
                    placeholder={value.length ? '' : resolvedPlaceholder}
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
    const text = useUiText()
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
                        placeholder={text(
                            'otherscape:forms.characterTrope.meta.searchSourcePlaceholder'
                        )}
                    />
                    <CommandEmpty>
                        {text('otherscape:forms.characterTrope.meta.noMatch')}
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
    value,
    onChange,
}: {
    value?: PublicationType
    onChange: (next: PublicationType) => void
}) {
    const text = useUiText()

    return (
        <div className="grid grid-cols-2 overflow-hidden rounded-md border sm:inline-grid sm:grid-cols-4">
            {TYPES.map((type) => (
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
                    {text(type.label)}
                </Button>
            ))}
        </div>
    )
}

/* ---------- Main MetaForm ---------- */
export default function MetaForm() {
    const text = useUiText()
    const { otherscapeCharacterTrope, updateMeta } =
        useOtherscapeCharacterTropeStore()
    const meta = otherscapeCharacterTrope.meta

    const type = meta?.publication_type as PublicationType | undefined
    const authors = useMemo(() => meta?.authors ?? [], [meta?.authors])
    const sourceOptions =
        type === 'official' || type === 'third_party'
            ? getCatalogSources('otherscape', type)
            : []

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
                    {text(
                        'otherscape:forms.characterTrope.meta.publicationTypeLabel'
                    )}
                </Label>
                <TypeSegment value={type} onChange={setType} />
            </div>

            {sourceOptions.length > 0 ? (
                <div className="grid gap-1">
                    <Label>
                        {text(
                            'otherscape:forms.characterTrope.meta.sourceLabel'
                        )}
                    </Label>
                    <SourceCombobox
                        items={sourceOptions}
                        value={meta?.source}
                        onSelect={pickFromCatalog}
                        placeholder={
                            type === 'official'
                                ? text(
                                      'otherscape:forms.characterTrope.meta.selectOfficialBookPlaceholder'
                                  )
                                : text(
                                      'otherscape:forms.characterTrope.meta.selectThirdPartySourcePlaceholder'
                                  )
                        }
                    />
                    <div className="text-xs text-muted-foreground">
                        {text(
                            'otherscape:forms.characterTrope.meta.sourceHint'
                        )}
                    </div>
                </div>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_110px] sm:items-end">
                <div className="grid gap-1">
                    <Label htmlFor="os-character-trope-meta-source">
                        {type === 'cauldron'
                            ? text(
                                  'otherscape:forms.characterTrope.meta.sourceTitleLabel.cauldron'
                              )
                            : type === 'homebrew'
                              ? text(
                                    'otherscape:forms.characterTrope.meta.sourceTitleLabel.homebrew'
                                )
                              : text(
                                    'otherscape:forms.characterTrope.meta.sourceTitleLabel.default'
                                )}{' '}
                        <span className="text-muted-foreground">
                            {text(
                                'otherscape:forms.characterTrope.meta.optional'
                            )}
                        </span>
                    </Label>
                    <Input
                        id="os-character-trope-meta-source"
                        className="h-8 px-2 text-sm"
                        value={meta?.source ?? ''}
                        onChange={(event) =>
                            updateMeta({ source: event.target.value })
                        }
                        placeholder={
                            type === 'cauldron'
                                ? text(
                                      'otherscape:forms.characterTrope.meta.sourceTitlePlaceholder.cauldron'
                                  )
                                : type === 'homebrew'
                                  ? text(
                                        'otherscape:forms.characterTrope.meta.sourceTitlePlaceholder.homebrew'
                                    )
                                  : text(
                                        'otherscape:forms.characterTrope.meta.sourceTitlePlaceholder.default'
                                    )
                        }
                    />
                </div>

                <div className="grid gap-1">
                    <Label htmlFor="os-character-trope-meta-page">
                        {text('otherscape:forms.characterTrope.meta.pageLabel')}{' '}
                        <span className="text-muted-foreground">
                            {text(
                                'otherscape:forms.characterTrope.meta.optional'
                            )}
                        </span>
                    </Label>
                    <Input
                        id="os-character-trope-meta-page"
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
                        placeholder={text(
                            'otherscape:forms.characterTrope.meta.pagePlaceholderExample'
                        )}
                    />
                </div>
            </div>

            <div className="grid gap-1">
                <Label>
                    {text('otherscape:forms.characterTrope.meta.authorsLabel')}
                </Label>
                <AuthorsInput
                    value={authors}
                    onChange={(next) => updateMeta({ authors: next })}
                    placeholder={text(
                        'otherscape:forms.characterTrope.meta.authorsPlaceholder'
                    )}
                />
            </div>

            <div className="text-xs text-muted-foreground">
                {text('otherscape:forms.characterTrope.meta.footerHint')}
            </div>
        </div>
    )
}
