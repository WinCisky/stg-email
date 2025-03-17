<script lang="ts">
    import Mail from "$lib/components/mail.svelte";
    import { onDestroy, onMount } from "svelte";
    import {
        currentPageEmails,
        isLoadingEmails,
        currentAccount,
        emails,
    } from "$lib/stores/accounts.js";
    import { loadEmails, loadDeltaEmails } from "$lib/update";

    let deltaInterval: number | null = null;
    let lostFocusTimeout: number | null = null;

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

    const startDeltaInterval = (intervalMs: number) => {
        if (deltaInterval) clearInterval(deltaInterval);
        deltaInterval = setInterval(async () => {
            await loadDelta();
        }, intervalMs);
    };

    const stopDeltaInterval = () => {
        if (deltaInterval) {
            clearInterval(deltaInterval);
            deltaInterval = null;
        }
    };

    function handleFocus() {
        if (lostFocusTimeout) {
            clearTimeout(lostFocusTimeout);
            lostFocusTimeout = null;
        }
        loadDelta(); // Call immediately when regaining focus
        startDeltaInterval(5000); // Call every 5 seconds
    }

    function handleBlur() {
        stopDeltaInterval();
        lostFocusTimeout = setTimeout(() => {
            stopDeltaInterval(); // Stop calling after 60 seconds
        }, 60000);
        startDeltaInterval(10000); // Call every 10 seconds
    }

    onMount(() => {
        loadMoreEmails();
        // load second page of emails if any
        const interval = setInterval(async () => {
            if (!$isLoadingEmails) {
                clearInterval(interval);
                await loadMoreEmails();
            }
        }, 200);
        
        window.addEventListener('blur', _event => {
            handleBlur();
        });
        window.addEventListener('focus', _event => {
            handleFocus();
        });

        startDeltaInterval(5000);
    });

    onDestroy(() => {
        stopDeltaInterval();
    });
</script>

<main class="w-full">
    <Mail {loadMoreEmails} {loadDelta} />
</main>
