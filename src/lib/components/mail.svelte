<script lang="ts">
	import { base } from "$app/paths";
	import Search from "lucide-svelte/icons/search";
	import * as Resizable from "$lib/components/ui/resizable/index.js";
	import * as Tabs from "$lib/components/ui/tabs/index.js";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import MailList from "./mail-list.svelte";
	import MailDisplayDashboard from "./mail-display-dashboard.svelte";
	import Home from "lucide-svelte/icons/home";
	import Refresh from "lucide-svelte/icons/refresh-cw";
	import ReadAll from "lucide-svelte/icons/mail-check";
	import Flame from "lucide-svelte/icons/flame";
	import { Button } from "$lib/components/ui/button/index.js";
	import { currentAccount, emails, mailStore } from "$lib/stores/accounts";
    import { postBurnAccount } from "$lib/api";

	let { loadMoreEmails } = $props();

	let search = $state("");
	let isBurnDialogOpen = $state(false);
	
    async function burnSelectedAccount() {
        if (!$currentAccount) return;
        await postBurnAccount($currentAccount.name, $currentAccount.password);
		mailStore.clearMail();
        isBurnDialogOpen = false;
		$emails = [];
    }
</script>

<div class="md:hidden">TODO: MOBILE</div>
<div class="hidden md:block h-screen">
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
					<Button variant="outline" size="icon" onclick={() => isBurnDialogOpen = true}>
						<Refresh />
					</Button>
					<Button variant="outline" size="icon" onclick={() => isBurnDialogOpen = true}>
						<ReadAll />
					</Button>
					<Button variant="outline" size="icon" onclick={() => isBurnDialogOpen = true}>
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
</div>
