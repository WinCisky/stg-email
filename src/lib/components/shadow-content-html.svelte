<script lang="ts">
    import { onMount } from "svelte";
    import { mailStore, emails } from "$lib/stores/accounts.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import type { Email } from "$lib/data";

    let shadow: ShadowRoot | null;
    let shadowHost: HTMLDivElement;

    let {
        selectedResolution,
        emailToShow,
    }: {
        selectedResolution: "desktop" | "tablet" | "mobile";
        emailToShow?: Email;
    } = $props();

    function updateShownEmail(selectedEmail: Email) {
        if (!shadow) return;
        shadow.innerHTML = `<style>
				:host {
					all : initial;
				}
			</style>`;
        const shadowEmailContent: any = document.createElement("div");
        shadowEmailContent.innerHTML = selectedEmail.html;
        shadow.appendChild(shadowEmailContent);
    }

    onMount(() => {
        shadow =
            shadowHost.shadowRoot || shadowHost.attachShadow({ mode: "open" });

        mailStore.subscribe((email) => {
            if (!email.selected) return;
            updateShownEmail(email.selected);
        });

        if (emailToShow) {
            updateShownEmail(emailToShow);
        }
    });
</script>

{#if emailToShow}
    <div class="bg-white overflow-auto">
        <div bind:this={shadowHost}></div>
    </div>
{:else}
    <Card.Root
        class={`mx-auto transition-all duration-500 ${
            selectedResolution === "desktop"
                ? "max-w-full"
                : selectedResolution === "tablet"
                ? "max-w-[768px]"
                : "max-w-[375px]"
        }`}
    >
        <Card.Content>
            <div class="bg-white overflow-auto">
                <div bind:this={shadowHost}></div>
            </div>
        </Card.Content>
    </Card.Root>
{/if}