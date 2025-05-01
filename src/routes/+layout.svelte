<script lang="ts">
	import "../app.css";
	import posthog from "posthog-js";
	import { ModeWatcher } from "mode-watcher";
	import { Toaster } from "$lib/components/ui/sonner/index.js";
	import { browser } from '$app/environment';
	import { onMount } from "svelte";

	let { children } = $props();

	onMount(() => {
		if (browser) {
			posthog.init("phc_CYkAmF9HnJGplaIIImkuxg5A03u8rqt50cThrYrI46D", {
				api_host: "https://eu.i.posthog.com",
				person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
			});
		}
	});
</script>

<ModeWatcher />
<Toaster />
{@render children?.()}
