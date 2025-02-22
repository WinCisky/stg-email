<script lang="ts">
    import { onMount } from "svelte";
    import { mailStore } from "$lib/stores/accounts.js";

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

<div
    class={`mx-auto transition-all duration-500 bg-white text-card-foreground rounded-lg borde overflow-auto ${
        selectedResolution === "desktop"
            ? "max-w-full"
            : selectedResolution === "tablet"
              ? "max-w-[768px]"
              : "max-w-[375px]"
    }`}
>
    <div bind:this={shadowHost}></div>
</div>
