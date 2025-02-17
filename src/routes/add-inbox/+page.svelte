<script lang="ts">
    import { base } from "$app/paths";
  	import ArrowLeft from "lucide-svelte/icons/arrow-left";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
</script>

<div class="flex justify-center items-center h-screen">
	<Card.Root>
		<Card.Header class="space-y-1">
			<Button variant="outline" class="mb-2 w-fit" href={`${base}/`}>
				<ArrowLeft /> Go back
			  </Button>
			<Card.Title class="text-2xl">Add an account</Card.Title>
			<Card.Description>Enter your credentials below to add an account</Card.Description>
		</Card.Header>
		<Card.Content class="grid gap-4">
			<div class="grid gap-2">
				<Label for="username">Username</Label>
				<Input id="username" type="text" />
			</div>
			<div class="grid gap-2">
				<Label for="password">Password</Label>
				<Input id="password" type="password" />
			</div>
		</Card.Content>
		<Card.Footer>
			<Button class="w-full">Add account</Button>
		</Card.Footer>
	</Card.Root>
</div>