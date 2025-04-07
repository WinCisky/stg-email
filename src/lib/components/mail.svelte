<script lang="ts">
	import { base } from "$app/paths";
	import Search from "lucide-svelte/icons/search";
	import * as Resizable from "$lib/components/ui/resizable/index.js";
	import * as Tabs from "$lib/components/ui/tabs/index.js";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Switch } from "$lib/components/ui/switch/index.js";
	import MailList from "./mail-list.svelte";
	import MailDisplayDashboard from "./mail-display-dashboard.svelte";
	import Home from "lucide-svelte/icons/home";
	import Refresh from "lucide-svelte/icons/refresh-cw";
	import ReadAll from "lucide-svelte/icons/mail-check";
	import Flame from "lucide-svelte/icons/flame";
	import Settings from "lucide-svelte/icons/settings-2";
	import { Button } from "$lib/components/ui/button/index.js";
	import { currentAccount, emails, mailStore } from "$lib/stores/accounts";
	import { postBurnAccount, patchReadAllEmails } from "$lib/api";
	import { writable } from "svelte/store";
	import { onDestroy } from "svelte";
	import { type PaneAPI } from "paneforge";
	import { onMount } from "svelte";

	let { loadMoreEmails, loadDelta } = $props();

	const currentTime = writable(Date.now());
	const interval = setInterval(() => {
		currentTime.set(Date.now());
	}, 1000);

	onDestroy(() => {
		clearInterval(interval);
	});

	let search = $state("");
	let isBurnDialogOpen = $state(false);
	let isReadAllDialogOpen = $state(false);
	let isSettingsDialogOpen = $state(false);
	let isMobile = $state(false);

	async function burnSelectedAccount() {
		if (!$currentAccount) return;
		await postBurnAccount($currentAccount.name, $currentAccount.password);
		mailStore.clearMail();
		isBurnDialogOpen = false;
		$emails = [];
	}

	async function readAllEmails() {
		if (!$currentAccount) return;
		await patchReadAllEmails(
			$currentAccount.name,
			$currentAccount.password,
		);
		$emails.forEach((email) => {
			email.is_read = false;
		});
	}

	let paneOne: PaneAPI;
	let collapsed = $state(false);

	const checkMobile = () => {
		if (window) {
			isMobile = window.innerWidth < 1024;
		}
	};

	onMount(() => {
		checkMobile();
		if (window) {
			window.addEventListener("resize", checkMobile);
		}

		return () => {
			if (window) {
				window.removeEventListener("resize", checkMobile);
			}
		};
	});

	$effect(() => {
		if (!paneOne) return;

		if (isMobile && $mailStore.selected && !collapsed) {
			paneOne.collapse();
			collapsed = true;
		} else if (isMobile && !$mailStore.selected && collapsed) {
			paneOne.expand();
			collapsed = false;
		}
	});
</script>

<div class="h-screen">
	<Resizable.PaneGroup direction="horizontal">
		<div class="flex flex-col">
			<div>
				<div class="p-2">
					<Button href={`${base}/`} variant="outline" size="icon">
						<Home />
					</Button>
				</div>
				<Separator />
			</div>
			<div>
				<div class="p-2 flex flex-col space-y-2">
					<Button variant="outline" size="icon" onclick={loadDelta}>
						<Refresh />
					</Button>
					<Button
						variant="outline"
						size="icon"
						onclick={() => (isReadAllDialogOpen = true)}
					>
						<ReadAll />
					</Button>
					<Button
						variant="outline"
						size="icon"
						onclick={() => (isBurnDialogOpen = true)}
					>
						<Flame />
					</Button>
					<Button
						variant="outline"
						size="icon"
						onclick={() => (isSettingsDialogOpen = true)}
						disabled
					>
						<Settings />
					</Button>
				</div>
			</div>
		</div>
		<Separator orientation="vertical" />
		<Resizable.Pane
			bind:this={paneOne}
			order={1}
			defaultSize={25}
			minSize={20}
			maxSize={35}
			collapsedSize={0}
			collapsible={true}
			class="transition-all duration-300 ease-in-out lg:transition-none lg:duration-0"
		>
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
					<MailList
						isUnreadOnly={false}
						{search}
						{loadMoreEmails}
						{currentTime}
					/>
				</Tabs.Content>
				<Tabs.Content value="unread" class="m-0">
					<MailList
						isUnreadOnly={true}
						{search}
						{loadMoreEmails}
						{currentTime}
					/>
				</Tabs.Content>
			</Tabs.Root>
		</Resizable.Pane>

		<Resizable.Handle withHandle class="hidden md:flex" />
		{#if !isMobile || $mailStore.selected}
			<Resizable.Pane order={2} defaultSize={65}>
				<MailDisplayDashboard />
			</Resizable.Pane>
		{/if}
	</Resizable.PaneGroup>

	<Dialog.Root bind:open={isBurnDialogOpen}>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Burn Account?</Dialog.Title>
				<Dialog.Description>
					This will remove all emails from the account.
				</Dialog.Description>
			</Dialog.Header>
			<Dialog.Footer>
				<Button onclick={() => burnSelectedAccount()}>Burn</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>

	<Dialog.Root bind:open={isReadAllDialogOpen}>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Read All Emails?</Dialog.Title>
				<Dialog.Description>
					This will mark all emails as read.
				</Dialog.Description>
			</Dialog.Header>
			<Dialog.Footer>
				<Button onclick={() => readAllEmails()}>Mark all as read</Button
				>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>

	<Dialog.Root bind:open={isSettingsDialogOpen}>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Options</Dialog.Title>
				<Dialog.Description>
					<div
						class="flex items-center justify-between border-2 p-2 rounded-md bg-muted"
					>
						<div class="space-y-0.5">
							<div class="font-bold">Search from</div>
							<div>
								Receive emails about new products, features, and
								more.
							</div>
						</div>
						<Switch />
					</div>
				</Dialog.Description>
			</Dialog.Header>
			<Dialog.Footer>
				<Button onclick={() => console.log("save")}>Save</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
</div>
