<script lang="ts">
	import { base } from "$app/paths";
	import ArrowLeft from "lucide-svelte/icons/arrow-left";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Card from "$lib/components/ui/card/index.js";

	import { onMount } from 'svelte';
	import { accounts } from '$lib/stores/accounts';
	import { superForm, defaults } from 'sveltekit-superforms';
	import { type Account } from "$lib/data";
	import { zod } from 'sveltekit-superforms/adapters';
	import { z } from "zod";
	import * as Form from "$lib/components/ui/form";
	import Input from "$lib/components/ui/input/input.svelte";

	let accountList: Account[] = [];

	onMount(() => {
        accounts.subscribe(value => {
            accountList = Array.from(value);
        });
    });

	const formSchema = z.object({
	        username: z.string().min(4, { message: 'Must be 3 or more characters long' }),
	        password: z
		        .string()
		        .min(4, { message: 'Must be 8 or more characters long' })
		        .max(50, { message: 'Must be 50 characters or less' })
        });

	const form = superForm(defaults(zod(formSchema)), {
		SPA: true,
		validators: zod(formSchema),
		resetForm: false
	});

	const { form: formData, enhance, validateForm, errors } = form;

	async function handleSubmit(event: Event) {
		event.preventDefault();
		const result = await validateForm();

		if (!result.valid) {
			errors.update((v) => {
				return {
					...v,
					username: result.errors.username,
					password: result.errors.password
				};
			});

			return;
		}
		
		addAccount(result.data.username, result.data.password);
	}

	function addAccount(name: string, password: string) {
        const newAccount: Account = {
            name,
            password,
			"last" : null,
			"total" : null,
			"lastUpdate": null			
        };
        accounts.update(set => {
            set.add(newAccount);
            return set;
        });
		
		window.location.href = `${base}/`;
    }
</script>

<div class="flex justify-center items-center h-screen">
	<Card.Root>
		<Card.Header class="space-y-1">
			<Button variant="outline" class="mb-2 w-fit" href={`${base}/`}>
				<ArrowLeft /> Go back
			</Button>
			<Card.Title class="text-2xl">Add an account</Card.Title>
			<Card.Description
				>Enter your credentials below to add an account</Card.Description
			>
		</Card.Header>
		<Card.Content class="grid gap-4">
			<form method="POST" use:enhance onsubmit={handleSubmit}>
				<Form.Field {form} name="username">
					<Form.Control>
						<Form.Label>Username</Form.Label>
						<Input bind:value={$formData.username} />
					</Form.Control>
					<Form.Description />
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="password">
					<Form.Control>
						<Form.Label>Password</Form.Label>
						<Input bind:value={$formData.password} />
					</Form.Control>
					<Form.Description />
					<Form.FieldErrors />
				</Form.Field>

				<Form.Button class="w-full mt-4">Add account</Form.Button>
			</form>
		</Card.Content>
	</Card.Root>
</div>
