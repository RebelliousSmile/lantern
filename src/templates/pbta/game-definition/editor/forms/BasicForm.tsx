import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUiText } from '@/i18n/text'
import { useGameDefinitionStore } from '../../hooks'

export default function BasicForm() {
    const { gameDefinition, setGameDefinition } = useGameDefinitionStore()
    const text = useUiText()

    return (
        <div className="space-y-4">
            <div className="grid gap-1">
                <Label htmlFor="pbta-def-name">
                    {text('pbta:forms.gameDefinition.basic.name')}
                </Label>
                <Input
                    id="pbta-def-name"
                    className="h-8 px-2 text-sm"
                    value={gameDefinition.name}
                    onChange={(event) =>
                        setGameDefinition({ name: event.target.value })
                    }
                    placeholder={text(
                        'pbta:forms.gameDefinition.basic.namePlaceholder'
                    )}
                />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-1">
                    <Label htmlFor="pbta-def-game">
                        {text('pbta:forms.gameDefinition.basic.game')}
                    </Label>
                    <Input
                        id="pbta-def-game"
                        className="h-8 px-2 text-sm"
                        value={gameDefinition.game}
                        onChange={(event) =>
                            setGameDefinition({ game: event.target.value })
                        }
                        placeholder={text(
                            'pbta:forms.gameDefinition.basic.gamePlaceholder'
                        )}
                    />
                </div>

                <div className="grid gap-1">
                    <Label htmlFor="pbta-def-version">
                        {text('pbta:forms.gameDefinition.basic.version')}
                    </Label>
                    <Input
                        id="pbta-def-version"
                        className="h-8 px-2 text-sm"
                        value={gameDefinition.version}
                        onChange={(event) =>
                            setGameDefinition({ version: event.target.value })
                        }
                        placeholder={text(
                            'pbta:forms.gameDefinition.basic.versionPlaceholder'
                        )}
                    />
                </div>
            </div>

            <div className="grid gap-1">
                <Label htmlFor="pbta-def-source">
                    {text('pbta:forms.gameDefinition.basic.source')}{' '}
                    <span className="text-muted-foreground">
                        {text('pbta:forms.shared.optional')}
                    </span>
                </Label>
                <Input
                    id="pbta-def-source"
                    className="h-8 px-2 text-sm"
                    value={gameDefinition.source}
                    onChange={(event) =>
                        setGameDefinition({ source: event.target.value })
                    }
                    placeholder={text(
                        'pbta:forms.gameDefinition.basic.sourcePlaceholder'
                    )}
                />
            </div>

            <p className="text-xs text-muted-foreground">
                {text('pbta:forms.gameDefinition.basic.versionHint')}
            </p>
        </div>
    )
}
