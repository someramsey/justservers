<script context="module" lang="ts">
    import { writable } from "svelte/store";
    import type { User } from "./types/user";

    export type ResultsPanelData = {
        state: "hidden" | "no-results" | "error"
    } | {
        state: "results",
        results: User[],
    };

    function createResultsPanelStore() {
        const initialState: ResultsPanelData = { state: "hidden" };
        const { set, subscribe, update } = writable<ResultsPanelData>(initialState);

        return {
            subscribe,
            update,
            hide() {
                set({ state: "hidden" });
            },
            showError() {
                set({ state: "error" });
            },
            showResults(results: User[]) {
                if (results.length === 0) {
                    set({ state: "no-results" });
                } else {
                    set({ state: "results", results });
                }
            },
            reset() {
                set(initialState);
            },
        }
    }

    export const resultsPanelStore = createResultsPanelStore();
</script>

<script lang="ts">
    import { ChevronRightIcon } from "$lib";
    import { cubicOut } from "svelte/easing";
    import { slide } from "svelte/transition";

    export let onUserSelected: (user: User) => void;
</script>

{#if $resultsPanelStore.state !== "hidden"}
    <div class="w-full min-h-30 max-h-100 overflow-scroll p-3 flex flex-col gap-2 rounded-xl border border-neutral-800 bg-neutral-900 transition-all duration-300 ease-in-out" transition:slide={{ duration: 400, easing: cubicOut }}>
        {#if $resultsPanelStore.state === "error"}
            <div class="text-center m-auto">
                <p class="text-red-400 font-medium">Error</p>
                <p class="text-neutral-400 text-sm mt-1"> Search failed. Please try again later. </p>
            </div>
        {:else if $resultsPanelStore.state === "no-results"}
            <p class="text-neutral-400 m-auto">No results found</p>
        {:else if $resultsPanelStore.state === "results"}
            {#each $resultsPanelStore.results as user}
                <button class="flex items-center space-x-3 p-3 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors cursor-pointer w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500" onclick={() => onUserSelected(user)} type="button">
                    <img src={user.profilePicture} alt={`${user.username}'s profile`} class="w-12 h-12 rounded-full object-cover" />
                    <div class="flex-1 min-w-0">
                        <p class="text-white font-medium truncate">
                            {user.username}
                        </p>
                        <p class="text-neutral-400 text-xs">
                            {user.id}
                        </p>
                    </div>
                    <div class="text-neutral-500">
                        <ChevronRightIcon />
                    </div>
                </button>
            {/each}
        {/if}
    </div>
{/if}
