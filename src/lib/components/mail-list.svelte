<script lang="ts">
    import { mailStore } from "$lib/stores/accounts.js";
    import { cn, formatTimeAgo, stripHtml } from "$lib/utils.js";
	import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
    import { emails } from "$lib/stores/accounts.js";

	let { isUnreadOnly, search } = $props()

	const searchedEmails = $derived.by(() => {
		return $emails.filter((email) => {
			if (!search) return true;
			return (
				(email.subject ?? "").toLowerCase().includes(search.toLowerCase()) ||
				email.from.name?.toLowerCase().includes(search.toLowerCase()) ||
				email.from.address?.toLowerCase().includes(search.toLowerCase())
			);
		});
	});
	const emailItems = $derived(isUnreadOnly ? searchedEmails.filter((email) => !email.is_read) : searchedEmails);

	function markEmailAsRead(id: string) {
		const emailIndex = $emails.findIndex((email) => email.messageId === id);
		if (emailIndex === -1) return;
		$emails[emailIndex].is_read = true;
		$emails = [...$emails];
		// TODO: api call to update email as read in the db
    }
</script>

<ScrollArea class="h-screen">
	<div class="flex flex-col gap-2 p-4 pt-0">
		{#each emailItems as email}
			<button
				class={cn(
					"hover:bg-accent flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all",
					$mailStore.selected === email.messageId && "bg-muted"
				)}
				onclick={() => {
					mailStore.setMail(email.messageId)
					markEmailAsRead(email.messageId)
				}}
			>
				<div class="flex w-full flex-col gap-1">
					<div class="flex items-center">
						<div class="flex items-center gap-2">
							<div class="font-semibold">{email.from.name ?? email.from.address}</div>
							{#if !email.is_read}
								<span class="flex h-2 w-2 rounded-full bg-blue-600" ></span>
							{/if}
						</div>
						<div
							class={cn(
								"ml-auto text-xs",
								$mailStore.selected === email.messageId
									? "text-foreground"
									: "text-muted-foreground"
							)}
						>
							{formatTimeAgo(new Date(email.date ?? 0))}
						</div>
					</div>
					<div class="text-xs font-medium">{email.subject}</div>
				</div>
				<div class="text-muted-foreground line-clamp-2 text-xs">
					{email.text ? email.text.substring(0, 300) : stripHtml(email.html ?? "").substring(0, 300)}
				</div>
			</button>
		{/each}
	</div>
</ScrollArea>
