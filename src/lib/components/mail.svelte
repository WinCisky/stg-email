<script lang="ts">
	import { base } from "$app/paths";
	import Search from "lucide-svelte/icons/search";
	import * as Resizable from "$lib/components/ui/resizable/index.js";
	import * as Tabs from "$lib/components/ui/tabs/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import MailList from "./mail-list.svelte";
	import MailDisplayDashboard from "./mail-display-dashboard.svelte";
	import Home from "lucide-svelte/icons/home";
	import Flame from "lucide-svelte/icons/flame";
	import { Button } from "$lib/components/ui/button/index.js";

	let { loadMoreEmails } = $props();

	let search = $state("");
</script>

<div class="md:hidden">TODO: MOBILE</div>
<div class="hidden md:block h-screen">
	<Resizable.PaneGroup direction="horizontal">
		<div class="flex flex-col justify-between">
			<div>
				<div class="p-2">
					<Button href={`${base}/`} variant="outline" size="icon">
						<Home />
					</Button>
				</div>
				<Separator />
			</div>
			<div>
				<div class="p-2">
					<Button variant="outline" size="icon">
						<Flame />
					</Button>
				</div>
			</div>
		</div>
		<Separator orientation="vertical" />
		<Resizable.Pane defaultSize={25} minSize={15} maxSize={35}>
			<Tabs.Root value="all">
				<div class="flex items-center px-4 py-2">
					<h1 class="text-xl font-bold">Inbox</h1>
					<Tabs.List class="ml-auto">
						<Tabs.Trigger
							value="all"
							class="text-zinc-600 dark:text-zinc-200"
						>
							All mail
						</Tabs.Trigger>
						<Tabs.Trigger
							value="unread"
							class="text-zinc-600 dark:text-zinc-200"
						>
							Unread
						</Tabs.Trigger>
					</Tabs.List>
				</div>
				<Separator />
				<div
					class="bg-background/95 supports-[backdrop-filter]:bg-background/60 p-4 backdrop-blur"
				>
					<form>
						<div class="relative">
							<Search
								class="text-muted-foreground absolute left-2 top-[50%] h-4 w-4 translate-y-[-50%]"
							/>
							<Input
								placeholder="Search"
								class="pl-8"
								bind:value={search}
							/>
						</div>
					</form>
				</div>
				<Tabs.Content value="all" class="m-0">
					<MailList isUnreadOnly={false} {search} {loadMoreEmails} />
				</Tabs.Content>
				<Tabs.Content value="unread" class="m-0">
					<MailList isUnreadOnly={true} {search} {loadMoreEmails} />
				</Tabs.Content>
			</Tabs.Root>
		</Resizable.Pane>

		<Resizable.Handle withHandle />
		<Resizable.Pane defaultSize={65}>
			<MailDisplayDashboard />
		</Resizable.Pane>
	</Resizable.PaneGroup>
</div>
