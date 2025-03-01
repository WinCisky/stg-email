<script lang="ts">
    import Mail from "$lib/components/mail.svelte";
    import PostalMime from "postal-mime";
    import { onMount } from "svelte";
    import {
        emails,
        currentPageEmails,
        isLoadingEmails,
    } from "$lib/stores/accounts.js";
    import { getEmailsFromApi } from "$lib/api";
    import { currentAccount } from "$lib/stores/accounts.js";

    const emailsPerPage = 10;

    async function loadEmails(page: number) {
        if ($isLoadingEmails) return;

        try {
            $isLoadingEmails = true;

            if (!$currentAccount) {
                throw new Error("Selected account not found!");
            }

            const apiData = await getEmailsFromApi(
                $currentAccount.name,
                $currentAccount.password,
                page,
            );

            // Se non ci sono più email da caricare
            if (apiData.length === 0) {
                return false;
            }

            for (const email of apiData) {
                const parsed = await PostalMime.parse(email.content);
                emails.update((emails) => [
                    ...emails,
                    {
                        ...parsed,
                        is_read: email.is_read == 1,
                        id: email.id,
                        raw: email.content,
                    },
                ]);
            }

            return apiData.length === emailsPerPage;
        } catch (error) {
            console.error("Error retrieving data:", error);
            return false;
        } finally {
            $isLoadingEmails = false;
        }
    }

    // Esporta la funzione per renderla disponibile ai componenti figli
    export const loadMoreEmails = async () => {
        const hasMore = await loadEmails($currentPageEmails);
        if (hasMore) {
            $currentPageEmails += 1;
        }
        return hasMore;
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
    <Mail {loadMoreEmails} />
</main>
