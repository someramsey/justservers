<script lang="ts">
    import Button from "$lib/Button.svelte";
    import { fly } from "svelte/transition";
    import ResultsPanel, { resultsPanelStore } from "./ResultsPanel.svelte";
    import SearchField, { searchStateStore } from "./SearchField.svelte";
    import UserSummary from "./UserSummary.svelte";
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

    let selectedUserData: User | null = null;
``
    const abortController = new AbortController(); 

    //TODO: Actually implement
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

    let debounceTimer: number;

    function doDebounce(query: string) {
        clearTimeout(debounceTimer);
        abortController.abort();

        if (!query.trim()) {
            searchStateStore.set("idle");
            resultsPanelStore.hide();
            return;
        }

        searchStateStore.set("waiting");

        debounceTimer = setTimeout(() => {
            doSearch(query);
        }, 500);
    }

    async function doSearch(query: string) {
        searchStateStore.set("searching");

        await fetchUsers(query)
            .then((users) => {
                resultsPanelStore.showResults(users);
            })
            .catch((error) => {
                console.error("Search failed:", error);
                resultsPanelStore.showError();
            });

        searchStateStore.set("idle");
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
            <SearchField onType={doDebounce} />
            <ResultsPanel {onUserSelected} />
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
