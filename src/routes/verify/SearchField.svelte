<script context="module" lang="ts">
    import { writable } from "svelte/store";
    import type { SearchState } from "./types/search_state";

    export const searchStateStore = writable<SearchState>("idle");
    const searchQueryStore = writable<string>("");
</script>

<script lang="ts">
    import { fade } from "svelte/transition";

    export let onType: (query: string) => void = () => {};

    function handleInput(event: Event) {
        const target = event.target as HTMLInputElement;
        const query = target.value.trim();

        onType(query);
    }
</script>

<div class="relative w-full">
    <input type="search" bind:value={$searchQueryStore} on:input={handleInput} class="border text-center transition-colors border-neutral-800 hover:border-neutral-700 outline-neutral-700 focus:outline-1 rounded-xl p-2 w-full pl-10 pr-10" placeholder="Enter your username or ID" />

    {#if $searchStateStore !== "idle"}
        <div transition:fade={{ duration: 200 }} class="absolute right-3 top-1/2 transform -translate-y-1/2">
            {#if $searchStateStore === "searching"}
                <div class="animate-spin h-4 w-4 border-2 border-neutral-600 border-t-neutral-400 rounded-full"></div>
            {:else if $searchStateStore === "waiting"}
                <div class="h-4 w-4 bg-neutral-600 rounded-full"></div>
            {/if}
        </div>
    {/if}
</div>
