<script lang="ts">
    import { mailStore } from "$lib/stores/accounts.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Table from "$lib/components/ui/table/index.js";
    import { Badge } from "$lib/components/ui/badge/index.js";
    import { Skeleton } from "$lib/components/ui/skeleton/index.js";
    import { ThumbsUp, ThumbsDown } from "lucide-svelte";

    let spamResult: any = null;

    mailStore.subscribe((value) => {
        spamResult = null;
        if (value.selected) {
            checkSpam(value.selected.raw);
        }
    });

    async function checkSpam(raw: string) {
        try {
            const response = await fetch("https://wise-pheasant-67.deno.dev", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: raw,
                    // options: "long"
                }),
            });
            spamResult = await response.json();
        } catch (error) {
            console.error("SpamCheck error:", error);
        }
    }
</script>

<Card.Root>
    <Card.Content>
        <Table.Root>
            <Table.Header>
                <Table.Row>
                    <Table.Head>Score</Table.Head>
                    <Table.Head>Description</Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {#if spamResult === null}
                    {#each { length: 3 } as _}
                        <Table.Row>
                            <Table.Cell
                                ><Skeleton class="h-4 w-[50px]" /></Table.Cell
                            >
                            <Table.Cell
                                ><Skeleton class="h-4 w-[250px]" /></Table.Cell
                            >
                        </Table.Row>
                    {/each}
                {:else}
                    {#each spamResult.rules ?? [] as rule}
                        <Table.Row>
                            <Table.Cell>{rule.score}</Table.Cell>
                            <Table.Cell>{rule.description}</Table.Cell>
                        </Table.Row>
                    {/each}
                {/if}
            </Table.Body>
            {#if spamResult !== null && spamResult.score !== undefined}
                <Table.Caption>
                    <div class="flex justify-center items-center gap-2">
                        Score:
                        <Badge variant="outline">{spamResult.score}</Badge>
                        {#if spamResult.score >= 0}
                            <ThumbsUp class="h-4 w-4 text-green-500" />
                        {:else}
                            <ThumbsDown class="h-4 w-4 text-red-500" />
                        {/if}
                    </div>
                </Table.Caption>
            {/if}
        </Table.Root>
    </Card.Content>
</Card.Root>
