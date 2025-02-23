<script lang="ts">
    import Mail from "$lib/components/mail.svelte";
    import PostalMime from "postal-mime";
	import { onMount } from "svelte";
    import { emails } from "$lib/stores/accounts.js";
    import { fetchEmailsFromApi } from "$lib/api";

	onMount(async () => {
        try {
            const username = localStorage.getItem('username');
            if (!username) {
                throw new Error('No username found in local storage');
            }
            const password = localStorage.getItem('password');
            if (!password) {
                throw new Error('No password found in local storage');
            }
            const page = 1;
            const apiData = await fetchEmailsFromApi(username, password, page);

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