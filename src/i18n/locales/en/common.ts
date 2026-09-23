/*
 * English is the source of truth: every other language is typed against this object, so a key
 * missing from a translation fails the build.
 */
const common = {
    language: {
        choose: 'Choose language',
    },
    sidebar: {
        logoAlt: 'Lantern logo',
        tagline: 'Template editor',
        gamePacks: 'Game packs',
        chooseGamePacks: 'Choose game packs',
        showThesePacks: 'Show these packs',
        comingSoon: 'Coming soon',
        allPacksHidden:
            'Every game pack is hidden. Bring one back from the sliders above.',
        feedback: 'Feedback',
        credit: 'Created by 4rtamis',
    },
    topBar: {
        noOpenTabs: 'No open tabs',
        closeTab: 'Close tab',
        closeTitle: 'Are you absolutely sure you want to remove this tab?',
        closeDescription:
            'This action cannot be undone. This will permanently delete <strong>{{title}}</strong>.',
        thisTab: 'this tab',
        dontShowAgain: "Don't show me this again",
        cancel: 'Cancel',
        continue: 'Continue',
    },
    emptyState: {
        title: 'Welcome to Lantern',
        intro: 'Turn rough notes into game-ready sheets, then take them elsewhere: a structured file for other tools, an image for the table.',
        steps: {
            pack: {
                title: 'Pick a game pack',
                body: 'Games live in the left sidebar. The sliders next to Game packs hide the ones your table does not play, so the list stays short as more arrive.',
            },
            template: {
                title: 'Open a template',
                body: 'Choosing a template opens a tab. Start from the worked example, from a blank sheet, or import a .toml file you already have.',
            },
            edit: {
                title: 'Edit from the sheet',
                body: 'There is no form to hunt through: click a region of the rendered sheet and its fields open in the inspector on the right.',
            },
            export: {
                title: 'Export',
                body: 'The Export panel writes a .toml for other tools to read, or a .png at the scale you choose for handouts and print.',
            },
        },
        localOnly:
            'Everything stays in this browser — no account, nothing uploaded. Clearing the site data clears your work, so export what you want to keep.',
        copyright:
            'Includes material copyright Son of Oak Game Studio LLC and other authors, for personal playtesting only.',
    },
    unavailable: {
        title: 'Template not available yet',
        body: 'This template is listed in the sidebar but is not implemented yet.',
    },
    editing: {
        showSidebar: 'Show editor sidebar',
        hideSidebar: 'Hide editor sidebar',
        toggleSidebar: 'Toggle editor sidebar',
    },
    inspector: {
        editor: 'Editor',
        appearance: 'General Appearance',
        export: 'Export',
    },
    landing: {
        chooseStart:
            'Choose how to start this template: blank, example, or import from TOML.',
        startExample: 'Start with example',
        startBlank: 'Start blank',
        importToml: 'Import TOML',
    },
    import: {
        title: 'Import {{label}}',
        templateFallback: 'Template',
        description:
            'Import from a <code>.toml</code> file or by pasting TOML.',
        fileTab: 'File',
        pasteTab: 'Paste',
        trustedTitle: 'Import from trusted sources only',
        trustedFile:
            'Importing files can include malicious content. Only open TOML from creators you trust.',
        trustedPaste:
            'Pasted TOML can include malicious payloads. Only paste content from creators you trust.',
        selectFile: 'Select a .toml file',
        chooseFile: 'Choose file…',
        validateHint: 'We validate before importing.',
        importFile: 'Import file',
        pasteLabel: 'Paste TOML',
        autoValidate: 'Auto-validates as you type/paste.',
        importPasted: 'Import pasted TOML',
        noPreview: 'No preview yet. Select a file or paste TOML.',
        document: 'Document:',
        warnings_one: '{{count}} warning',
        warnings_other: '{{count}} warnings',
        validated: 'TOML validated.',
        imported: 'Imported.',
        importedNamed: 'Imported “{{name}}”.',
        importedWithWarnings_one: 'Imported with {{count}} warning.',
        importedWithWarnings_other: 'Imported with {{count}} warnings.',
        unavailable: 'Import is not available for this template.',
    },
    export: {
        openTemplate: 'Open an implemented template to export it.',
        copyToml: 'Copy TOML',
        exportToml: 'Export TOML',
        toml: 'TOML',
        hide: 'Hide',
        generatedToml: 'Generated TOML',
        exportAction: 'Export {{label}}',
        copied: 'Copied TOML.',
        copyFailed:
            'Could not copy TOML. Select the text below and copy it manually.',
        previewNotFound: 'Preview not found. Make sure the preview is visible.',
        exportedPng: 'Exported PNG.',
        exportedToml: 'Exported TOML.',
        png: 'PNG',
        exportPng: 'Export PNG',
    },
    workspace: {
        persistenceFailed:
            'Saving failed. Your current work is not persisted.',
        exportRescueCopy: 'Export rescue copy',
    },
    feedback: {
        title: 'Send feedback on Discord',
        description:
            'Reach out to <strong>@4rtamis</strong> on the City of Mist Discord server to send feedback about the app.',
        mostUseful:
            'As there is no tutorial yet, the most useful feedback is what felt intuitive, what did not, and where the app was unclear.',
        noSmartphone:
            'Smartphone feedback is not useful for now because a responsive small-device view has not been developed yet.',
        contextTitle: 'Include this context with your feedback',
        contextHint:
            'Copy and paste this block so the report has the browser and app details I need.',
        copyContext: 'Copy context',
        copied: 'Feedback context copied.',
        copyFailed: 'Could not copy feedback context.',
        close: 'Close',
        joinDiscord: 'Join Discord',
    },
    /*
     * Generic editor words every game's forms share. They take no noun, so they stay correct
     * whatever the label beside them and whatever its grammatical gender.
     */
    actions: {
        add: 'Add',
        remove: 'Remove',
        edit: 'Edit',
        delete: 'Delete',
        cancel: 'Cancel',
        save: 'Save',
        done: 'Done',
        dragToReorder: 'Drag to reorder',
        moveUp: 'Move up',
        moveDown: 'Move down',
        addItem: 'Add item',
        removeItem: 'Remove item',
        moveItemUp: 'Move item up',
        moveItemDown: 'Move item down',
    },
    fields: {
        name: 'Name',
        description: 'Description',
        title: 'Title',
        notes: 'Notes',
    },
    errors: {
        tomlSyntax: 'TOML syntax error, line {{line}}, column {{column}}',
        importFailed: 'Failed to import.',
        invalidToml: 'Invalid TOML.',
        parseFailed: 'Failed to parse/validate TOML.',
        readFailed: 'Failed to read file.',
        exportFailed: 'Failed to export.',
        generateTomlFailed: 'Failed to generate TOML.',
        exportPngFailed: 'Failed to export PNG.',
        exportTomlFailed: 'Failed to export TOML.',
    },
}

export default common
