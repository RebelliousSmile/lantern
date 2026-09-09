import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getCatalogSources } from '@/utils/catalog'
import { cn } from '@/utils/cn'
import { X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useCityOfMistThemeCardStore, type PublicationType } from '../../hooks'

const TYPES: { value: PublicationType; label: string }[] = [
    { value: 'official', label: 'Official' },
    { value: 'third_party', label: 'Third Party' },
    { value: 'cauldron', label: 'Cauldron' },
    { value: 'homebrew', label: 'Homebrew' },
]

function AuthorsInput({ value, onChange }: { value: string[]; onChange: (next: string[]) => void }) {
    const [draft, setDraft] = useState('')
    function commit() {
        const author = draft.trim()
        if (author && !value.includes(author)) onChange([...value, author])
        setDraft('')
    }
    return (
        <div className="rounded-md border px-2 py-1">
            <div className="flex flex-wrap gap-1">
                {value.map((author) => (
                    <span key={author} className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-xs">
                        {author}
                        <button type="button" aria-label={`Remove ${author}`} onClick={() => onChange(value.filter((item) => item !== author))}>
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </span>
                ))}
                <input
                    className="min-w-[10ch] flex-1 bg-transparent px-1 py-0.5 text-sm outline-none"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onBlur={commit}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ',') { event.preventDefault(); commit() }
                        if (event.key === 'Backspace' && !draft && value.length) onChange(value.slice(0, -1))
                    }}
                    placeholder={value.length ? '' : 'Add author...'}
                />
            </div>
        </div>
    )
}

export default function MetaForm() {
    const { cityOfMistThemeCard, updateMeta } = useCityOfMistThemeCardStore()
    const meta = cityOfMistThemeCard.meta
    const type = meta?.publication_type ?? 'homebrew'
    const authors = useMemo(() => meta?.authors ?? [], [meta?.authors])
    const sources = type === 'official' || type === 'third_party'
        ? getCatalogSources('city-of-mist', type)
        : []

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label>Publication type</Label>
                <div className="grid grid-cols-2 overflow-hidden rounded-md border sm:grid-cols-4">
                    {TYPES.map((item) => (
                        <Button
                            key={item.value}
                            type="button"
                            variant={type === item.value ? 'default' : 'ghost'}
                            className={cn('h-8 rounded-none border-none px-2 text-xs', type === item.value ? '' : 'bg-background')}
                            onClick={() => updateMeta({ publication_type: item.value, source: '', authors: [] })}
                        >
                            {item.label}
                        </Button>
                    ))}
                </div>
            </div>

            {sources.length ? (
                <div className="grid gap-1">
                    <Label htmlFor="theme-card-catalog-source">Catalog source</Label>
                    <select
                        id="theme-card-catalog-source"
                        className="h-8 rounded-md border bg-background px-2 text-sm"
                        value={sources.some((item) => item.title === meta?.source) ? meta?.source : ''}
                        onChange={(event) => {
                            const item = sources.find((source) => source.title === event.target.value)
                            if (item) updateMeta({ source: item.title, authors: item.authors })
                        }}
                    >
                        <option value="">Select a source...</option>
                        {sources.map((item) => <option key={item.id} value={item.title}>{item.title}</option>)}
                    </select>
                </div>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_110px] sm:items-end">
                <div className="grid gap-1">
                    <Label htmlFor="theme-card-meta-source">Source <span className="text-muted-foreground">(optional)</span></Label>
                    <Input id="theme-card-meta-source" className="h-8 px-2 text-sm" value={meta?.source ?? ''} onChange={(event) => updateMeta({ source: event.target.value })} />
                </div>
                <div className="grid gap-1">
                    <Label htmlFor="theme-card-meta-page">Page <span className="text-muted-foreground">(optional)</span></Label>
                    <Input id="theme-card-meta-page" className="h-8 px-2 text-sm" type="number" min={1} value={meta?.page ?? ''} onChange={(event) => updateMeta({ page: event.target.value ? Math.max(1, Math.floor(Number(event.target.value))) : undefined })} />
                </div>
            </div>

            <div className="grid gap-1">
                <Label>Authors</Label>
                <AuthorsInput value={authors} onChange={(next) => updateMeta({ authors: next })} />
            </div>
            <p className="text-xs text-muted-foreground">Attribution is preserved in TOML exports.</p>
        </div>
    )
}
