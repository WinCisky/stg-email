<script lang="ts">
    import { base } from "$app/paths";
    import { onMount } from "svelte";
    import type { Account, AccountCredentials } from "$lib/data.ts";
    import Plus from "lucide-svelte/icons/plus";
    import Trash from "lucide-svelte/icons/trash";
    import { accounts, currentAccount } from "$lib/stores/accounts.js";
    import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
    import * as Tabs from "$lib/components/ui/tabs/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { timeSince } from "$lib/utils.js";

    let accountList: Account[] = [];
    let account: AccountCredentials | null = null;

    onMount(() => {
        accounts.subscribe((value) => {
            accountList = Array.from(value);
        });
        currentAccount.subscribe((value) => {
            account = value;
        });
    });

    function deleteAccount(account: Account) {
        accounts.update((set) => {
            set.delete(account);
            return set;
        });
    }

    function selectAccount(account: AccountCredentials) {
        currentAccount.set(account);
        window.location.href = `${base}/inbox`;
    }
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
                    {#each accountList as account (account.name + account.password)}
                        <Card.Root>
                            <Card.Header
                                class="flex flex-row items-center justify-between space-y-0 pb-2"
                            >
                                <Card.Title
                                    class="text-sm font-medium cursor-pointer"
                                    onclick={() =>
                                        selectAccount({
                                            name: account.name,
                                            password: account.password,
                                        })}>{account.name}</Card.Title
                                >
                                <Dialog.Root>
                                    <Dialog.Trigger
                                        class={buttonVariants({
                                            variant: "outline",
                                            size: "sm",
                                        })}
                                    >
                                        <Trash />
                                    </Dialog.Trigger>
                                    <Dialog.Content>
                                        <Dialog.Header>
                                            <Dialog.Title
                                                >Are you sure absolutely sure?</Dialog.Title
                                            >
                                            <Dialog.Description>
                                                This action will only remove the
                                                account from your home listing.
                                                No emails will be deleted in the
                                                process.
                                            </Dialog.Description>
                                        </Dialog.Header>
                                        <Dialog.Footer>
                                            <Button
                                                onclick={() =>
                                                    deleteAccount(account)}
                                            >
                                                Delete
                                            </Button>
                                        </Dialog.Footer>
                                    </Dialog.Content>
                                </Dialog.Root>
                            </Card.Header>
                            <Card.Content
                                class="cursor-pointer"
                                onclick={() =>
                                    selectAccount({
                                        name: account.name,
                                        password: account.password,
                                    })}
                            >
                                <div class="text-2xl font-bold">
                                    {account.total ?? "no"} emails
                                </div>
                                <p class="text-muted-foreground text-xs">
                                    last email {account.last
                                        ? timeSince(account.last)
                                        : "long"} ago
                                </p>
                            </Card.Content>
                        </Card.Root>
                    {/each}

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
