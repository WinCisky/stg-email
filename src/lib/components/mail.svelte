<script lang="ts">
	import Search from "lucide-svelte/icons/search";
    import * as Resizable from "$lib/components/ui/resizable/index.js";
    import * as Tabs from "$lib/components/ui/tabs/index.js";
    import { Separator } from "$lib/components/ui/separator/index.js";
    import { Input } from "$lib/components/ui/input/index.js";

    export let defaultLayout = [265, 440, 655];
</script>

<div class="md:hidden">TODO: MOBILE</div>
<div class="hidden md:block h-screen">
    <Resizable.PaneGroup direction="horizontal">
        <Resizable.Pane
            defaultSize={defaultLayout[0]}
            collapsible
            minSize={15}
            maxSize={20}
        >
            <div class="flex h-[52px] items-center justify-center">
                ACCOUNT
            </div>
            <Separator />
        </Resizable.Pane>
        <Resizable.Handle />
        <Resizable.Pane defaultSize={defaultLayout[1]} minSize={30}>
            <Tabs.Root value="all">
				<div class="flex items-center px-4 py-2">
					<h1 class="text-xl font-bold">Inbox</h1>
					<Tabs.List class="ml-auto">
						<Tabs.Trigger value="all" class="text-zinc-600 dark:text-zinc-200">
							All mail
						</Tabs.Trigger>
						<Tabs.Trigger value="unread" class="text-zinc-600 dark:text-zinc-200">
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
							<Input placeholder="Search" class="pl-8" />
						</div>
					</form>
				</div>
				<Tabs.Content value="all" class="m-0">
					<!-- <MailList items={mails} /> -->
				</Tabs.Content>
				<Tabs.Content value="unread" class="m-0">
					<!-- <MailList items={mails.filter((item) => !item.read)} /> -->
				</Tabs.Content>
			</Tabs.Root>
        </Resizable.Pane>

		<Resizable.Handle withHandle />
		<Resizable.Pane defaultSize={defaultLayout[2]}>
            MAIL
		</Resizable.Pane>
    </Resizable.PaneGroup>
</div>
