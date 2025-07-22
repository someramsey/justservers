<!-- <script lang="ts">
    import ChevronRightIcon from "$lib/icons/RightArrow.svelte";

    interface User {
        id: string;
        username: string;
        profilePicture: string;
    }

    const SearchState = {
        IDLE: "idle",
        RESULTS_FOUND: "results_found",
        NO_RESULTS: "no_results",
        ERROR: "error"
    } as const;

    type SearchStateType = typeof SearchState[keyof typeof SearchState];

    let searchQuery = "";
    let searchResults: User[] = [];
    let isSearching = false;
    let searchState: SearchStateType = SearchState.IDLE;
    let searchTimeout: ReturnType<typeof setTimeout>;
   
    const mockUsers: User[] = [
        {
            id: "123456789",
            username: "john_doe",
            profilePicture: "/roblox.png",
        },
        {
            id: "123456789",
            username: "john_doe",
            profilePicture: "/roblox.png",
        },
        {
            id: "123456789",
            username: "john_doe",
            profilePicture: "/roblox.png",
        },
        {
            id: "123456789",
            username: "john_doe",
            profilePicture: "/roblox.png",
        },
        {
            id: "123456789",
            username: "john_doe",
            profilePicture: "/roblox.png",
        },
        {
            id: "123456789",
            username: "john_doe",
            profilePicture: "/roblox.png",
        },
        {
            id: "123456789",
            username: "john_doe",
            profilePicture: "/roblox.png",
        },
        {
            id: "987654321",
            username: "jane_smith",
            profilePicture: "/blox.png",
        },
        {
            id: "456789123",
            username: "cool_gamer",
            profilePicture: "/roblox.png",
        },
        {
            id: "789123456",
            username: "pro_player",
            profilePicture: "/blox.png",
        },
        {
            id: "321654987",
            username: "john_player",
            profilePicture: "/roblox.png",
        },
    ];

    function resetSearch() {
        searchState = SearchState.IDLE;
        searchResults = [];
        isSearching = false;
    }

    function isValidQuery(query: string): boolean {
        return query.trim() !== "";
    }

    async function searchUsers(query: string): Promise<User[]> {
        return new Promise((resolve, reject) => {
            if (query === "err") {
                reject(new Error("Simulated API error"));
                return;
            }

            setTimeout(() => {
                const results = mockUsers.filter(
                    (user) =>
                        user.username
                            .toLowerCase()
                            .includes(query.toLowerCase()) ||
                        user.id.includes(query),
                );

                resolve(results);
            }, 500);
        });
    }

    function debounceSearch(query: string) {
        clearTimeout(searchTimeout);

        if (!isValidQuery(query)) {
            resetSearch();
            return;
        }

        isSearching = true;

        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 700);
    }

    async function performSearch(query: string) {
        if (!isValidQuery(query)) {
            resetSearch();
            return;
        }

        try {
            if (!isValidQuery(query) || query !== searchQuery.trim()) {
                resetSearch();
                return;
            }

            const results = await searchUsers(query);

            if (!isValidQuery(query) || query !== searchQuery.trim()) {
                resetSearch();
                return;
            }

            searchResults = results;
            searchState = results.length > 0 ? SearchState.RESULTS_FOUND : SearchState.NO_RESULTS;
            isSearching = false;
        } catch (error) {
            console.error("Search failed:", error);
            searchResults = [];
            searchState = SearchState.ERROR;
            isSearching = false;
        }
    }

    function handleInput(event: Event) {
        const target = event.target as HTMLInputElement;
        debounceSearch(target.value);
    }

    $: hasValidQuery = isValidQuery(searchQuery);
    $: shouldShowResults = searchState !== SearchState.IDLE && hasValidQuery;
    $: hasNoResults = searchState === SearchState.NO_RESULTS;
    $: hasError = searchState === SearchState.ERROR;

    $: panelHeight = (() => {
        if (!shouldShowResults && !isSearching) {
            return "0px";
        }

        const basePadding = 32;
        const itemSpacing = 12;

        if (hasError || hasNoResults) {
            return "120px";
        }

        const itemHeight = 72;
        const totalItemHeight = searchResults.length * itemHeight;
        const totalSpacing = Math.max(
            0,
            (searchResults.length - 1) * itemSpacing,
        );
        const calculatedHeight = basePadding + totalItemHeight + totalSpacing;

        const maxHeight = 400;
        const minHeight = 80;

        return (
            Math.max(minHeight, Math.min(calculatedHeight, maxHeight)) + "px"
        );
    })();
</script>

