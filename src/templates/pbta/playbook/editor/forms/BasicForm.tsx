import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { usePlaybookStore } from '../../hooks'

export default function BasicForm() {
    const { playbook, setPlaybook } = usePlaybookStore()

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label htmlFor="pbta-pb-name">Playbook name</Label>
                <Input
                    id="pbta-pb-name"
                    className="h-8 px-2 text-sm"
                    value={playbook.name}
                    onChange={(event) =>
                        setPlaybook({ name: event.target.value })
                    }
                    placeholder="e.g., The Wrench"
                />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-1">
                    <Label htmlFor="pbta-pb-slug">Slug</Label>
                    <Input
                        id="pbta-pb-slug"
                        className="h-8 px-2 text-sm"
                        value={playbook.slug}
                        onChange={(event) =>
                            setPlaybook({ slug: event.target.value })
                        }
                        placeholder="e.g., the-wrench"
                    />
                </div>

                <div className="grid gap-1">
                    <Label htmlFor="pbta-pb-game">Game id</Label>
                    <Input
                        id="pbta-pb-game"
                        className="h-8 px-2 text-sm"
                        value={playbook.game}
                        onChange={(event) =>
                            setPlaybook({ game: event.target.value })
                        }
                        placeholder="Must match a game definition's id"
                    />
                </div>
            </div>

            <div className="grid gap-1">
                <Label htmlFor="pbta-pb-actor-type">
                    Actor type{' '}
                    <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                    id="pbta-pb-actor-type"
                    className="h-8 px-2 text-sm"
                    value={playbook.actorType}
                    onChange={(event) =>
                        setPlaybook({ actorType: event.target.value })
                    }
                    placeholder="e.g., character"
                />
            </div>

            <div className="grid gap-1">
                <Label htmlFor="pbta-pb-image">
                    Image URL{' '}
                    <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                    id="pbta-pb-image"
                    className="h-8 px-2 text-sm"
                    value={playbook.playbookImage}
                    onChange={(event) =>
                        setPlaybook({ playbookImage: event.target.value })
                    }
                    placeholder="https://…"
                />
            </div>

            <div className="grid gap-1">
                <Label htmlFor="pbta-pb-description">Description</Label>
                <Textarea
                    id="pbta-pb-description"
                    rows={3}
                    className="px-2 py-1 text-sm"
                    value={playbook.description}
                    onChange={(event) =>
                        setPlaybook({ description: event.target.value })
                    }
                    placeholder="Supports Markdown."
                />
            </div>
        </div>
    )
}
