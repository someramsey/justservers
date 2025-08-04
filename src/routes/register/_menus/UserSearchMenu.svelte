<script lang="ts">
    import ChevronRightIcon from "$lib/icons/RightArrow.svelte";
    import { ThumbnailSearchResponseSchema, type ThumbnailSearchRequest } from "$lib/schemas/api/thumbnail_search";
    import { UserSearchResponseSchema, type UserSearchRequest } from "$lib/schemas/api/user_search";
    import axios, { isAxiosError } from "axios";
    import { onDestroy } from "svelte";
    import { cubicOut } from "svelte/easing";
    import { fade, slide } from "svelte/transition";
    import * as v from "valibot";
    import {
        nextMenu,
        resultsPanelStore,
        searchQueryStore,
        searchStateStore,
        selectedUserStore,
    } from "../+page.svelte";
    import { getErrorMessage } from "$lib/util/get_error_message";

    let activeAbortController: AbortController | null = null;
    let debounceTimer: ReturnType<typeof setTimeout> | undefined;

    function handleInput(event: Event) {
        const target = event.target as HTMLInputElement;
        const query = target.value.trim();

        doDebounce(query);
    }

    function doDebounce(query: string) {
        clearTimeout(debounceTimer);

        if (activeAbortController) {
            activeAbortController.abort();
            activeAbortController = null;
        }

        if (!query.trim()) {
            searchStateStore.set("idle");
            resultsPanelStore.set({ state: "hidden" });
            return;
        }

        searchStateStore.set("waiting");

        debounceTimer = setTimeout(() => {
            doSearch(query);
        }, 800);
    }

    async function doSearch(query: string) {
        searchStateStore.set("searching");

        try {
            activeAbortController = new AbortController();

            const searchResult = await axios
                .post("/api/register/search/users", { query } satisfies UserSearchRequest, {
                    responseType: "json",
                    signal: activeAbortController.signal,
                })
                .then((resp) => v.parse(UserSearchResponseSchema, resp.data));

            if (!searchResult.success) {
                resultsPanelStore.set({ state: "error" });
                searchStateStore.set("idle");
                console.error("Search failed:", searchResult.message);
                return;
            }

            resultsPanelStore.set({
                state: "results",
                results: searchResult.data!,
            });

            const thumbnailSearchTargets = searchResult.data.map((user) => user.robloxId);
            const thumbnailSearchResult = await axios
                .post("/api/register/search/thumbnails", { targets: thumbnailSearchTargets } satisfies ThumbnailSearchRequest, {
                    responseType: "json",
                    signal: activeAbortController.signal,
                })
                .then((resp) => v.parse(ThumbnailSearchResponseSchema, resp.data));
            if (thumbnailSearchResult.success) {
                resultsPanelStore.set({
                    state: "results",
                    results: searchResult.data!.map((user) => ({
                        ...user,
                        profileUrl: thumbnailSearchResult.data.find((thumb) => thumb.robloxId === user.robloxId)
                            ?.thumbnailUrl,
                    })),
                });
            } else {
                console.error("Thumbnail search failed:", thumbnailSearchResult.message);
            }

            searchStateStore.set("idle");
        } catch (error) {
            if (isAxiosError(error) && error.code === "ERR_CANCELED") {
                console.log("Search request was canceled.");
                return;
            }

            resultsPanelStore.set({ state: "error" });
            searchStateStore.set("idle");
            console.error("Search failed:", getErrorMessage(error));
        }
    }

    onDestroy(() => {
        if (activeAbortController) {
            activeAbortController.abort();
            activeAbortController = null;
        }

        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }
    });
</script>

<h2 class="font-light m-2 text-center text-3xl text-neutral-200">Search your account</h2>
<div class="relative w-full">
    <input
        type="search"
        bind:value={$searchQueryStore}
        oninput={handleInput}
        class="border text-center transition-colors border-neutral-800 hover:border-neutral-700 outline-neutral-700 focus:outline-1 rounded-xl p-2 w-full pl-10 pr-10"
        placeholder="Enter your username or ID" />

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

{#if $resultsPanelStore.state !== "hidden"}
    <div
        class="w-full min-h-20 mt-2 max-h-100 overflow-scroll p-3 flex flex-col gap-2 rounded-xl border border-neutral-800 bg-neutral-900 transition-all duration-300 ease-in-out"
        transition:slide={{ duration: 400, easing: cubicOut }}>
        {#if $resultsPanelStore.state === "error"}
            <div class="text-center m-auto">
                <p class="text-red-400 font-medium">Error</p>
                <p class="text-neutral-400 text-sm mt-1">Search failed. Please try again later.</p>
            </div>
        {:else if $resultsPanelStore.state === "results"}
            {#if $resultsPanelStore.results.length === 0}
                <p class="text-neutral-400 m-auto">No results found</p>
            {:else}
                {#each $resultsPanelStore.results as user}
                    <button
                        class="flex items-center space-x-3 p-3 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors cursor-pointer w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onclick={() => {
                            selectedUserStore.set(user);
                            nextMenu();
                        }}
                        type="button">
                        <img
                            src={user.profileUrl ?? "profile_placeholder.jpg"}
                            alt={`${user.username}'s profile`}
                            class="w-12 h-12 rounded-full object-cover" />
                        <div class="flex-1 min-w-0">
                            <p class="text-white font-medium truncate">
                                {user.username}
                            </p>
                            <p class="text-neutral-400 text-xs">
                                {user.robloxId}
                            </p>
                        </div>
                        <div class="text-neutral-500">
                            <ChevronRightIcon width={16} height={16} />
                        </div>
                    </button>
                {/each}
            {/if}
        {/if}
    </div>
{/if}
