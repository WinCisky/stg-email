<script lang="ts">
    import { mailStore } from "$lib/stores/accounts.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Table from "$lib/components/ui/table/index.js";
    import { Badge } from "$lib/components/ui/badge/index.js";
    import { Skeleton } from "$lib/components/ui/skeleton/index.js";
    import { ThumbsUp, ThumbsDown } from "lucide-svelte";

    type SpamResult = {
        score?: number;
        rules?: { score: number; description: string }[];
    };

    // This component is only mounted while the Spam tab is open: the raw email is sent to
    // the spam check service on request only, never just because an email was selected.
    let spamResult: SpamResult | null = $state(null);
    let failed = $state(false);

    $effect(() => {
        const raw = $mailStore.selected?.raw;
        spamResult = null;
        failed = false;
        if (!raw) return;

        // Selecting another email cancels the pending check (no stale results)
        const controller = new AbortController();
        checkSpam(raw, controller.signal)
            .then((result) => (spamResult = result))
            .catch((error) => {
                if (controller.signal.aborted) return;
                console.error("SpamCheck error:", error);
                failed = true;
            });
        return () => controller.abort();
    });

    async function checkSpam(raw: string, signal: AbortSignal): Promise<SpamResult> {
        const response = await fetch("https://spam-check.simonellassimo.workers.dev", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: raw,
                // options: "long"
            }),
            signal,
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
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
                {#if failed}
                    <Table.Row>
                        <Table.Cell colspan={2} class="text-muted-foreground">
                            The spam check is not available right now.
                        </Table.Cell>
                    </Table.Row>
                {:else if spamResult === null}
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
