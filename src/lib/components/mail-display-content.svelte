<script lang="ts">
    import * as Tabs from "$lib/components/ui/tabs/index.js";
    import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
    import * as Table from "$lib/components/ui/table/index.js";
    import { mailStore } from "$lib/stores/accounts.js";

    import Monitor from "lucide-svelte/icons/monitor";
    import Tablet from "lucide-svelte/icons/tablet";
    import Smartphone from "lucide-svelte/icons/smartphone";

    import ShadowContentHtml from "./shadow-content-html.svelte";

    let selectedTab: string = $state("html");
    let selectedResolution: "desktop" | "tablet" | "mobile" = $state("desktop");
</script>

<Tabs.Root class="w-full" bind:value={selectedTab}>
    <div class="flex justify-between w-full">
        <Tabs.List>
            <Tabs.Trigger value="html">Html</Tabs.Trigger>
            <Tabs.Trigger value="source">Source</Tabs.Trigger>
            <Tabs.Trigger value="text">Text</Tabs.Trigger>
            <Tabs.Trigger value="raw">Raw</Tabs.Trigger>
            <Tabs.Trigger value="headers">Headers</Tabs.Trigger>
        </Tabs.List>

        {#if selectedTab === "html"}
            <ToggleGroup.Root type="single" bind:value={selectedResolution}>
                <ToggleGroup.Item
                    value="desktop"
                    aria-label="Toggle desktop view"
                >
                    <Monitor class="size-4" />
                </ToggleGroup.Item>
                <ToggleGroup.Item
                    value="tablet"
                    aria-label="Toggle tablet view"
                >
                    <Tablet class="size-4" />
                </ToggleGroup.Item>
                <ToggleGroup.Item
                    value="mobile"
                    aria-label="Toggle mobile view"
                >
                    <Smartphone class="size-4" />
                </ToggleGroup.Item>
            </ToggleGroup.Root>
        {/if}
    </div>
    <Tabs.Content value="html">
        <ShadowContentHtml {selectedResolution} />
    </Tabs.Content>
    <Tabs.Content value="source">SOURCE CONTENT</Tabs.Content>
    <Tabs.Content value="text">TEXT CONTENT</Tabs.Content>
    <Tabs.Content value="raw">RAW CONTENT</Tabs.Content>
    <Tabs.Content value="headers">
        <Table.Root>
            <Table.Header>
                <Table.Row>
                    <Table.Head>Key</Table.Head>
                    <Table.Head>Value</Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {#each $mailStore.selected?.headers ?? [] as header}
                    <Table.Row>
                        <Table.Cell>{header.key}</Table.Cell>
                        <Table.Cell>{header.value}</Table.Cell>
                    </Table.Row>
                {/each}
            </Table.Body>
        </Table.Root>
    </Tabs.Content>
</Tabs.Root>
