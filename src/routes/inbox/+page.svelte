<script lang="ts">
    import Mail from "$lib/components/mail.svelte";
    import { onMount } from "svelte";
    import {
        currentPageEmails,
        isLoadingEmails,
        currentAccount,
        emails,
    } from "$lib/stores/accounts.js";
    import { loadEmails, loadDeltaEmails } from "$lib/update";

    // Esporta la funzione per renderla disponibile ai componenti figli
    export const loadMoreEmails = async () => {
        const hasMore = await loadEmails(
            $currentAccount?.name ?? "",
            $currentAccount?.password ?? "",
            $currentPageEmails,
        );
        if (hasMore) {
            $currentPageEmails += 1;
        }
        return hasMore;
    };

    export const loadDelta = async () => {
        // get email with the highest id
        const latestEmailId = $emails.reduce((acc, email) => {
            return email.id > acc ? email.id : acc;
        }, 0);
        await loadDeltaEmails(
            $currentAccount?.name ?? "",
            $currentAccount?.password ?? "",
            latestEmailId,
        );
    };

    onMount(async () => {
        await loadMoreEmails();
        // load second page of emails if any
        const interval = setInterval(async () => {
            if (!$isLoadingEmails) {
                clearInterval(interval);
                await loadMoreEmails();
            }
        }, 200);
    });
</script>

<main class="w-full">
    <Mail {loadMoreEmails} {loadDelta} />
</main>
