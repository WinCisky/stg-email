<script lang="ts">
    import { base } from "$app/paths";
    import { onDestroy, onMount } from "svelte";
    import { toast } from "svelte-sonner";
    import type { Account, AccountCredentials } from "$lib/data.ts";
    import Plus from "lucide-svelte/icons/plus";
    import EllipsisVertical from "lucide-svelte/icons/ellipsis-vertical";
    import Copy from "lucide-svelte/icons/copy";
    import { accounts, currentAccount } from "$lib/stores/accounts.js";
    import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
    import * as Tabs from "$lib/components/ui/tabs/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
    import { Skeleton } from "$lib/components/ui/skeleton/index.js";
    import { timeSince } from "$lib/utils.js";
    import { getAccountsStatsFromApi, postBurnAccount } from "$lib/api";
    import { writable } from "svelte/store";
    import Laravel from "$lib/assets/Laravel.svg";

    let accountList: Account[] = $state([]);
    let account: AccountCredentials | null = $state(null);
    let isDeleteDialogOpen = $state(false);
    let isBurnDialogOpen = $state(false);
    let selectedAccount: Account | null = $state(null);
    let codeContent = `MAIL_DRIVER=smtp
MAIL_HOST=test.opentrust.it
MAIL_PORT=465
MAIL_USERNAME=username
MAIL_PASSWORD=password`;

    const currentTime = writable(Date.now());
    const interval = setInterval(() => {
        currentTime.set(Date.now());
    }, 1000);

    onDestroy(() => {
        clearInterval(interval);
    });

    onMount(() => {
        accounts.subscribe((value) => {
            accountList = Array.from(value);
        });
        currentAccount.subscribe((value) => {
            account = value;
        });

        updateAccountsStats();
    });

    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text);
        toast("Copied to clipboard");
        toast.success("Copied to clipboard", {
            description: "The configuration has been copied to the clipboard.",
        });
    }

    async function updateAccountsStats() {
        const accountsCredentials = accountList.map((a) => {
            return { username: a.name, password: a.password };
        });
        const accountStats = await getAccountsStatsFromApi(accountsCredentials);
        const updatedAccountList = accountList.map((a) => {
            const stats = accountStats.find(
                (s: {
                    username: string;
                    password: string;
                    totalEmails: number;
                    lastEmailDate: string;
                }) => s.username === a.name && s.password === a.password,
            );
            return {
                ...a,
                total: stats?.totalEmails,
                last: stats?.lastEmailDate,
                lastUpdate: new Date(),
            };
        });
        accountList = updatedAccountList;
    }

    async function deleteSelectedAccount() {
        accounts.update((set) => {
            set.forEach((account) => {
                if (
                    selectedAccount &&
                    account.name === selectedAccount.name &&
                    account.password === selectedAccount.password
                ) {
                    set.delete(account);
                }
            });
            return set;
        });
        isDeleteDialogOpen = false;
    }

    async function burnSelectedAccount() {
        if (!selectedAccount) return;
        await postBurnAccount(selectedAccount.name, selectedAccount.password);
        isBurnDialogOpen = false;
        await updateAccountsStats();
    }

    function openDeleteAccountAlertDialog(account: Account) {
        selectedAccount = account;
        isDeleteDialogOpen = true;
    }

    function openBurnAccountAlertDialog(account: Account) {
        selectedAccount = account;
        isBurnDialogOpen = true;
    }

    function selectAccount(account: AccountCredentials) {
        currentAccount.set(account);
        window.location.href = `${base}/inbox`;
    }
</script>

<div class="flex flex-col">
    <div class="flex-1 space-y-4 p-8 pt-6">
        <div class="flex items-center justify-between space-y-2">
            <h2 class="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <div>
            <h3 class="text-xl font-bold tracking-tight mt-8">Accounts</h3>
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
                                <DropdownMenu.Root>
                                    <DropdownMenu.Trigger
                                        class={buttonVariants({
                                            variant: "ghost",
                                            size: "icon",
                                        })}
                                    >
                                        <EllipsisVertical class="size-4" />
                                        <span class="sr-only">More</span>
                                    </DropdownMenu.Trigger>
                                    <DropdownMenu.Content align="end">
                                        <DropdownMenu.Item
                                            onclick={() =>
                                                openBurnAccountAlertDialog(
                                                    account,
                                                )}>Burn</DropdownMenu.Item
                                        >
                                        <DropdownMenu.Item
                                            onclick={() =>
                                                openDeleteAccountAlertDialog(
                                                    account,
                                                )}
                                            >Delete
                                        </DropdownMenu.Item>
                                    </DropdownMenu.Content>
                                </DropdownMenu.Root>
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
                                    <div class="flex items-baseline gap-4">
                                        <span>
                                            {account.total && account.total > 0
                                                ? account.total
                                                : "no"} emails
                                        </span>
                                        {#if !account.lastUpdate}
                                            <Skeleton
                                                class="h-4 w-4 rounded-full"
                                            />
                                        {:else}
                                            {#await $currentTime}
                                                <Skeleton
                                                    class="h-4 w-4 rounded-full"
                                                />
                                            {:then time}
                                                {#if (time - account.lastUpdate.getTime()) / 1000 < 60}
                                                    <div
                                                        class="h-3 w-3 rounded-full bg-green-400"
                                                    ></div>
                                                {:else if (time - account.lastUpdate.getTime()) / 1000 < 60 * 5}
                                                    <div
                                                        class="h-3 w-3 rounded-full bg-yellow-400"
                                                    ></div>
                                                {:else}
                                                    <div
                                                        class="h-3 w-3 rounded-full bg-red-400"
                                                    ></div>
                                                {/if}
                                            {/await}
                                        {/if}
                                    </div>
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
        <Dialog.Root bind:open={isDeleteDialogOpen}>
            <Dialog.Content>
                <Dialog.Header>
                    <Dialog.Title>Delete Account?</Dialog.Title>
                    <Dialog.Description>
                        This will remove the account from your list.
                    </Dialog.Description>
                </Dialog.Header>
                <Dialog.Footer>
                    <Button onclick={() => deleteSelectedAccount()}>
                        Delete
                    </Button>
                </Dialog.Footer>
            </Dialog.Content>
        </Dialog.Root>
        <Dialog.Root bind:open={isBurnDialogOpen}>
            <Dialog.Content>
                <Dialog.Header>
                    <Dialog.Title>Burn Account?</Dialog.Title>
                    <Dialog.Description>
                        This will remove all emails from the account.
                    </Dialog.Description>
                </Dialog.Header>
                <Dialog.Footer>
                    <Button onclick={() => burnSelectedAccount()}>Burn</Button>
                </Dialog.Footer>
            </Dialog.Content>
        </Dialog.Root>

        <div>
            <h3 class="text-xl font-bold tracking-tight mt-8">Configuration</h3>
        </div>

        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card.Root>
                <Card.Header>
                    <Card.Title>
                        <div class="flex items-center justify-between">
                            <div class="flex gap-2">
                                <img
                                    src={Laravel}
                                    alt="Laravel"
                                    class="h-6 w-6"
                                />
                                <span class="ml-2">Laravel</span>
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                onclick={() => copyToClipboard(codeContent)}
                            >
                                <Copy />
                            </Button>
                        </div>
                    </Card.Title>
                </Card.Header>
                <Card.Content>
                    <ScrollArea class="w-full" orientation="horizontal">
                        <pre class="text-sm"><code>{codeContent}</code></pre>
                    </ScrollArea>
                </Card.Content>
            </Card.Root>
        </div>
    </div>
</div>
