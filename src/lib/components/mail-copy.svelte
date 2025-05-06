<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import type { Address } from "postal-mime";
    import { toast } from "svelte-sonner";
    
    function copyToClipboard(value: string) {
        navigator.clipboard.writeText(value);
        toast("Copied to clipboard");
        toast.success("Copied to clipboard", {
            description: `${value} has been copied to the clipboard.`,
        });
    }

    let {
		label,
		emails
	}: {
		label: string;
		emails: Address[];
	} = $props();
</script>

<div class="line-clamp-1 text-xs">
    <span class="font-medium">{label}:</span>
    {#each emails as email, index (email.address)}
        <Button
            size="sm"
            variant="link"
            class="h-4 cursor-pointer p-0 text-xs"
            onclick={() => copyToClipboard(email.address ?? "")}
        >
            {email.address}
        </Button>{#if index < emails.length - 1},&nbsp;{/if}
    {/each}
</div>