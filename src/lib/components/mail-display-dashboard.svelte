<script lang="ts">
    import { DateFormatter } from "@internationalized/date";
    import { base } from "$app/paths";

    import Trash2 from "lucide-svelte/icons/trash-2";
    import Forward from "lucide-svelte/icons/forward";
    import Download from "lucide-svelte/icons/download";
    import Expand from "lucide-svelte/icons/expand";
    import EllipsisVertical from "lucide-svelte/icons/ellipsis-vertical";

    import * as Avatar from "$lib/components/ui/avatar/index.js";
    import { buttonVariants } from "$lib/components/ui/button/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import { Separator } from "$lib/components/ui/separator/index.js";
    import * as Tooltip from "$lib/components/ui/tooltip/index.js";
    import { Badge } from "$lib/components/ui/badge/index.js";
    import { Button } from "$lib/components/ui/button/index.js";

    import MailDisplayContent from "./mail-display-content.svelte";
    import { mailStore } from "$lib/stores/accounts.js";
    import type { Attachment } from "postal-mime";
    import { toast } from "svelte-sonner";

    const fullFormatter = new DateFormatter("en-US", {
        dateStyle: "medium",
        timeStyle: "medium",
    });

    function downloadAttachment(attachment: Attachment) {
        const url = URL.createObjectURL(new Blob([attachment.content]));
        const a = document.createElement("a");
        a.href = url;
        a.download = attachment.filename ?? "attachment";
        a.click();
        URL.revokeObjectURL(url);
    }

    function downloadEmail() {
        console.log("Download email");
        const email = $mailStore.selected;
        if (!email) return;
        const blob = new Blob([email.raw], { type: "message/rfc822" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${email.subject}.eml`;
        a.click();
        console.log("Downloaded email", url);
        URL.revokeObjectURL(url);
    }

    function fullPage() {
        if (!$mailStore.selected) return;
        window.open(`${base}/full-page?id=${$mailStore.selected.id}`);
    }

    function copyToClipboard(value: string) {
        navigator.clipboard.writeText(value);
        toast("Copied to clipboard");
        toast.success("Copied to clipboard", {
            description: `${value} has been copied to the clipboard.`,
        });
    }
</script>

<Tooltip.Provider delayDuration={0}>
    <div class="flex h-full flex-col">
        <div class="flex items-center p-2">
            <div class="flex items-center gap-2">
                <Tooltip.Root>
                    <Tooltip.Trigger
                        id="move_to_trash_tooltip"
                        class={buttonVariants({
                            variant: "ghost",
                            size: "icon",
                        })}
                        disabled={!$mailStore.selected}
                    >
                        <Trash2 class="size-4" />
                        <span class="sr-only">Delete</span>
                    </Tooltip.Trigger>
                    <Tooltip.Content>Delete</Tooltip.Content>
                </Tooltip.Root>
                <!-- <Separator orientation="vertical" class="mx-1 h-6" /> -->
            </div>
            <div class="ml-auto flex items-center gap-2">
                <Tooltip.Root>
                    <Tooltip.Trigger
                        id="forward_tooltip"
                        class={buttonVariants({
                            variant: "ghost",
                            size: "icon",
                        })}
                        disabled={!$mailStore.selected || true}
                    >
                        <Forward class="size-4" />
                        <span class="sr-only">Forward</span>
                    </Tooltip.Trigger>
                    <Tooltip.Content>Forward</Tooltip.Content>
                </Tooltip.Root>
            </div>
            <Separator orientation="vertical" class="mx-2 h-6" />
            <DropdownMenu.Root>
                <DropdownMenu.Trigger
                    id="more_options_dropdown"
                    class={buttonVariants({ variant: "ghost", size: "icon" })}
                    disabled={!$mailStore.selected}
                >
                    <EllipsisVertical class="size-4" />
                    <span class="sr-only">More</span>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content align="end">
                    <DropdownMenu.Item onSelect={downloadEmail}>
                        <Download class="mr-2 size-4" />
                        <span>Download</span>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item onSelect={fullPage}>
                        <Expand class="mr-2 size-4" />
                        <span>Full page</span>
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </div>
        <Separator />
        {#if $mailStore.selected}
            <div class="flex h-full flex-1 flex-col overflow-hidden">
                <div class="flex items-start p-4">
                    <div class="flex items-start gap-4 text-sm">
                        <Avatar.Root>
                            <Avatar.Image
                                alt={$mailStore.selected.from.name ??
                                    $mailStore.selected.from.address}
                            />
                            <Avatar.Fallback>
                                {(
                                    $mailStore.selected.from.name ??
                                    $mailStore.selected.from.address
                                )
                                    .split(" ")
                                    .map((chunk) => chunk[0])
                                    .join("")}
                            </Avatar.Fallback>
                        </Avatar.Root>
                        <div class="grid gap-1">
                            <div class="font-semibold">
                                {$mailStore.selected.from.name ??
                                    $mailStore.selected.from.address}
                            </div>
                            <div class="line-clamp-1 text-xs">
                                {$mailStore.selected.subject}
                            </div>
                            <div
                                class="line-clamp-1 text-xs flex items-center gap-1"
                            >
                                <div class="font-medium">From:</div>
                                <Button
                                    size="sm"
                                    variant="link"
                                    class="h-4 cursor-pointer p-0 text-xs"
                                    onclick={() =>
                                        copyToClipboard(
                                            $mailStore.selected?.from.address ??
                                                "",
                                        )}
                                >
                                    {$mailStore.selected.from.address}
                                </Button>
                            </div>
                            <div class="line-clamp-1 text-xs">
                                <span class="font-medium">To:</span>
                                {#if $mailStore.selected.to}
                                    {#each $mailStore.selected.to as to}
                                        <Button
                                            size="sm"
                                            variant="link"
                                            class="h-4 cursor-pointer p-0 text-xs"
                                            onclick={() =>
                                                copyToClipboard(to.address ?? '')}
                                        >
                                            {to.address}
                                        </Button>
                                    {/each}
                                {/if}
                            </div>
                            {#if $mailStore.selected.cc}
                                <div class="line-clamp-1 text-xs">
                                    <span class="font-medium">Cc:</span>
                                    {$mailStore.selected.cc
                                        .map((cc) => cc.address)
                                        .join(", ")}
                                </div>
                            {/if}
                            {#if $mailStore.selected.bcc}
                                <div class="line-clamp-1 text-xs">
                                    <span class="font-medium">Bcc:</span>
                                    {$mailStore.selected.bcc
                                        .map((bcc) => bcc.address)
                                        .join(", ")}
                                </div>
                            {/if}
                            {#if $mailStore.selected.replyTo}
                                <div class="line-clamp-1 text-xs">
                                    <span class="font-medium">Reply-To:</span>
                                    {$mailStore.selected.replyTo
                                        .map((replyTo) => replyTo.address)
                                        .join(", ")}
                                </div>
                            {/if}
                            {#if $mailStore.selected.attachments.length > 0}
                                <div class="mt-2">
                                    {#each $mailStore.selected.attachments as attachment}
                                        <Badge
                                            class="cursor-pointer"
                                            variant="outline"
                                            onclick={() =>
                                                downloadAttachment(attachment)}
                                        >
                                            {attachment.filename}
                                        </Badge>
                                    {/each}
                                </div>
                            {/if}
                        </div>
                    </div>
                    {#if $mailStore.selected.date}
                        <div class="text-muted-foreground ml-auto text-xs">
                            {fullFormatter.format(
                                new Date($mailStore.selected.date),
                            )}
                        </div>
                    {/if}
                </div>
                <Separator />
                <div
                    class="flex-1 overflow-y-auto whitespace-pre-wrap p-4 text-sm"
                >
                    <MailDisplayContent />
                </div>
                <Separator class="mt-auto" />
            </div>
        {:else}
            <div class="text-muted-foreground p-8 text-center">
                No message selected
            </div>
        {/if}
    </div>
</Tooltip.Provider>
