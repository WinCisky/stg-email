<script lang="ts">
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import * as Select from "$lib/components/ui/select/index.js";

    const fruits = [
        { value: "apple", label: "Apple" },
        { value: "banana", label: "Banana" },
        { value: "blueberry", label: "Blueberry" },
        { value: "grapes", label: "Grapes" },
        { value: "pineapple", label: "Pineapple" },
    ];

    let value = $state("");

    const triggerContent = $derived(
        fruits.find((f) => f.value === value)?.label ?? "Select a fruit",
    );
</script>

<Sidebar.Root collapsible="icon">
    <Sidebar.Header>
        <Sidebar.Menu>
            <Sidebar.MenuItem>
                <Select.Root type="single" name="favoriteFruit" bind:value>
                    <Select.Trigger class="w-full">
                        {triggerContent}
                    </Select.Trigger>
                    <Select.Content>
                        <Select.Group>
                            <Select.GroupHeading>Fruits</Select.GroupHeading>
                            {#each fruits as fruit}
                                <Select.Item
                                    value={fruit.value}
                                    label={fruit.label}
                                    >{fruit.label}</Select.Item
                                >
                            {/each}
                        </Select.Group>
                    </Select.Content>
                </Select.Root>
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
