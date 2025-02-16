<script lang="ts">
    import { base } from "$app/paths";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import AccountSwitcher from "$lib/components/account-switcher.svelte";
	import { Separator } from "$lib/components/ui/separator/index.js";

    import House from "lucide-svelte/icons/house";
    import Inbox from "lucide-svelte/icons/inbox";

    const items = [
        {
            title: "Home",
            url: `${base}/`,
            icon: House,
        },
        {
            title: "Inbox",
            url: `${base}/emails`,
            icon: Inbox,
        }
    ];
</script>

<Sidebar.Root collapsible="icon">
    <Sidebar.Header>
        <Sidebar.Menu>
            <Sidebar.MenuItem>
                <AccountSwitcher isCollapsed={false} />
            </Sidebar.MenuItem>
        </Sidebar.Menu>
    </Sidebar.Header>
    <Separator />
    <Sidebar.Content>
        <Sidebar.Group>
            <Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
            <Sidebar.GroupContent>
                <Sidebar.Menu>
                    {#each items as item (item.title)}
                        <Sidebar.MenuItem>
                            <Sidebar.MenuButton>
                                {#snippet child({ props })}
                                    <a href={item.url} {...props}>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </a>
                                {/snippet}
                            </Sidebar.MenuButton>
                        </Sidebar.MenuItem>
                    {/each}
                </Sidebar.Menu>
            </Sidebar.GroupContent>
        </Sidebar.Group>
    </Sidebar.Content>
    <Sidebar.Footer />
    <Sidebar.Rail />
</Sidebar.Root>
