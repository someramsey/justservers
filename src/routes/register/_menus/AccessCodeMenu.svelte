<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import CopyIcon from "$lib/icons/CopyIcon.svelte";
    import { RegisterResponseSchema, type RegistrationRequest } from "$lib/schemas/api/registration";
    import { getErrorMessage } from "$lib/util/get_error_message";
    import axios from "axios";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import * as v from "valibot";
    import { accessCodeStore, selectedUserStore } from "../+page.svelte";
    import { goto } from "$app/navigation";
    import { generateAccessCode } from "$lib/util/generate_access_code";

    let errorMessage = $state<string | null>(null);
    let isBusy = $state<boolean>(false);
    let showCopiedTooltip = $state(false);

    const canContinue = $derived($accessCodeStore != null && $accessCodeStore.length > 3 && !isBusy);

    async function copyToClipboard() {
        if ($accessCodeStore) {
            await navigator.clipboard.writeText($accessCodeStore);
            showCopiedTooltip = true;
            setTimeout(() => {
                showCopiedTooltip = false;
            }, 2000);
        }
    }

    onMount(() => {
        if (!$accessCodeStore) {
            $accessCodeStore = generateAccessCode();
        }
    });

    async function register() {
        isBusy = true;

        try {
            const resp = await axios
                .post("/api/register/create_account", {
                    robloxId: $selectedUserStore!.robloxId,
                    accessCode: $accessCodeStore
                } satisfies RegistrationRequest)
                .then((response) => v.parse(RegisterResponseSchema, response.data));

            if (!resp.success) {
                errorMessage = resp.message;
                isBusy = false;
                return;
            }

            localStorage.setItem("client-id", resp.clientId);
            
            errorMessage = null;
            goto("/games");
        } catch (err) {
            console.error("Error:", getErrorMessage(err));
            errorMessage = "An unknown error occurred. Please try again later.";
        }

        isBusy = false;
    }
</script>

<div class="w-full flex flex-col items-center gap-2">
    <h1 class="text-xl">Choose your access code</h1>
    <p class="text-center text-neutral-400">
        Select an access code you like, save it somewhere safe and don't share it with anyone. You will need it to log
        into your account in the future.
        <br />
        It's recommended to use a randomly generated code, but you can also choose your own.
    </p>
    <p class="text-center text-orange-400 mt-5">DO <u>NOT</u> USE YOUR ROBLOX PASSWORD</p>

    <input
        type="text"
        class="border uppercase text-2xl text-center transition-colors border-neutral-800 hover:border-neutral-700 outline-neutral-700 focus:outline-1 rounded-xl p-2 w-full pl-10 pr-10"
        bind:value={$accessCodeStore} />
    <div class="w-full mt-5 flex justify-between">
        <div class="flex gap-2">
            <div class="relative">
                <Button variant="outlined" class="px-4 py-2 flex" onclick={copyToClipboard}>
                    <CopyIcon width={24} height={24} />
                </Button>
                {#if showCopiedTooltip}
                    <div
                        transition:fade
                        class="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-neutral-900 text-white px-2 py-1 rounded-md text-sm whitespace-nowrap">
                        Copied!
                    </div>
                {/if}
            </div>
            <Button
                variant="outlined"
                class="px-4 py-2 flex"
                onclick={() => {
                    $accessCodeStore = generateAccessCode();
                }}>Regenerate</Button>
        </div>

        <Button disabled={!canContinue} variant="filled" class="px-4 py-2 flex" onclick={register}>Done</Button>
    </div>

    {#if errorMessage}
        <p class="text-red-500 text-sm mt-2">{errorMessage}</p>
    {/if}
</div>
