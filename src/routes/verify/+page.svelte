

<script lang="ts">
    import Button from "$lib/Button.svelte";
    import { fly } from "svelte/transition";
    import ResultsPanel from "./ResultsPanel.svelte";
    import SearchField from "./SearchField.svelte";
    import UserSummary from "./UserSummary.svelte";
    import type { ResultsPanelData } from "./types/results_panel_state";
    import type { SearchState } from "./types/search_state";
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

    type MenuState = "search" | "confirm";
    let menuState: MenuState = "search";

    let searchQuery: string = "";
    let searchState: SearchState = "idle";
    let resultsPanelData: ResultsPanelData = {
        state: "hidden",
    };
    let selectedUserData: User | null = null;

    async function fetchUsers(query: string): Promise<User[]> {
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

    let debounceTimer: number;

    function doDebounce(query: string) {
        clearTimeout(debounceTimer);

        if (!query.trim()) {
            searchState = "idle";
            resultsPanelData = { state: "hidden" };
            return;
        }

        searchState = "waiting";

        debounceTimer = setTimeout(() => {
            doSearch(query);
        }, 500);
    }

    async function doSearch(query: string) {
        searchState = "searching";

        await fetchUsers(query)
            .then((users) => {
                resultsPanelData = {
                    state: "results",
                    results: users,
                };
            })
            .catch((error) => {
                console.error("Search failed:", error);
                resultsPanelData = {
                    state: "error",
                };
            });

        searchState = "idle";
    }

    async function onUserSelected(user: User) {
        selectedUserData = user;
        menuState = "confirm";
    }
</script>

<main>
    {#if menuState === "search"}
        <div class="menu" transition:fly={{ x: "-100%", duration: 500 }}>
            <h2 class="font-light m-2 text-center text-3xl text-neutral-200"> Search your account </h2>
            <SearchField bind:searchQuery state={searchState} onType={doDebounce} />
            <ResultsPanel data={resultsPanelData} {onUserSelected} />
        </div>
    {:else if menuState === "confirm"}
        <div class="menu" transition:fly={{ x: "100%", duration: 500 }}>
            <h2 class="font-light m-2 text-center text-3xl text-neutral-200"> Is this your account? </h2>

            <UserSummary user={selectedUserData} />

            <div class="flex mt-4 items-center justify-center">
                <Button variant="outlined" class="px-4 py-2 m-auto flex" onclick={() => (menuState = "search")}>No, search again</Button>
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
