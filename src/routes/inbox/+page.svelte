<script lang="ts">
    import Mail from "$lib/components/mail.svelte";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import AppSidebar from "$lib/components/app-sidebar.svelte";
    import PostalMime from "postal-mime";
	import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import type { Email } from "$lib/data";

	const emails = writable<Email[]>([]);

	const apiData = [
		{
			id: 1,
			content: `From: Sender Name <sender@example.com>\r\nTo: recipient@example.com\r\nSubject: Hello\r\nMessage-ID: <7e2c1402-709d-d5e6-e59b-a534816f0445@example.com>\r\nContent-Transfer-Encoding: 7bit\r\nDate: Mon, 09 Dec 2024 21:14:40 +0000\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset=utf-8\r\n\r\nHello world?\r\n`,
			date: "2023-10-22T09:00:00",
			is_read: true,
		},
		{
			id: 2,
			content: `From: Sender Name <sender@example.com>\r\nTo: recipient@example.com\r\nSubject: Hello\r\nMessage-ID: <30e26ede-2d09-382e-7f04-de7474257a42@example.com>\r\nContent-Transfer-Encoding: 7bit\r\nDate: Wed, 04 Dec 2024 14:51:42 +0000\r\nMIME-Version: 1.0\r\nContent-Type: text/html; charset=utf-8\r\n\r\n<b>Hello world?</b>\r\n`,
			date: "2023-10-22T10:30:00",
			is_read: false,
		}
	];

	onMount(async () => {
        console.log("mounted");
        for (const email of apiData) {
            const parsed = await PostalMime.parse(email.content);
			console.log(parsed);
            emails.update((emails) => [...emails, { ...parsed, is_read: email.is_read }]);
        }
    });
	
</script>

<Sidebar.Provider>
	<AppSidebar />
	<main class="w-full">
        <Mail mails={$emails} />
	</main>
</Sidebar.Provider>
