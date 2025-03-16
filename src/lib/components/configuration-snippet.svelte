<script lang="ts">
    import Copy from "lucide-svelte/icons/copy";
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
    import Laravel from "$lib/assets/Laravel.svg";
    import { toast } from "svelte-sonner";

    const LARAVEL_SNIPPET = `MAIL_DRIVER=smtp
MAIL_HOST=test.opentrust.it
MAIL_PORT=465
MAIL_USERNAME=username
MAIL_PASSWORD=password`;

    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text);
        toast("Copied to clipboard");
        toast.success("Copied to clipboard", {
            description: "The configuration has been copied to the clipboard.",
        });
    }

</script>

<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <Card.Root>
        <Card.Header>
            <Card.Title>
                <div class="flex items-center justify-between">
                    <div class="flex gap-2">
                        <img
                            src={Laravel}
                            alt="Laravel"
                            class="h-6 w-6"
                        />
                        <span class="ml-2">Laravel</span>
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        onclick={() => copyToClipboard(LARAVEL_SNIPPET)}
                    >
                        <Copy />
                    </Button>
                </div>
            </Card.Title>
        </Card.Header>
        <Card.Content>
            <ScrollArea class="w-full" orientation="horizontal">
                <pre class="text-sm"><code>{LARAVEL_SNIPPET}</code></pre>
            </ScrollArea>
        </Card.Content>
    </Card.Root>
</div>