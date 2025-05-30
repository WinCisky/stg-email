<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import type { Account, AccountCredentials } from "$lib/data.ts";
    import {
        accounts,
        currentAccount,
        selectedSorting,
    } from "$lib/stores/accounts.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import AccountList from "$lib/components/account-list.svelte";
    import ConfigurationSnippet from "$lib/components/configuration-snippet.svelte";
    import { getAccountsStatsFromApi, postBurnAccount } from "$lib/api";
    import { writable } from "svelte/store";
    import { Skeleton } from "$lib/components/ui/skeleton/index.js";
    import RadioGroup from "$lib/components/radio-group.svelte";
    import { getGreeting } from "$lib/utils";

    let accountList: Account[] = $state([]);
    let account: AccountCredentials | null = $state(null);
    let isDeleteDialogOpen = $state(false);
    let isBurnDialogOpen = $state(false);
    let selectedAccount: Account | null = $state(null);

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
            const newSet = new Set(accountList);
            newSet.forEach((account) => {
                if (
                    selectedAccount &&
                    account.name === selectedAccount.name &&
                    account.password === selectedAccount.password
                ) {
                    newSet.delete(account);
                }
            });
            return newSet;
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
            <h2 class="text-3xl font-bold tracking-tight">{ getGreeting() }</h2>
        </div>
        <div>
            <h3 class="text-xl font-bold tracking-tight mt-8">Saved Accounts</h3>
        </div>
        {#if $selectedSorting == null}
            <Skeleton class="h-[40px] w-[200px] rounded-full" />
            <Skeleton class="h-[170px] w-[320px] rounded-lg" />
        {:else}
            <RadioGroup
                bind:value={$selectedSorting}
                options={[
                    { label: "Created", value: "created" },
                    { label: "Recent", value: "recent" },
                    { label: "Name", value: "alphabetical" }
                ]}
            />
            <AccountList
                accountList={accountList}
                sortingValue={$selectedSorting}
                {currentTime}
                {openDeleteAccountAlertDialog}
                {openBurnAccountAlertDialog}
            />
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
