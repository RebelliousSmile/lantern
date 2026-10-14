import { SkillRows } from '../../../shared/editor/AdrenalineFields'
import { useMonstreEdit } from '../useMonstreEdit'

export function SkillsForm() {
    const { shows, text, skillsSource, profileLine, ownership, errorLine } =
        useMonstreEdit()
    /* Only the zone that was clicked: this panel is that one key. */
    if (!shows('competences')) return null
    return (
        <section className="grid gap-2">
            <h3 className="font-semibold">
                {text('adrenaline:sections.skills')}
            </h3>
            {profileLine()}
            {ownership([[text('adrenaline:sections.skills'), skillsSource]])}
            <SkillRows
                at={
                    skillsSource.owner
                        ? '/etats[]/delta/competences[]'
                        : '/competences[]'
                }
                form="number"
                label={text('adrenaline:shared.skills.label')}
                value={skillsSource.value}
                onChange={(competences) => skillsSource.write(competences)}
            />
            {errorLine()}
        </section>
    )
}
