<script lang="ts">
    import { base } from "$app/paths";
    import Plus from "lucide-svelte/icons/plus";
    import Trash from "lucide-svelte/icons/trash";

    import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
    import * as Tabs from "$lib/components/ui/tabs/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
</script>

<div class="md:hidden">TODO: MOBILE</div>
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
                    <Card.Root>
                        <Card.Header
                            class="flex flex-row items-center justify-between space-y-0 pb-2"
                        >
                            <a href={`${base}/inbox`}>
                                <Card.Title class="text-sm font-medium"
                                    >Test email placeholder</Card.Title
                                >
                            </a>
                            <Dialog.Root>
                                <Dialog.Trigger
                                    class={buttonVariants({
                                        variant: "outline",
                                        size: "sm",
                                    })}>
                                        <Trash />
                                    </Dialog.Trigger
                                >
                                <Dialog.Content>
                                    <Dialog.Header>
                                        <Dialog.Title
                                            >Are you sure absolutely sure?</Dialog.Title
                                        >
                                        <Dialog.Description>
                                            This action will only remove the account from your home listing.
                                            No emails will be deleted in the process.
                                        </Dialog.Description>
                                    </Dialog.Header>
                                    <Dialog.Footer>
                                        <Button>Delete</Button>
                                      </Dialog.Footer>
                                </Dialog.Content>
                            </Dialog.Root>
                        </Card.Header>
                        <a href={`${base}/inbox`}>
                            <Card.Content>
                                <div class="text-2xl font-bold">
                                    2315 emails
                                </div>
                                <p class="text-muted-foreground text-xs">
                                    last email 2 minutes ago
                                </p>
                            </Card.Content>
                        </a>
                    </Card.Root>

                    <a href={`${base}/add-inbox`}>
                        <Card.Root class="h-full">
                            <Card.Content class="h-full">
                                <div
                                    class="h-full flex justify-center items-center text-2xl font-bold"
                                >
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
