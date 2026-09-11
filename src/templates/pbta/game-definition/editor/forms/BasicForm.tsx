import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useGameDefinitionStore } from '../../hooks'

export default function BasicForm() {
    const { gameDefinition, setGameDefinition } = useGameDefinitionStore()

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label htmlFor="pbta-def-name">Game name</Label>
                <Input
                    id="pbta-def-name"
                    className="h-8 px-2 text-sm"
                    value={gameDefinition.name}
                    onChange={(event) =>
                        setGameDefinition({ name: event.target.value })
                    }
                    placeholder="e.g., Apocalypse Keys"
                />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-1">
                    <Label htmlFor="pbta-def-game">Game id</Label>
                    <Input
                        id="pbta-def-game"
                        className="h-8 px-2 text-sm"
                        value={gameDefinition.game}
                        onChange={(event) =>
                            setGameDefinition({ game: event.target.value })
                        }
                        placeholder="e.g., apocalypse-keys"
                    />
                </div>

                <div className="grid gap-1">
                    <Label htmlFor="pbta-def-version">Version</Label>
                    <Input
                        id="pbta-def-version"
                        className="h-8 px-2 text-sm"
                        value={gameDefinition.version}
                        onChange={(event) =>
                            setGameDefinition({ version: event.target.value })
                        }
                        placeholder="e.g., 0.1.0"
                    />
                </div>
            </div>

            <div className="grid gap-1">
                <Label htmlFor="pbta-def-source">
                    Source{' '}
                    <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                    id="pbta-def-source"
                    className="h-8 px-2 text-sm"
                    value={gameDefinition.source}
                    onChange={(event) =>
                        setGameDefinition({ source: event.target.value })
                    }
                    placeholder="Book or homebrew source"
                />
            </div>

            <p className="text-xs text-muted-foreground">
                The version tracks this definition, not the game: bump it
                whenever stats, attributes or vocabularies change below.
            </p>
        </div>
    )
}
