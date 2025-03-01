<script lang="ts">
    import * as Tabs from "$lib/components/ui/tabs/index.js";
    import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
    import * as Table from "$lib/components/ui/table/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import { mailStore } from "$lib/stores/accounts.js";
    import he from 'he';

    import Monitor from "lucide-svelte/icons/monitor";
    import Tablet from "lucide-svelte/icons/tablet";
    import Smartphone from "lucide-svelte/icons/smartphone";

    import ShadowContentHtml from "./shadow-content-html.svelte";

    let selectedTab: string = $state("html");
    let selectedResolution: "desktop" | "tablet" | "mobile" = $state("desktop");

    function escapeHTML(text: string) {
        return he.decode(text);
    }
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
    <Tabs.Content value="raw">
        <Card.Root>
            <Card.Content>
                <pre>{escapeHTML($mailStore.selected?.raw ?? "")}</pre>
            </Card.Content>
        </Card.Root>
    </Tabs.Content>
    <Tabs.Content value="headers">
        <Card.Root>
            <Card.Content>
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
            </Card.Content>
        </Card.Root>
    </Tabs.Content>
</Tabs.Root>
