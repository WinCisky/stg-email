<script lang="ts">
	import { mailStore } from "$lib/stores/accounts.js";
	import { cn, formatTimeAgo, stripHtml } from "$lib/utils.js";
	import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
	import { emails, isLoadingEmails, currentAccount } from "$lib/stores/accounts.js";
    import { patchMarkEmailAsRead } from "$lib/api";
    import { onMount } from "svelte";

	let { isUnreadOnly, search, loadMoreEmails } = $props();

	let isFetchingEmails = $state(false);
    let hasMoreEmails = $state(true);

	const searchedEmails = $derived.by(() => {
		return $emails.filter((email) => {
			if (!search) return true;
			return (
				(email.subject ?? "")
					.toLowerCase()
					.includes(search.toLowerCase()) ||
				email.from.name?.toLowerCase().includes(search.toLowerCase()) ||
				email.from.address?.toLowerCase().includes(search.toLowerCase())
			);
		});
	});
	const emailItems = $derived(
		isUnreadOnly
			? searchedEmails.filter((email) => !email.is_read)
			: searchedEmails,
	);

	function markEmailAsRead(id: string) {
		const emailIndex = $emails.findIndex((email) => email.messageId === id);
		if (emailIndex === -1) return;
		// Crea una copia dell'email con is_read impostato a true
		const updatedEmail = { ...$emails[emailIndex], is_read: true };
    
		// Crea un nuovo array di email sostituendo quella modificata
		const updatedEmails = [
			...$emails.slice(0, emailIndex),
			updatedEmail,
			...$emails.slice(emailIndex + 1)
		];
		
		// Aggiorna lo store con il nuovo array
		emails.set(updatedEmails);
		// api call to update email as read in the db
		if ($currentAccount) {
			const email = $emails[emailIndex];
			patchMarkEmailAsRead(email.id, $currentAccount.name, $currentAccount.password);
		}
	}

	async function onScrollbarScroll(event: { scrollBot: number }) {
        // Carica altre email quando l'utente si avvicina al fondo della lista
        if (event.scrollBot < 100 && !isFetchingEmails && hasMoreEmails && !$isLoadingEmails) {
            isFetchingEmails = true;
            
            try {
                const hasMore = await loadMoreEmails();
                hasMoreEmails = hasMore;
            } catch (error) {
                console.error("Error loading more emails:", error);
            } finally {
                isFetchingEmails = false;
            }
        }
    }

	onMount(async () => {
		await loadMoreEmails();
	});
</script>

<div class="h-full max-h-full overflow-hidden">
	<ScrollArea
		class="h-[calc(100vh-129px)]"
		orientation="vertical"
		scroll={onScrollbarScroll}
	>
		<div class="flex flex-col gap-2 p-4 pt-0">
			{#each emailItems as email (email.messageId)}
				<button
					class={cn(
						"hover:bg-accent flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all",
						$mailStore.selected?.messageId === email.messageId &&
							"bg-muted",
					)}
					onclick={() => {
						mailStore.setMail(email);
						markEmailAsRead(email.messageId);
					}}
				>
					<div class="flex w-full flex-col gap-1">
						<div class="flex items-center">
							<div class="flex items-center gap-2">
								<div class="font-semibold">
									{email.from.name ?? email.from.address}
								</div>
								{#if (!email.is_read)}
									<span
										class="flex h-2 w-2 rounded-full bg-blue-600"
									></span>
								{/if}
							</div>
							<div
								class={cn(
									"ml-auto text-xs",
									$mailStore.selected?.messageId ===
										email.messageId
										? "text-foreground"
										: "text-muted-foreground",
								)}
							>
								{formatTimeAgo(new Date(email.date ?? 0))}
							</div>
						</div>
						<div class="text-xs font-medium">{email.subject}</div>
					</div>
					<div class="text-muted-foreground line-clamp-2 text-xs">
						{email.text
							? email.text.substring(0, 300)
							: stripHtml(email.html ?? "").substring(0, 300)}
					</div>
				</button>
			{/each}
		</div>
	</ScrollArea>
</div>
