<script lang="ts">
    import * as Select from "$lib/components/ui/select/index.js";
    import Gmail from "$lib/components/icons/gmail.svelte";

    let { isCollapsed } = $props();

    const accounts = [
        { value: "apple", label: "Apple" },
        { value: "banana", label: "Banana" },
        { value: "blueberry", label: "Blueberry" },
        { value: "grapes", label: "Grapes" },
        { value: "pineapple", label: "Pineapple" },
    ];

    let value = $state(accounts[0].value);

    const triggerContent = $derived(
        accounts.find((a) => a.value === value)?.label ?? "Select an account",
    );
</script>

<Select.Root type="single" name="favoriteFruit" bind:value>
    <Select.Trigger class="w-full">
        <Gmail aria-hidden="true" class="text-foreground size-4 shrink-0" />
        {triggerContent}
    </Select.Trigger>
    <Select.Content>
        <Select.Group>
            <Select.GroupHeading>Accounts</Select.GroupHeading>
            {#each accounts as account}
                <Select.Item value={account.value} label={account.label}>
                    <div
                        class="[&_svg]:text-foreground flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0"
                    >
                        <Gmail
                            aria-hidden="true"
                            class="text-foreground size-4 shrink-0"
                        />
                        {account.label}
                    </div>
                </Select.Item>
            {/each}
        </Select.Group>
    </Select.Content>
</Select.Root>
