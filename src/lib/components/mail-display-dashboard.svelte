<script lang="ts">
    import { DateFormatter } from "@internationalized/date";
    import { base } from "$app/paths";

    import Trash2 from "lucide-svelte/icons/trash-2";
    import Forward from "lucide-svelte/icons/forward";
    import Download from "lucide-svelte/icons/download";
    import Expand from "lucide-svelte/icons/expand";
    import EllipsisVertical from "lucide-svelte/icons/ellipsis-vertical";
    import { ArrowLeft } from "lucide-svelte";

    import * as Avatar from "$lib/components/ui/avatar/index.js";
    import { buttonVariants } from "$lib/components/ui/button/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import { Separator } from "$lib/components/ui/separator/index.js";
    import * as Tooltip from "$lib/components/ui/tooltip/index.js";
    import { Badge } from "$lib/components/ui/badge/index.js";

    import MailDisplayContent from "./mail-display-content.svelte";
    import { mailStore } from "$lib/stores/accounts.js";
    import type { Attachment } from "postal-mime";
    import MailCopy from "./mail-copy.svelte";

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

    function deselectEmail() {
        mailStore.clearMail();
    }
</script>

<Tooltip.Provider delayDuration={0}>
    <div class="flex h-full flex-col">
        <div class="flex items-center p-2">
            <div class="flex items-center gap-2 lg:hidden">
                <Tooltip.Root>
                    <Tooltip.Trigger
                        id="go_back_tooltip"
                        class={buttonVariants({
                            variant: "ghost",
                            size: "icon",
                        })}
                        onclick={deselectEmail}
                    >
                        <ArrowLeft class="size-4" />
                        <span class="sr-only">Back</span>
                    </Tooltip.Trigger>
                    <Tooltip.Content>Back</Tooltip.Content>
                </Tooltip.Root>
                <!-- <Separator orientation="vertical" class="mx-1 h-6" /> -->
            </div>
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
                <div class="flex flex-col-reverse items-start p-4 lg:flex-row">
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
                            {#if $mailStore.selected.from.address}
                                <MailCopy
                                    label="From"
                                    emails={[{
                                        address: $mailStore.selected.from.address,
                                        name: $mailStore.selected.from.name,
                                    }]}
                                />
                            {/if}
                            {#if $mailStore.selected.to}
                                <MailCopy
                                    label="To"
                                    emails={$mailStore.selected.to}
                                />
                            {/if}
                            {#if $mailStore.selected.cc}
                                <MailCopy
                                    label="Cc"
                                    emails={$mailStore.selected.cc}
                                />
                            {/if}
                            {#if $mailStore.selected.bcc}
                                <MailCopy
                                    label="Bcc"
                                    emails={$mailStore.selected.bcc}
                                />
                            {/if}
                            {#if $mailStore.selected.replyTo}
                                <MailCopy
                                    label="Reply-To"
                                    emails={$mailStore.selected.replyTo}
                                />
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
