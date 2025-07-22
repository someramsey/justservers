<script lang="ts">
    import { fade } from "svelte/transition";

    export let pending = false;
    export let onDebounce: (query: string) => void = () => {};

    let lastQuery = "";
    let debounceTimer: number;

    function debounceSearch(query: string) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            onDebounce(query);
        }, 500);
    }

    function handleInput(event: Event) {
        const target = event.target as HTMLInputElement;
        const query = target.value.trim();

        if (query == lastQuery) {
            return;
        }

        lastQuery = target.value;
        debounceSearch(lastQuery);
    }
</script>

<div class="relative w-full">
    <input type="search" class="border text-center transition-colors border-neutral-800 hover:border-neutral-700 outline-neutral-700 focus:outline-1 rounded-xl p-2 w-full pl-10 pr-10" placeholder="Enter your username or ID" on:input={handleInput} />

    {#if pending}
        <div transition:fade={{ duration: 100 }} class="absolute right-3 top-1/2 transform -translate-y-1/2">
            <span class="animate-spin h-4 w-4 border-2 border-neutral-600 border-t-neutral-400 rounded-full"></span>
        </div>
    {/if}
</div>
