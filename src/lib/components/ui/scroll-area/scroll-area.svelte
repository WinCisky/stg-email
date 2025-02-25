<script lang="ts">
	import {
		ScrollArea as ScrollAreaPrimitive,
		type WithoutChild,
	} from "bits-ui";
	import { Scrollbar } from "./index.js";
	import { cn } from "$lib/utils.js";
	import { onMount, onDestroy, createEventDispatcher } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		orientation = "vertical",
		scrollbarXClasses = "",
		scrollbarYClasses = "",
		scroll,
		children,
		...restProps
	}: WithoutChild<ScrollAreaPrimitive.RootProps> & {
		orientation?: "vertical" | "horizontal" | "both" | undefined;
		scrollbarXClasses?: string | undefined;
		scrollbarYClasses?: string | undefined;
		scroll?: (event: { scrollBot: number }) => void;
	} = $props();

	let scrollViewport: HTMLDivElement | null = $state(null);

	function onScrollbarScroll() {
		const top = scrollViewport?.scrollTop ?? 0;
		const height = scrollViewport?.scrollHeight ?? Number.MAX_SAFE_INTEGER;
		const offsetHeight = scrollViewport?.offsetHeight ?? 0;
		const scrollBot = height - top - offsetHeight;
		scroll?.({
			scrollBot: scrollBot,
		});
	}

	onMount(() => {
		scrollViewport?.addEventListener("scroll", onScrollbarScroll);
	});

	onDestroy(() => {
		scrollViewport?.removeEventListener("scroll", onScrollbarScroll);
	});
</script>

<ScrollAreaPrimitive.Root
	bind:ref
	{...restProps}
	class={cn("relative overflow-hidden", className)}
>
	<ScrollAreaPrimitive.Viewport
		bind:ref={scrollViewport}
		class="h-full w-full rounded-[inherit]"
	>
		{@render children?.()}
	</ScrollAreaPrimitive.Viewport>
	{#if orientation === "vertical" || orientation === "both"}
		<Scrollbar orientation="vertical" class={scrollbarYClasses} />
	{/if}
	{#if orientation === "horizontal" || orientation === "both"}
		<Scrollbar orientation="horizontal" class={scrollbarXClasses} />
	{/if}
	<ScrollAreaPrimitive.Corner />
</ScrollAreaPrimitive.Root>
