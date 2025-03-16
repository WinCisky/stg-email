<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import type { Account, AccountCredentials } from "$lib/data.ts";
    import {
        accounts,
        currentAccount,
        selectedSorting,
    } from "$lib/stores/accounts.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Tabs from "$lib/components/ui/tabs/index.js";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import AccountList from "$lib/components/account-list.svelte";
    import ConfigurationSnippet from "$lib/components/configuration-snippet.svelte";
    import { getAccountsStatsFromApi, postBurnAccount } from "$lib/api";
    import { writable } from "svelte/store";
    import { Skeleton } from "$lib/components/ui/skeleton/index.js";

    let accountList: Account[] = $state([]);
    let account: AccountCredentials | null = $state(null);
    let isDeleteDialogOpen = $state(false);
    let isBurnDialogOpen = $state(false);
    let selectedAccount: Account | null = $state(null);

    let createdSortedAccountList = $derived.by(() => {
        const list = Array.from(accountList);
        // reverse the list to show the last created account first
        return list.reverse();
    });

    let alphabeticallySortedAccountList = $derived.by(() => {
        const list = Array.from(accountList);
        return list.sort((a, b) => a.name.localeCompare(b.name));
    });

    let recentSortedAccountList = $derived.by(() => {
        const list = Array.from(accountList);
        const sorted = list.sort((a, b) => {
            if (!a.lastUpdate && !b.lastUpdate) return 0;
            if (!a.lastUpdate) return -1;
            if (!b.lastUpdate) return 1;
            return new Date(b.lastUpdate).getTime() >
                new Date(a.lastUpdate).getTime()
                ? -1
                : 1;
        });
        return sorted;
    });

    const currentTime = writable(Date.now());
    const interval = setInterval(() => {
        currentTime.set(Date.now());
    }, 1000);
    const intervalUpdateStats = setInterval(() => {
        updateAccountsStats();
    }, 55000);

    onDestroy(() => {
        clearInterval(interval);
        clearInterval(intervalUpdateStats);
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
</script>

<div class="flex flex-col">
    <div class="flex-1 space-y-4 p-8 pt-6">
        <div class="flex items-center justify-between space-y-2">
            <h2 class="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <div>
            <h3 class="text-xl font-bold tracking-tight mt-8">Accounts</h3>
        </div>
        {#if $selectedSorting == null}
            <Skeleton class="h-[40px] w-[200px] rounded-full" />
            <Skeleton class="h-[170px] w-[320px] rounded-lg" />
        {:else}
            <Tabs.Root bind:value={$selectedSorting} class="space-y-4">
                <Tabs.List>
                    <Tabs.Trigger value="created">Created</Tabs.Trigger>
                    <Tabs.Trigger value="recent">Recent</Tabs.Trigger>
                    <Tabs.Trigger value="alphabetical">Name</Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="created" class="space-y-4">
                    <AccountList
                        accountList={createdSortedAccountList}
                        {currentTime}
                        {openDeleteAccountAlertDialog}
                        {openBurnAccountAlertDialog}
                    />
                </Tabs.Content>
                <Tabs.Content value="alphabetical" class="space-y-4">
                    <AccountList
                        accountList={alphabeticallySortedAccountList}
                        {currentTime}
                        {openDeleteAccountAlertDialog}
                        {openBurnAccountAlertDialog}
                    />
                </Tabs.Content>
                <Tabs.Content value="recent" class="space-y-4">
                    <AccountList
                        accountList={recentSortedAccountList}
                        {currentTime}
                        {openDeleteAccountAlertDialog}
                        {openBurnAccountAlertDialog}
                    />
                </Tabs.Content>
            </Tabs.Root>
        {/if}
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

        <ConfigurationSnippet />
    </div>
</div>
