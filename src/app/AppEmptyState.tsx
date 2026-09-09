import { FileDown, Layers, MousePointerClick, Sparkles } from 'lucide-react'

/* The first screen a bare `/` shows, and the only place the app explains
   itself: every other view already has a document in it. It used to spend its
   whole lower half on an early-development warning, which told a first-time
   visitor nothing about how to use the tool. The four steps below are the
   actual path through the app, in order. */
const STEPS = [
    {
        icon: Layers,
        title: 'Pick a game pack',
        body: 'Games live in the left sidebar. The sliders next to Game packs hide the ones your table does not play, so the list stays short as more arrive.',
    },
    {
        icon: Sparkles,
        title: 'Open a template',
        body: 'Choosing a template opens a tab. Start from the worked example, from a blank sheet, or import a .toml file you already have.',
    },
    {
        icon: MousePointerClick,
        title: 'Edit from the sheet',
        body: 'There is no form to hunt through: click a region of the rendered sheet and its fields open in the inspector on the right.',
    },
    {
        icon: FileDown,
        title: 'Export',
        body: 'The Export panel writes a .toml for other tools to read, or a .png at the scale you choose for handouts and print.',
    },
]

export default function AppEmptyState() {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center py-10 text-center">
            <img
                src="/lantern-logo.svg"
                alt="Lantern logo"
                className="mb-4 h-20 w-20"
            />
            <h2 className="text-xl font-semibold">Welcome to Lantern</h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Turn rough notes into game-ready sheets, then take them
                elsewhere: a structured file for other tools, an image for the
                table.
            </p>

            <div className="mt-8 grid w-full max-w-3xl gap-3 text-left sm:grid-cols-2">
                {STEPS.map((step) => (
                    <div
                        key={step.title}
                        className="rounded-lg border bg-card/95 p-4 shadow-sm"
                    >
                        <div className="flex items-center gap-2">
                            <step.icon className="size-4 shrink-0 text-muted-foreground" />
                            <h3 className="text-sm font-semibold">
                                {step.title}
                            </h3>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {step.body}
                        </p>
                    </div>
                ))}
            </div>

            <p className="mt-6 max-w-2xl text-xs text-muted-foreground">
                Everything stays in this browser — no account, nothing uploaded.
                Clearing the site data clears your work, so export what you want
                to keep.
            </p>
            <p className="mt-2 max-w-2xl text-xs text-muted-foreground">
                Includes material copyright Son of Oak Game Studio LLC and other
                authors, for personal playtesting only.
            </p>
        </div>
    )
}
