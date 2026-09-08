import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/utils/cn'
import { useOtherscapeThemeStore } from '../../hooks'
import { TRACK_LABEL, TRACK_MAX, type TrackField } from '../../model'

const TRACKS: TrackField[] = ['upgrade', 'decay']

const HELP: Record<TrackField, string> = {
    upgrade:
        'Marked as the theme grows. Three marks and it is ready to improve.',
    decay: 'Marked as the theme frays. Three marks and it is ready to be lost.',
}

const STEPS = Array.from({ length: TRACK_MAX + 1 }, (_, index) => index)

/* Zero is offered as a step and written as an absent field: at the table an
   untouched track and a track wiped back to nothing are the same empty row, and
   only one of the two belongs in the exported file. An imported `upgrade = 0`
   is still carried through untouched; this is about what the form writes, not
   about what the schema accepts. */
function TrackControl({ field }: { field: TrackField }) {
    const { otherscapeTheme, setTrack } = useOtherscapeThemeStore()
    const value = otherscapeTheme[field] ?? 0

    return (
        <div className="grid gap-1">
            <div className="flex items-baseline justify-between gap-2">
                <Label>{TRACK_LABEL[field]}</Label>
                <span className="text-xs text-muted-foreground">
                    {value} / {TRACK_MAX}
                </span>
            </div>
            <div className="grid grid-cols-4 overflow-hidden rounded-md border">
                {STEPS.map((step) => (
                    <Button
                        key={step}
                        type="button"
                        variant={value === step ? 'default' : 'ghost'}
                        className={cn(
                            'h-8 rounded-none border-none px-2 text-xs',
                            value === step ? '' : 'bg-background'
                        )}
                        onClick={() =>
                            setTrack(field, step === 0 ? undefined : step)
                        }
                    >
                        {step}
                    </Button>
                ))}
            </div>
            <p className="text-xs text-muted-foreground">{HELP[field]}</p>
        </div>
    )
}

export default function TracksForm({
    focusField,
}: {
    focusField?: TrackField
}) {
    /* Both tracks are edited from the same form, so clicking one row never
       disturbs the other: the click only decides which of the two is named
       first. */
    const ordered = focusField
        ? [focusField, ...TRACKS.filter((field) => field !== focusField)]
        : TRACKS

    return (
        <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Tracks
            </p>
            {ordered.map((field) => (
                <TrackControl key={field} field={field} />
            ))}
        </div>
    )
}
