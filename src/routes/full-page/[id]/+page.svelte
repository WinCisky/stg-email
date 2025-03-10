<script lang="ts">
    import ShadowContentHtml from "$lib/components/shadow-content-html.svelte";
    import { page } from '$app/state';
    import { onMount } from "svelte";

    onMount(() => {
        // TODO: get emai from endpoint
        console.log(page.params.id);
    });
</script>

{#if page.params.id}
    <ShadowContentHtml selectedResolution="desktop" />
{/if}