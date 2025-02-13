<script lang="ts">
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import AccountSwitcher from "$lib/components/account-switcher.svelte";
</script>

<Sidebar.Root collapsible="icon">
    <Sidebar.Header>
        <Sidebar.Menu>
            <Sidebar.MenuItem>
                <AccountSwitcher isCollapsed={false} />
            </Sidebar.MenuItem>
        </Sidebar.Menu>
    </Sidebar.Header>
    <Sidebar.Content>
        <Sidebar.Group />
        <Sidebar.Group />
    </Sidebar.Content>
    <Sidebar.Footer />
    <Sidebar.Rail />
</Sidebar.Root>
