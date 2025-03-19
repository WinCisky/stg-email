<script lang="ts">
    let {
        value = $bindable(),
        options,
    }: { value: string; options: { label: string; value: string }[] } =
        $props();

    function handleChange(newValue: string) {
        value = newValue;
    }
</script>

<div class="flex w-fit rounded-sm p-1 bg-muted gap-2">
    {#each options as option}
        <!-- Nascondiamo il radio e usiamo direttamente l'evento click su label -->
        <button
            class="block px-3 py-1.5 rounded cursor-pointer text-sm font-medium transition-all
            {option.value === value ? 'bg-background shadow-sm' : 'opacity-50'}"
            onclick={() => handleChange(option.value)}
        >
            {option.label}
        </button>
    {/each}
</div>