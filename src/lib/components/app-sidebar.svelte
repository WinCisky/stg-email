<script lang="ts">
    import { base } from "$app/paths";
    import { onMount } from "svelte";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import { Separator } from "$lib/components/ui/separator/index.js";
    import { currentAccount } from "$lib/stores/accounts.js";
    import type { AccountCredentials } from "$lib/data.ts";

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
            url: `${base}/inbox`,
            icon: Inbox,
        },
    ];

    let account: AccountCredentials | null = null;

    onMount(() => {
        currentAccount.subscribe((value) => {
            account = value;
        });
    });
</script>

<Sidebar.Root collapsible="offcanvas">
    <Sidebar.Header>
        <Sidebar.Menu>
            <Sidebar.MenuItem>
                <div class="flex items-center px-4 py-2">
                    <h3 class="text-l font-bold">
                        {account?.name ?? "Account"}
                    </h3>
                </div>
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
