<script lang="ts">
    import Mail from "$lib/components/mail.svelte";
    import PostalMime from "postal-mime";
	import { onMount } from "svelte";
    import { emails } from "$lib/stores/accounts.js";
    import { getEmailsFromApi } from "$lib/api";
    import { currentAccount } from "$lib/stores/accounts.js";

	onMount(async () => {
        try {
            if (!$currentAccount) {
                throw new Error('Selected account not found!');
            }
            const page = 1;
            const apiData = await getEmailsFromApi($currentAccount.name, $currentAccount.password, page);

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