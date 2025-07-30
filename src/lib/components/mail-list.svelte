<script lang="ts">
	import { mailStore } from "$lib/stores/accounts.js";
	import { cn, formatTimeAgo, stripHtml } from "$lib/utils.js";
	import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
	import {
		emails,
		isLoadingEmails,
		currentAccount,
	} from "$lib/stores/accounts.js";
	import { patchMarkEmailAsRead } from "$lib/api";
	import { onMount } from "svelte";
	import { slide } from "svelte/transition";
	import { type Writable } from "svelte/store";

	let {
		isUnreadOnly,
		search,
		loadMoreEmails,
		currentTime,
		searchFilters,
	}: {
		isUnreadOnly: boolean;
		search: string;
		loadMoreEmails: (unread: boolean) => Promise<boolean>;
		currentTime: Writable<number>;
		searchFilters: {
			sender: boolean;
			receiver: boolean;
			subject: boolean;
			content: boolean;
			attachment: boolean;
		};
	} = $props();

	let isFetchingEmails = $state(false);
	let hasMoreEmails = $state(true);

	const searchedEmails = $derived.by(() => {
  return $emails.filter((email) => {
    if (!search) return true;
    
    const searchLower = search.toLowerCase();
    
    if (searchFilters.subject && (email.subject ?? "").toLowerCase().includes(searchLower)) {
      return true;
    }
    
    if (searchFilters.sender && (
      (email.from.name?.toLowerCase().includes(searchLower)) || 
      (email.from.address?.toLowerCase().includes(searchLower))
    )) {
      return true;
    }
    
    if (searchFilters.receiver && email.to && email.to.some(recipient => 
      (recipient.name?.toLowerCase().includes(searchLower)) ||
      (recipient.address?.toLowerCase().includes(searchLower))
    )) {
      return true;
    }
    
    if (searchFilters.content) {
      const textContent = email.text?.toLowerCase() || '';
      const htmlContent = stripHtml(email.html ?? "").toLowerCase();
      if (textContent.includes(searchLower) || htmlContent.includes(searchLower)) {
        return true;
      }
    }
    
    if (searchFilters.attachment && email.attachments && email.attachments.length > 0) {
      return email.attachments.some(attachment => 
        (attachment.filename?.toLowerCase() || "").includes(searchLower)
      );
    }
    
    return false;
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
			...$emails.slice(emailIndex + 1),
		];

		// Aggiorna lo store con il nuovo array
		emails.set(updatedEmails);
		// api call to update email as read in the db
		if ($currentAccount) {
			const email = $emails[emailIndex];
			patchMarkEmailAsRead(
				email.id,
				$currentAccount.name,
				$currentAccount.password,
			);
		}
	}

	async function onScrollbarScroll(event: { scrollBot: number }) {
		// Carica altre email quando l'utente si avvicina al fondo della lista
		if (
			event.scrollBot < 100 &&
			!isFetchingEmails &&
			hasMoreEmails &&
			!$isLoadingEmails
		) {
			isFetchingEmails = true;

			try {
				const hasMore = await loadMoreEmails(isUnreadOnly);
				hasMoreEmails = hasMore;
			} catch (error) {
				console.error("Error loading more emails:", error);
			} finally {
				isFetchingEmails = false;
			}
		}
	}
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
					transition:slide
					{...slide}
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
								{#if !email.is_read}
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
								{#await $currentTime then time}
									{formatTimeAgo(
										new Date(email.date ?? 0),
										new Date(time),
									)}
								{/await}
							</div>
						</div>
						<div class="text-xs font-medium">{email.subject}</div>
					</div>
					<div class="text-muted-foreground line-clamp-2 text-xs text-ellipsis break-all">
						{email.text
							? email.text.substring(0, 300)
							: stripHtml(email.html ?? "").substring(0, 300)}
					</div>
				</button>
			{/each}
		</div>
	</ScrollArea>
</div>
