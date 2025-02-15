<script lang="ts">
    import Mail from "$lib/components/mail.svelte";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import AppSidebar from "$lib/components/app-sidebar.svelte";
</script>

<Sidebar.Provider>
	<AppSidebar />
	<main class="w-full">
        <Mail />
	</main>
</Sidebar.Provider>
