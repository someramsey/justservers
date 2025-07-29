<script lang="ts">
    import Button from "$lib/Button.svelte";
    import axios, { isAxiosError } from "axios";
    import { onDestroy } from "svelte";
    import { fly } from "svelte/transition";
    import * as v from "valibot";
    import {
        ThumbnailSearchResponseSchema,
        type ThumbnailReference,
        type ThumbnailSearchRequest,
    } from "../api/search/thumbnails/schemas";
    import { UserSearchResponseSchema, type UserSearchRequest } from "../api/search/users/schemas";
    import ResultsPanel from "./ResultsPanel.svelte";
    import SearchField from "./SearchField.svelte";
    import UserSummary from "./UserSummary.svelte";
    import { menuStateStore } from "./stores/menu_state";
    import { resultsPanelStore } from "./stores/results_panel";
    import { searchStateStore } from "./stores/search_state";
    import { selectedUserStore } from "./stores/selected_user";
    import type { User } from "./types/user";

    let activeAbortController: AbortController | null = null;

    let debounceTimer: ReturnType<typeof setTimeout> | undefined;

    function doDebounce(query: string) {
        clearTimeout(debounceTimer);

        if (activeAbortController) {
            activeAbortController.abort();
            activeAbortController = null;
        }

        if (!query.trim()) {
            searchStateStore.set("idle");
            resultsPanelStore.hide();
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
                .post("/api/search/users", { query } satisfies UserSearchRequest, {
                    responseType: "json",
                    signal: activeAbortController.signal,
                })
                .then((resp) => v.parse(UserSearchResponseSchema, resp.data));

            if (!searchResult.success) {
                resultsPanelStore.showError();
                searchStateStore.set("idle");
                console.error("Search failed:", searchResult.message);
                return;
            }

            resultsPanelStore.showResults(searchResult.data!);

            const thumbnailSearchTargets = searchResult.data.map((user) => user.id);
            const thumbnailSearchResult = await axios
                .post("/api/search/thumbnails", { targets: thumbnailSearchTargets } satisfies ThumbnailSearchRequest, {
                    responseType: "json",
                    signal: activeAbortController.signal,
                })
                .then((resp) => v.parse(ThumbnailSearchResponseSchema, resp.data));

            if (thumbnailSearchResult.success) {
                resultsPanelStore.showResults(
                    searchResult.data.map((user) => {
                        return {
                            ...user,
                            profileUrl: thumbnailSearchResult.data.find(
                                (thumb: ThumbnailReference) => thumb.userId === user.id
                            )?.thumbnailUrl,
                        };
                    })
                );
            } else {
                console.error("Thumbnail search failed:", thumbnailSearchResult.message);
            }

            searchStateStore.set("idle");
        } catch (error) {
            if (isAxiosError(error) && error.code === "ERR_CANCELED") {
                console.log("Search request was canceled.");
                return;
            }

            resultsPanelStore.showError();
            console.error("Search failed:", error);
        }
    }

    async function onUserSelected(user: User) {
        selectedUserStore.set(user);
        menuStateStore.set("confirm");
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

<main>
    {#if $menuStateStore === "search"}
        <div class="menu" transition:fly={{ x: "-100%", duration: 500 }}>
            <h2 class="font-light m-2 text-center text-3xl text-neutral-200">Search your account</h2>
            <SearchField onType={doDebounce} />
            <ResultsPanel {onUserSelected} />
        </div>
    {:else if $menuStateStore === "confirm"}
        <div class="menu" transition:fly={{ x: "100%", duration: 500 }}>
            <h2 class="font-light m-2 text-center text-3xl text-neutral-200">Is this your account?</h2>

            <UserSummary user={$selectedUserStore} />

            <div class="flex mt-4 items-center justify-center">
                <Button variant="outlined" class="px-4 py-2 m-auto flex" onclick={() => menuStateStore.set("search")}
                    >No, keep searching</Button>
                <Button variant="filled" class="px-4 py-2 font-bold m-auto flex">Confirm</Button>
            </div>
        </div>
    {/if}
</main>

<style>
    main {
        position: relative;
        height: 100vh;
        width: 100vw;
        overflow-x: hidden;
    }

    .menu {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 70vw;
        min-width: 200px;
        max-width: 400px;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
</style>
