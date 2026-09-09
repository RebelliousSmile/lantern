import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { useGamePackStore } from '@/core/gamePacks'
import { templatesByGame } from '@/core/templates/registry'
import { useWorkspaceStore } from '@/core/workspace/store'

import FeedbackDialog from '@/app/FeedbackDialog'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Minus, Plus, Send, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavSecondary } from './nav-secondary'

const data = {
    navSecondary: [
        /*{
            title: 'Support',
            href: 'https://discord.gg/jH686wH',
            icon: LifeBuoy,
        },*/
        {
            title: 'Feedback',
            icon: Send,
        },
    ],
}

export function AppSidebar() {
    const navigate = useNavigate()
    const createTab = useWorkspaceStore((s) => s.createTab)
    const activeTabId = useWorkspaceStore((s) => s.activeTabId)
    const tabs = useWorkspaceStore((s) => s.tabs)
    const disabledGameIds = useGamePackStore((s) => s.disabledGameIds)
    const openGameIds = useGamePackStore((s) => s.openGameIds)
    const setGamePackEnabled = useGamePackStore((s) => s.setGamePackEnabled)
    const setGamePackOpen = useGamePackStore((s) => s.setGamePackOpen)
    const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false)

    const activeTemplateId =
        tabs.find((tab) => tab.id === activeTabId)?.templateId ?? null

    const isGamePackEnabled = (gameId: string) =>
        !disabledGameIds.includes(gameId)
    const visibleGroups = templatesByGame.filter((group) =>
        isGamePackEnabled(group.gameId)
    )

    const navSecondaryItems = data.navSecondary.map((item) =>
        item.title === 'Feedback'
            ? {
                  ...item,
                  onClick: () => setFeedbackDialogOpen(true),
              }
            : item
    )

    return (
        <>
            <Sidebar variant="sidebar">
                <SidebarHeader>
                    <div className="flex items-center gap-2 p-2">
                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-secondary text-sidebar-primary-foreground">
                            <img
                                src="/lantern-logo.svg"
                                alt="Lantern logo"
                                className="size-6"
                            />
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">
                                Lantern
                            </span>
                            <span className="truncate text-xs">
                                Template editor
                            </span>
                        </div>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Game packs</SidebarGroupLabel>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarGroupAction title="Choose game packs">
                                    <SlidersHorizontal />
                                    <span className="sr-only">
                                        Choose game packs
                                    </span>
                                </SidebarGroupAction>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="min-w-52 rounded-lg"
                                align="end"
                                side="bottom"
                            >
                                <DropdownMenuLabel className="text-xs text-muted-foreground">
                                    Show these packs
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {templatesByGame.map((group) => (
                                    <DropdownMenuCheckboxItem
                                        key={group.gameId}
                                        checked={isGamePackEnabled(
                                            group.gameId
                                        )}
                                        /* The list is a multiple choice, so a
                                           tick must not close the menu. */
                                        onSelect={(event) =>
                                            event.preventDefault()
                                        }
                                        onCheckedChange={(checked) =>
                                            setGamePackEnabled(
                                                group.gameId,
                                                checked === true
                                            )
                                        }
                                    >
                                        {group.gameLabel}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <SidebarMenu>
                            {visibleGroups.map((group) => (
                                <Collapsible
                                    key={group.gameId}
                                    open={openGameIds.includes(group.gameId)}
                                    onOpenChange={(open) =>
                                        setGamePackOpen(group.gameId, open)
                                    }
                                    className="group/collapsible"
                                >
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton>
                                                {group.gameLabel}
                                                <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                                                <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {group.templates.map(
                                                    (template) => (
                                                        <SidebarMenuSubItem
                                                            key={template.id}
                                                        >
                                                            <SidebarMenuSubButton
                                                                asChild
                                                                isActive={
                                                                    activeTemplateId ===
                                                                    template.id
                                                                }
                                                            >
                                                                <button
                                                                    type="button"
                                                                    className="flex w-full items-center justify-between"
                                                                    disabled={
                                                                        !template.implemented
                                                                    }
                                                                    onClick={() => {
                                                                        const tabId =
                                                                            createTab(
                                                                                template.id
                                                                            )
                                                                        if (
                                                                            !tabId
                                                                        )
                                                                            return
                                                                        navigate(
                                                                            `/tabs/${tabId}`
                                                                        )
                                                                    }}
                                                                >
                                                                    <span>
                                                                        {
                                                                            template.label
                                                                        }
                                                                    </span>
                                                                    {!template.implemented && (
                                                                        <span className="text-[8px] opacity-65 uppercase tracking-wide">
                                                                            {template.comingSoonLabel ||
                                                                                'Coming soon'}
                                                                        </span>
                                                                    )}
                                                                </button>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    )
                                                )}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                            ))}
                            {visibleGroups.length === 0 && (
                                <p className="px-2 py-1.5 text-xs text-sidebar-foreground/70">
                                    Every game pack is hidden. Bring one back
                                    from the sliders above.
                                </p>
                            )}
                        </SidebarMenu>
                    </SidebarGroup>
                    <NavSecondary
                        items={navSecondaryItems}
                        className="mt-auto"
                    />
                </SidebarContent>
                <SidebarFooter>
                    <div className="flex items-center justify-center text-xs text-center">
                        Created by 4rtamis <br />
                    </div>
                </SidebarFooter>
            </Sidebar>

            <FeedbackDialog
                open={feedbackDialogOpen}
                onOpenChange={setFeedbackDialogOpen}
            />
        </>
    )
}
