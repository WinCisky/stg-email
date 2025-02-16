<script lang="ts">
    import Plus from "lucide-svelte/icons/plus";
	import User from "lucide-svelte/icons/user";

    import * as Tabs from "$lib/components/ui/tabs/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
</script>

<div class="md:hidden">
    TODO: MOBILE
</div>
<div class="hidden flex-col md:flex">
	<div class="flex-1 space-y-4 p-8 pt-6">
		<div class="flex items-center justify-between space-y-2">
			<h2 class="text-3xl font-bold tracking-tight">Dashboard</h2>
		</div>
		<Tabs.Root value="default" class="space-y-4">
			<Tabs.List>
				<Tabs.Trigger value="default">Default</Tabs.Trigger>
				<!-- <Tabs.Trigger value="alphabetical" disabled>Alphabetical</Tabs.Trigger>
				<Tabs.Trigger value="recent" disabled>Recent</Tabs.Trigger> -->
			</Tabs.List>
			<Tabs.Content value="default" class="space-y-4">
				<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <a href="#">
                        <Card.Root>
                            <Card.Header
                                class="flex flex-row items-center justify-between space-y-0 pb-2"
                            >
                                <Card.Title class="text-sm font-medium">Test email placeholder</Card.Title>
                                <User class="text-muted-foreground h-4 w-4" />
                            </Card.Header>
                            <Card.Content>
                                <div class="text-2xl font-bold">2315 emails</div>
                                <p class="text-muted-foreground text-xs">last email 2 minutes ago</p>
                            </Card.Content>
                        </Card.Root>
                    </a>

                    <a href="#">
                        <Card.Root class="h-full">
                            <Card.Content class="h-full">
                                <div class="h-full flex justify-center items-center text-2xl font-bold">
                                    <Plus />
                                </div>
                            </Card.Content>
                        </Card.Root>
                    </a>
				</div>
			</Tabs.Content>
		</Tabs.Root>
	</div>
</div>