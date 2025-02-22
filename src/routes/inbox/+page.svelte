<script lang="ts">
    import Mail from "$lib/components/mail.svelte";
    import PostalMime from "postal-mime";
	import { onMount } from "svelte";
    import { emails } from "$lib/stores/accounts.js";

	onMount(async () => {
        try {
            const response = await fetch('https://test.opentrust.it/emails?username=your_username1&password=your_password2&page=1');
            const apiData = await response.json();

            for (const email of apiData) {
                const parsed = await PostalMime.parse(email.content);
                emails.update((emails) => [...emails, { ...parsed, is_read: email.is_read }]);
            }
        } catch (error) {
            console.error('Error retrieving data:', error);
        }
    });
</script>

<main class="w-full">
	<Mail />
</main>