<script lang="ts">
	import { DateFormatter } from "@internationalized/date";

    import Archive from "lucide-svelte/icons/archive";
    import ArchiveX from "lucide-svelte/icons/archive-x";
    import Trash2 from "lucide-svelte/icons/trash-2";
    import Reply from "lucide-svelte/icons/reply";
    import ReplyAll from "lucide-svelte/icons/reply-all";
    import Forward from "lucide-svelte/icons/forward";
    import EllipsisVertical from "lucide-svelte/icons/ellipsis-vertical";

    import type { Email } from '$lib/data';

	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import { buttonVariants } from "$lib/components/ui/button/index.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";

    interface Props {
		mail: Email | null;
	}

	let { mail } : Props = $props();

	const fullFormatter = new DateFormatter("en-US", {
		dateStyle: "medium",
		timeStyle: "medium",
	});
</script>
<Tooltip.Provider delayDuration={0}>
    <div class="flex h-full flex-col">
        <div class="flex items-center p-2">
            <div class="flex items-center gap-2">
                <Tooltip.Root>
                    <Tooltip.Trigger
                        id="archive_tooltip"
                        class={buttonVariants({ variant: "ghost", size: "icon" })}
                        disabled={!mail}
                    >
                        <Archive class="size-4" />
                        <span class="sr-only">Archive</span>
                    </Tooltip.Trigger>
                    <Tooltip.Content>Archive</Tooltip.Content>
                </Tooltip.Root>
                <Tooltip.Root>
                    <Tooltip.Trigger
                        id="move_to_junk_tooltip"
                        class={buttonVariants({ variant: "ghost", size: "icon" })}
                        disabled={!mail}
                    >
                        <ArchiveX class="size-4" />
                        <span class="sr-only">Move to junk</span>
                    </Tooltip.Trigger>
                    <Tooltip.Content>Move to junk</Tooltip.Content>
                </Tooltip.Root>
                <Tooltip.Root>
                    <Tooltip.Trigger
                        id="move_to_trash_tooltip"
                        class={buttonVariants({ variant: "ghost", size: "icon" })}
                        disabled={!mail}
                    >
                        <Trash2 class="size-4" />
                        <span class="sr-only">Move to trash</span>
                    </Tooltip.Trigger>
                    <Tooltip.Content>Move to trash</Tooltip.Content>
                </Tooltip.Root>
                <!-- <Separator orientation="vertical" class="mx-1 h-6" /> -->
            </div>
            <div class="ml-auto flex items-center gap-2">
                <Tooltip.Root>
                    <Tooltip.Trigger
                        id="reply_tooltip"
                        class={buttonVariants({ variant: "ghost", size: "icon" })}
                        disabled={!mail}
                    >
                        <Reply class="size-4" />
                        <span class="sr-only">Reply</span>
                    </Tooltip.Trigger>
                    <Tooltip.Content>Reply</Tooltip.Content>
                </Tooltip.Root>
                <Tooltip.Root>
                    <Tooltip.Trigger
                        id="reply_all_tooltip"
                        class={buttonVariants({ variant: "ghost", size: "icon" })}
                        disabled={!mail}
                    >
                        <ReplyAll class="size-4" />
                        <span class="sr-only">Reply all</span>
                    </Tooltip.Trigger>
                    <Tooltip.Content>Reply all</Tooltip.Content>
                </Tooltip.Root>
                <Tooltip.Root>
                    <Tooltip.Trigger
                        id="forward_tooltip"
                        class={buttonVariants({ variant: "ghost", size: "icon" })}
                        disabled={!mail}
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
                    disabled={!mail}
                >
                    <EllipsisVertical class="size-4" />
                    <span class="sr-only">More</span>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content align="end">
                    <DropdownMenu.Item>Mark as unread</DropdownMenu.Item>
                    <DropdownMenu.Item>Star thread</DropdownMenu.Item>
                    <DropdownMenu.Item>Add label</DropdownMenu.Item>
                    <DropdownMenu.Item>Mute thread</DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </div>
        <Separator />
        {#if mail}
            <div class="flex h-full flex-1 flex-col overflow-hidden">
                <div class="flex items-start p-4">
                    <div class="flex items-start gap-4 text-sm">
                        <Avatar.Root>
                            <Avatar.Image alt={mail.from.name ?? mail.from.address} />
                            <Avatar.Fallback>
                                {(mail.from.name ?? mail.from.address)
                                    .split(" ")
                                    .map((chunk) => chunk[0])
                                    .join("")}
                            </Avatar.Fallback>
                        </Avatar.Root>
                        <div class="grid gap-1">
                            <div class="font-semibold">{mail.from.name ?? mail.from.address}</div>
                            <div class="line-clamp-1 text-xs">{mail.subject}</div>
                            <div class="line-clamp-1 text-xs">
                                <span class="font-medium">Reply-To:</span>
                                {mail.from.address}
                            </div>
                        </div>
                    </div>
                    {#if mail.date}
                        <div class="text-muted-foreground ml-auto text-xs">
                            {fullFormatter.format(new Date(mail.date))}
                        </div>
                    {/if}
                </div>
                <Separator />
                <div class="flex-1 overflow-y-auto whitespace-pre-wrap p-4 text-sm">
                    {mail.text}
                </div>
                <Separator class="mt-auto" />
            </div>
        {:else}
            <div class="text-muted-foreground p-8 text-center">No message selected</div>
        {/if}
    </div>
</Tooltip.Provider>