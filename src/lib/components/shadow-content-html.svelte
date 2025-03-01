<script lang="ts">
    import { onMount } from "svelte";
    import { mailStore } from "$lib/stores/accounts.js";
    import * as Card from "$lib/components/ui/card/index.js";

    let shadow: ShadowRoot | null;
    let shadowHost: HTMLDivElement;

    let {
        selectedResolution,
    }: { selectedResolution: "desktop" | "tablet" | "mobile" } = $props();

    onMount(() => {
        shadow =
            shadowHost.shadowRoot || shadowHost.attachShadow({ mode: "open" });

        mailStore.subscribe((mail) => {
            if (!shadow) return;
            shadow.innerHTML = `<style>
				:host {
					all : initial;
				}
			</style>`;
            const shadowEmailContent: any = document.createElement("div");
            shadowEmailContent.innerHTML = mail.selected?.html;
            shadow.appendChild(shadowEmailContent);
        });
    });
</script>

<Card.Root
    class={`mx-auto transition-all duration-500 overflow-auto ${
        selectedResolution === "desktop"
            ? "max-w-full"
            : selectedResolution === "tablet"
              ? "max-w-[768px]"
              : "max-w-[375px]"
    }`}
>
    <Card.Content>
        <div class="bg-white" bind:this={shadowHost}></div>
    </Card.Content>
</Card.Root>
