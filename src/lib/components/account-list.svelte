<script lang="ts">
    import { base } from "$app/paths";
    import type { Account, AccountCredentials } from "$lib/data";
    import { formatTimeAgo } from "$lib/utils";
    import Plus from "lucide-svelte/icons/plus";
    import EllipsisVertical from "lucide-svelte/icons/ellipsis-vertical";
    import * as Card from "$lib/components/ui/card";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import { buttonVariants } from "$lib/components/ui/button";
    import { Skeleton } from "$lib/components/ui/skeleton";
    import { currentAccount } from "$lib/stores/accounts.js";
    
    const { 
        accountList = [],
        currentTime,
        openDeleteAccountAlertDialog,
        openBurnAccountAlertDialog 
    } = $props();
    
    function selectAccount(account: AccountCredentials) {
        currentAccount.set(account);
        window.location.href = `${base}/inbox`;
    }
</script>

<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    {#each accountList as account (account.name + account.password)}
        <Card.Root>
            <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
                <Card.Title
                    class="text-sm font-medium cursor-pointer"
                    onclick={() => selectAccount({
                        name: account.name,
                        password: account.password,
                    })}
                >
                    {account.name}
                </Card.Title>
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
                        <DropdownMenu.Item onclick={() => openBurnAccountAlertDialog(account)}>
                            Burn
                        </DropdownMenu.Item>
                        <DropdownMenu.Item onclick={() => openDeleteAccountAlertDialog(account)}>
                            Delete
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            </Card.Header>
            <Card.Content
                class="cursor-pointer"
                onclick={() => selectAccount({
                    name: account.name,
                    password: account.password,
                })}
            >
                <div class="text-2xl font-bold">
                    <div class="flex items-baseline gap-4">
                        <span>
                            {account.total && account.total > 0 ? account.total : "no"} emails
                        </span>
                        {#if !account.lastUpdate}
                            <Skeleton class="h-4 w-4 rounded-full" />
                        {:else}
                            {#await $currentTime}
                                <Skeleton class="h-4 w-4 rounded-full" />
                            {:then time}
                                {#if (time - account.lastUpdate.getTime()) / 1000 < 60}
                                    <div class="h-3 w-3 rounded-full bg-green-400"></div>
                                {:else if (time - account.lastUpdate.getTime()) / 1000 < 60 * 5}
                                    <div class="h-3 w-3 rounded-full bg-yellow-400"></div>
                                {:else}
                                    <div class="h-3 w-3 rounded-full bg-red-400"></div>
                                {/if}
                            {/await}
                        {/if}
                    </div>
                </div>
                {#await $currentTime}
                    <p class="text-muted-foreground text-xs">loading...</p>
                {:then time}
                    <p class="text-muted-foreground text-xs">
                        last email {account.last
                            ? formatTimeAgo(new Date(`${account.last} UTC`), new Date(time))
                            : "never"}
                    </p>
                {/await}
            </Card.Content>
        </Card.Root>
    {/each}

    <a href={`${base}/add-inbox`}>
        <Card.Root class="h-full">
            <Card.Content class="h-full">
                <div class="h-full flex justify-center items-center text-2xl font-bold">
                    <Plus />
                </div>
            </Card.Content>
        </Card.Root>
    </a>
</div>