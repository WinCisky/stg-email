<script lang="ts">
    import { mailStore } from "$lib/stores/accounts.js";
    import type { Email } from "$lib/data.ts";
    import { cn, formatTimeAgo } from "$lib/utils.js";
	import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";

	export let items: Email[];
</script>

<ScrollArea class="h-screen">
	<div class="flex flex-col gap-2 p-4 pt-0">
		{#each items as item}
			<button
				class={cn(
					"hover:bg-accent flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all",
					$mailStore.selected === item.messageId && "bg-muted"
				)}
				on:click={() => mailStore.setMail(item.messageId)}
			>
				<div class="flex w-full flex-col gap-1">
					<div class="flex items-center">
						<div class="flex items-center gap-2">
							<div class="font-semibold">{item.from.name ?? item.from.address}</div>
							{#if !item.is_read}
								<span class="flex h-2 w-2 rounded-full bg-blue-600" />
							{/if}
						</div>
						<div
							class={cn(
								"ml-auto text-xs",
								$mailStore.selected === item.messageId
									? "text-foreground"
									: "text-muted-foreground"
							)}
						>
							{formatTimeAgo(new Date(item.date ?? 0))}
						</div>
					</div>
					<div class="text-xs font-medium">{item.subject}</div>
				</div>
				<div class="text-muted-foreground line-clamp-2 text-xs">
					{item.text ? item.text.substring(0, 300) : item.html}
				</div>
			</button>
		{/each}
	</div>
</ScrollArea>
