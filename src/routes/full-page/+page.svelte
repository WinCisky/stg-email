<script lang="ts">
	import { currentAccount } from "$lib/stores/accounts";
    import EmailHtmlFrame from "$lib/components/email-html-frame.svelte";
    import { onMount } from "svelte";
    import { getEmailFromApi } from "$lib/api";
    import type { Email } from "$lib/data";
    import PostalMime from "postal-mime";
    let email: Email | null = null;

    onMount(async () => {
        // get email id from get params
        const params = new URLSearchParams(window.location.search);
        const id = parseInt(params.get("id") ?? "");
        if (id <= 0) return;
        const username = $currentAccount?.name;
        const password = $currentAccount?.password;
        if (!id || !username || !password) return;
        // get email from endpoint
        const response = await getEmailFromApi(username, password, id);
        
        if (response && typeof response.content === "string") {
            const parsed = await PostalMime.parse(response.content);
            if (parsed && parsed.html) {
                email = {
                    ...parsed,
                    is_read: true,
                    id: id,
                    raw: response.content,
                }
            }
        }
    });
</script>

{#if email}
    <EmailHtmlFrame selectedResolution="desktop" emailToShow={email} />
{/if}