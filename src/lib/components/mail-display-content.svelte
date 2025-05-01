<script lang="ts">
    import { mode } from "mode-watcher";
    import * as Tabs from "$lib/components/ui/tabs/index.js";
    import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
    import * as Table from "$lib/components/ui/table/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import { mailStore } from "$lib/stores/accounts.js";
    import he from "he";
    import { basicSetup, EditorView } from "codemirror";
    import { EditorState } from "@codemirror/state";
    import { html } from "@codemirror/lang-html";
    import { githubLight } from "@ddietr/codemirror-themes/github-light";
    import { githubDark } from "@ddietr/codemirror-themes/github-dark";

    import Monitor from "lucide-svelte/icons/monitor";
    import Tablet from "lucide-svelte/icons/tablet";
    import Smartphone from "lucide-svelte/icons/smartphone";

    import ShadowContentHtml from "./shadow-content-html.svelte";
    import Spam from "./spam.svelte";
    import { onMount } from "svelte";

    let selectedTab: string = $state("html");
    let selectedResolution: "desktop" | "tablet" | "mobile" = $state("desktop");
    let editorView: EditorView | null = null;

    function escapeHTML(text: string) {
        return he.decode(text);
    }

    mailStore.subscribe((value) => {
        if (value.selected?.text) {
            selectedTab = "text";
        }
        if (value.selected?.html) {
            selectedTab = "html";
        }
        if (editorView) {
            editorView.dispatch({
                changes: {
                    from: 0,
                    to: editorView.state.doc.length,
                    insert: value.selected?.html ?? "",
                },
            });
        }
    });

    onMount(() => {
        const editor = document.getElementById("editor-code-mirror");
        if (!editor) {
            return;
        }
        editorView = new EditorView({
            doc: $mailStore.selected?.html ?? "",
            parent: editor,
            extensions: [
                basicSetup,
                html(),
                EditorState.readOnly.of(true),
                EditorView.editable.of(false),
                EditorView.contentAttributes.of({ tabindex: "0" }),
                mode.current === "dark" ? githubDark : githubLight,
            ],
        });
    });
</script>

<Tabs.Root class="w-full" bind:value={selectedTab}>
    <div class="flex justify-between w-full">
        <Tabs.List class="flex flex-wrap h-auto">
            <Tabs.Trigger value="html" disabled={!$mailStore.selected?.html}>
                Html
            </Tabs.Trigger>
            <Tabs.Trigger value="source" disabled={!$mailStore.selected?.html}>
                Source
            </Tabs.Trigger>
            <Tabs.Trigger value="text" disabled={!$mailStore.selected?.text}>
                Text
            </Tabs.Trigger>
            <Tabs.Trigger value="raw">Raw</Tabs.Trigger>
            <Tabs.Trigger value="spam">Spam</Tabs.Trigger>
            <Tabs.Trigger value="headers">Headers</Tabs.Trigger>
        </Tabs.List>

        {#if selectedTab === "html"}
            <ToggleGroup.Root
                type="single"
                bind:value={selectedResolution}
                class="hidden lg:flex"
            >
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
    <Tabs.Content value="source">
        <Card.Root>
            <Card.Content>
                <div id="editor-code-mirror"></div>
            </Card.Content>
        </Card.Root>
    </Tabs.Content>
    <Tabs.Content value="text">
        <Card.Root>
            <Card.Content>
                <div>
                    {$mailStore.selected?.text}
                </div>
            </Card.Content>
        </Card.Root>
    </Tabs.Content>
    <Tabs.Content value="raw">
        <Card.Root>
            <Card.Content>
                <pre class="overflow-auto">{escapeHTML(
                        $mailStore.selected?.raw ?? "",
                    )}</pre>
            </Card.Content>
        </Card.Root>
    </Tabs.Content>
    <Tabs.Content value="spam">
        <Spam />
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
