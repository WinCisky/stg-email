<script lang="ts">
    import { mailStore } from "$lib/stores/accounts.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import type { Email } from "$lib/data";

    let {
        selectedResolution,
        emailToShow,
    }: {
        selectedResolution: "desktop" | "tablet" | "mobile";
        emailToShow?: Email;
    } = $props();

    // Emails are untrusted HTML, rendered in a sandboxed iframe: without "allow-scripts" nothing
    // in the email can run (no access to the saved inbox credentials), forms are disabled and
    // links open in a new, normal tab. "allow-same-origin" only lets this component read the
    // content height: it is safe as long as "allow-scripts" is never added.
    const SANDBOX = "allow-same-origin allow-popups allow-popups-to-escape-sandbox";
    const HEAD =
        `<meta http-equiv="Content-Security-Policy" content="script-src 'none'; object-src 'none'; frame-src 'none'; form-action 'none'">` +
        `<meta name="referrer" content="no-referrer">` +
        `<base target="_blank">`;

    const html = $derived((emailToShow ?? $mailStore.selected)?.html ?? "");

    let frame: HTMLIFrameElement | undefined = $state();

    /** Sizes the frame to its content, so the email scrolls with the page like before. */
    function fitToContent() {
        const root = frame?.contentDocument?.documentElement;
        // Hidden (another tab is open): it is measured again when it becomes visible
        if (!frame || !root || frame.clientWidth === 0) return;
        // Collapse first: otherwise a shorter email would keep the previous, taller height
        frame.style.height = "0px";
        void frame.offsetHeight; // apply the new size before measuring
        frame.style.height = `${root.scrollHeight}px`;
    }

    // The content height depends on the available width: measure again whenever it changes
    // (window resized, desktop/tablet/mobile preview, Html tab shown again...)
    $effect(() => {
        if (!frame) return;
        const observed = frame;
        let width = observed.clientWidth;
        let pending = 0;
        const observer = new ResizeObserver(() => {
            if (observed.clientWidth === width) return; // height changes come from fitToContent
            width = observed.clientWidth;
            // Next frame: resizing an observed element inside its own callback is a resize loop
            cancelAnimationFrame(pending);
            pending = requestAnimationFrame(fitToContent);
        });
        observer.observe(observed);
        return () => {
            cancelAnimationFrame(pending);
            observer.disconnect();
        };
    });
</script>

{#snippet preview()}
    <!-- ph-no-capture: keeps the email out of PostHog session recordings and autocapture -->
    <div class="ph-no-capture bg-white">
        <iframe
            bind:this={frame}
            title="Email content"
            class="block w-full border-0"
            sandbox={SANDBOX}
            referrerpolicy="no-referrer"
            srcdoc={HEAD + html}
            onload={fitToContent}
        ></iframe>
    </div>
{/snippet}

{#if emailToShow}
    {@render preview()}
{:else}
    <Card.Root
        class={`mx-auto transition-all duration-500 ${
            selectedResolution === "desktop"
                ? "max-w-full"
                : selectedResolution === "tablet"
                ? "max-w-[768px]"
                : "max-w-[375px]"
        }`}
    >
        <Card.Content>
            {@render preview()}
        </Card.Content>
    </Card.Root>
{/if}
