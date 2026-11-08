import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useUiText } from '@/i18n/text'
import { useState } from 'react'
import { useOtherscapePowerSetStore } from '../../hooks'

export default function TagsForm() {
    const text = useUiText()
    const { otherscapePowerSet, setOtherscapePowerSet } =
        useOtherscapePowerSetStore()

    /* The raw text is kept apart from the list so a line being typed, or the
       blank one just opened under it, survives until it holds something. */
    const [raw, setRaw] = useState(() =>
        otherscapePowerSet.tags_and_statuses.join('\n')
    )

    const commit = (value: string) => {
        setRaw(value)
        setOtherscapePowerSet({
            tags_and_statuses: value
                .split('\n')
                .map((line) => line.trim())
                .filter(Boolean),
        })
    }

    return (
        <div className="space-y-2">
            <Label htmlFor="os-power-set-tags">
                {text('otherscape:forms.powerSet.tags.label')}
            </Label>
            <Textarea
                id="os-power-set-tags"
                rows={5}
                className="px-2 py-1 text-sm"
                placeholder={text('otherscape:forms.powerSet.tags.placeholder')}
                value={raw}
                onChange={(event) => commit(event.target.value)}
            />
            <p className="text-xs text-muted-foreground">
                {text('otherscape:forms.powerSet.tags.hint')}
            </p>
        </div>
    )
}