<main class="flex flex-col items-center justify-center h-[100%] px-4">
    <h2 class="font-light text-center text-3xl text-neutral-200">
        Search your account
    </h2>

    <div class="mt-5 w-full max-w-md">
        <div class="relative">
            <input
                type="search"
                bind:value={searchQuery}
                on:input={handleInput}
                class="border text-center transition-colors border-neutral-800 hover:border-neutral-700 outline-neutral-700 focus:outline-2 rounded-xl p-2 w-full"
                placeholder="Enter your username or ID"
            />

            {#if isSearching}
                <div
                    class="absolute right-4 top-1/2 transform -translate-y-1/2"
                >
                    <div
                        class="animate-spin rounded-full h-4 w-4 border-b-2 border-neutral-600"
                    ></div>
                </div>
            {/if}
        </div>

        <div
            class="mt-2 transition-all duration-500 ease-out"
            style="max-height: {panelHeight}; opacity: {shouldShowResults
                ? '1'
                : '0'};"
        >
            <div
                tabindex="-1"
                class="bg-neutral-900 overflow-scroll border border-neutral-800 rounded-xl p-4 space-y-3 transform transition-transform duration-500 ease-out"
                style="max-height: {panelHeight}; transform: translateY({shouldShowResults
                    ? '0'
                    : '-10px'});"
            >
                {#if hasError}
                    <div class="text-center">
                        <p class="text-red-400 font-medium">Search failed</p>
                        <p class="text-neutral-400 text-sm mt-1">
                            Try again later
                        </p>
                    </div>
                {:else if hasNoResults}
                    <p class="text-neutral-400 text-center py-4">
                        No results found
                    </p>
                {:else if hasValidQuery && searchState === SearchState.RESULTS_FOUND}
                    {#each searchResults as user}
                        <button
                            class="flex items-center space-x-3 p-3 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors cursor-pointer w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="button"
                        >
                            <img
                                src={user.profilePicture}
                                alt={`${user.username}'s profile`}
                                class="w-12 h-12 rounded-full object-cover"
                            />
                            <div class="flex-1 min-w-0">
                                <p class="text-white font-medium truncate">
                                    {user.username}
                                </p>
                                <p class="text-neutral-400 text-sm">
                                    ID: {user.id}
                                </p>
                            </div>
                            <div class="text-neutral-500">
                                <ChevronRightIcon />
                            </div>
                        </button>
                    {/each}
                {/if}
            </div>
        </div>
    </div>
</main> -->

<script lang="ts">
    import { fly } from "svelte/transition";
    import SearchField from "./SearchField.svelte";
    import ResultsPanel from "./ResultsPanel/ResultsPanel.svelte";
    import { resultsStore } from "./ResultsPanel/store";
    import type { User } from "./types/user";

    const mockUsers: User[] = [
        {
            id: "123456789",
            username: "john_doe",
            profilePicture: "/roblox.png",
        },
        {
            id: "123456789",
            username: "john_doe",
            profilePicture: "/roblox.png",
        },
        {
            id: "123456789",
            username: "john_doe",
            profilePicture: "/roblox.png",
        },
        {
            id: "123456789",
            username: "john_doe",
            profilePicture: "/roblox.png",
        },
        {
            id: "123456789",
            username: "john_doe",
            profilePicture: "/roblox.png",
        },
        {
            id: "123456789",
            username: "john_doe",
            profilePicture: "/roblox.png",
        },
        {
            id: "123456789",
            username: "john_doe",
            profilePicture: "/roblox.png",
        },
        {
            id: "987654321",
            username: "jane_smith",
            profilePicture: "/blox.png",
        },
        {
            id: "456789123",
            username: "cool_gamer",
            profilePicture: "/roblox.png",
        },
        {
            id: "789123456",
            username: "pro_player",
            profilePicture: "/blox.png",
        },
        {
            id: "321654987",
            username: "john_player",
            profilePicture: "/roblox.png",
        },
    ];

    let isSearching = false;

    async function searchUsers(query: string): Promise<User[]> {
        return new Promise((resolve, reject) => {
            if (query === "err") {
                reject(new Error("Simulated API error"));
                return;
            }

            setTimeout(() => {
                const results = mockUsers.filter((user) => user.username.toLowerCase().includes(query.toLowerCase()) || user.id.includes(query));

                resolve(results);
            }, 500);
        });
    }

    //TODO: Implement fetch abortion
    async function doSearch(query: string) {
        if (!query.trim()) {
            resultsStore.hide();
            return;
        }
        isSearching = true;

        await searchUsers(query)
            .then((users) => {
                resultsStore.showResults(users);
            })
            .catch((error) => {
                console.error("Search failed:", error);
                resultsStore.showError();
            });
            
        isSearching = false;
    }

    type MenuState = "search" | "confirm";
    let menuState: MenuState = "search";
</script>

<main>
    {#if menuState === "search"}
        <div class="menu flex flex-col gap-2" transition:fly={{ x: "-80%" }}>
            <SearchField pending={isSearching} onDebounce={doSearch} />
            <ResultsPanel />
        </div>
    {:else if menuState === "confirm"}
        <div class="menu" transition:fly={{ x: "80%" }}>
            <button on:click={() => (menuState = "search")}>Back to Menu 1</button>
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
    }

    button {
        padding: 0.5em 1em;
        font-size: 1em;
    }
</style>
