<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import { onMount } from "svelte";
    import { nextMenu, previousMenu, selectedUserStore } from "../+page.svelte";
    import { UserAvailableCheckResponse } from "$lib/schemas/api/check_available";
    import axios, { AxiosError } from "axios";
    import * as v from "valibot";

    let userAvailability = $state<"checking" | "unavailable" | "available" | "failed-to-check">("checking");
    let abortController: AbortController | null = null;

    async function checkUserAvailability(robloxId: number) {
        try {
            abortController = new AbortController();

            const { available } = await axios
                .post(`/api/register/check_available`, { robloxId }, { signal: abortController.signal })
                .then((res) => v.parse(UserAvailableCheckResponse, res.data));

            if (available) {
                userAvailability = "available";
            } else {
                userAvailability = "unavailable";
            }
        } catch (error) {
            if (error instanceof AxiosError && error.code === "ERR_CANCELED") {
                return;
            }

            console.error("Error checking user availability:", error);
            userAvailability = "failed-to-check";
        } finally {
            abortController = null;
        }
    }

    function handleBackButton() {
        if (abortController) {
            abortController.abort();
        }

        previousMenu();
    }

    onMount(() => {
        if (!$selectedUserStore || !$selectedUserStore.robloxId) {
            previousMenu();
            return;
        }

        checkUserAvailability($selectedUserStore.robloxId);
    });
</script>

<div class="w-full flex flex-col items-center gap-2">
    <img
        src={$selectedUserStore?.profileUrl ?? "/profile_placeholder.jpg"}
        alt="User Profile"
        class="w-24 h-24 rounded-full object-cover" />
    <h1 class="text-xl font-semibold">{$selectedUserStore?.username ?? "Unknown User"}</h1>
    <span class="text-sm text-gray-500">{$selectedUserStore?.robloxId ?? "No ID available"}</span>
    <p class="text-center">Is this your account? Make sure you select the right account before proceeding.</p>

    {#if userAvailability === "checking"}
        <p class="text-sm text-blue-400">Checking account availability...</p>
    {:else if userAvailability === "unavailable"}
        <p class="text-sm text-red-400">This user is already registered.</p>
    {:else if userAvailability === "failed-to-check"}
        <p class="text-sm text-red-400">Failed to check account availability. Please try again later.</p>
    {/if}

    <div class="w-full mt-5 flex content-between">
        <Button variant="outlined" class="px-4 py-2 m-auto flex" onclick={handleBackButton}>No, back to search</Button>
        <Button
            variant="filled"
            class="px-4 py-2 m-auto flex"
            disabled={userAvailability !== "available"}
            onclick={() => {
                nextMenu();
            }}>
            {#if userAvailability === "checking"}
                Pending...
            {:else}
                Confirm
            {/if}
        </Button>
    </div>
</div>
