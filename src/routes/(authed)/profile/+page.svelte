<script lang="ts">
    import { goto } from "$app/navigation";
    import Accordion from "$lib/components/Accordion.svelte";
    import Button from "$lib/components/Button.svelte";
    import RightArrow from "$lib/icons/RightArrow.svelte";
    import { OperationResultResponseSchema } from "$lib/schemas/api/common.js";
    import {
        UpdateAccessCodeResponseSchema,
        type UpdateAccessCodeRequest,
    } from "$lib/schemas/api/update_access_code.js";
    import { generateAccessCode } from "$lib/util/generate_access_code.js";
    import axios from "axios";
    import * as v from "valibot";
    const { data } = $props();

    let newAccessCode = $state<string>("");
    let shouldShowSuccessMessage = $state<boolean>(false);
    let accessCodeError = $state<string | null>(null);
    let isUpdatingCode = $state<boolean>(false);

    const canUpdateAccessCode = $derived(newAccessCode.length > 3 && newAccessCode.trim() !== "" && !isUpdatingCode);

    function showSuccessMessage() {
        shouldShowSuccessMessage = true;

        setTimeout(() => {
            shouldShowSuccessMessage = false;
        }, 3000);
    }

    async function updateAccessCode() {
        if (!canUpdateAccessCode) return;

        isUpdatingCode = true;
        shouldShowSuccessMessage = false;
        accessCodeError = null;

        try {
            const resp = await axios
                .post("/api/update_access_code", {
                    code: newAccessCode.trim(),
                } satisfies UpdateAccessCodeRequest)
                .then((resp) => v.parse(UpdateAccessCodeResponseSchema, resp.data));

            if (resp.success) {
                showSuccessMessage();
                newAccessCode = "";
            } else {
                accessCodeError = resp.message;
            }
        } catch (error) {
            console.error("Error updating access code:", error);
            accessCodeError = "An unknown error er occured";
        }

        isUpdatingCode = false;
    }

    function fckAllMeaningInLifeANdForceClearCookiesInnAWayThatIAmReallyNotContentWith() {
        document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        /*Sometimes I lay in my bed remembering this one specific line in this unholy 
        codebase and regret my choices. Then i think, what does it mean to 'log out' anyway? Are we 
        just pretending that identity can be so easily discarded? This access token, this ephemeral 
        string of characters that proves 'you are who you say you are'. There's something poetic about 
        sending someone's digital identity back to the dawn of computing. I've been staring at this 
        error handling for months now, and each time I wonder: who decided that clearing cookies 
        should be this complex? Why do we need fallbacks for fallbacks? The very existence of this 
        line represents every compromise we've made with the browser, every workaround for inconsistent 
        APIs, every moment where the ideal vision of how the web should work crashes against the harsh 
        reality of how it actually works. The user doesn't know they're here, in this catch block. They 
        clicked a button expecting to log out, and for all they know, it worked perfectly. But I know. I 
        know we're here because something went wrong, because the network failed, because the server hiccupped, 
        because the universe conspired against our simple desire to end a session cleanly. And yet, life 
        goes on. The cookie expires. The user gets redirected to the home page. The illusion of seamless 
        functionality remains intact. But deep in the console, this message exists as a testament to 
        the fragility of it all. A digital scream...*/
    }
</script>

<Button variant="sunken" class="absolute p-2 top-8 right-8" onclick={() => goto("/games")}>
    <RightArrow width={24} height={24} />
</Button>

{#if data.user.mode === "authenticated"}
    <div class="flex flex-col items-center justify-center h-screen">
        <div class="m-auto w-[80vw] max-w-[800px] h-[80%]">
            <div class="flex flex-col items-center justify-center p-10">
                <img
                    src={data.user.thumbnailUrl ?? "/profile_placeholder.jpg"}
                    alt="Avatar"
                    class="border border-neutral-800 bg-neutral-900 w-32 h-32 rounded-full" />
                <h2 class="mt-5 font-light text-3xl">{data.user.displayName}</h2>
            </div>

            <div class="w-full px-10 mb-8">
                <Accordion title="Access Code Settings">
                    <p class="text-neutral-400 text-sm mb-4">
                        Update your access code. Keep it secure and don't share it with anyone.
                        <br />
                        <span class="text-orange-400"
                            >This will log-out all other devices using your old access-code</span>
                    </p>

                    <div class="flex flex-wrap gap-3 items-end mb-3">
                        <div class="flex-1 max-w-xs">
                            <input
                                type="text"
                                placeholder="Access code"
                                class="border uppercase text-sm min-w-40 transition-colors border-neutral-800 hover:border-neutral-700 outline-neutral-700 focus:outline-1 rounded-lg p-2 w-full"
                                bind:value={newAccessCode} />
                        </div>
                        <div class="flex gap-3">
                            <Button
                                variant="sunken"
                                class="px-3 py-2 text-xs md:text-sm"
                                disabled={isUpdatingCode}
                                onclick={() => {
                                    newAccessCode = generateAccessCode();
                                }}>Generate Random</Button>

                            <Button
                                variant="filled"
                                class="px-3 py-2 text-xs md:text-sm"
                                disabled={!canUpdateAccessCode || isUpdatingCode}
                                onclick={updateAccessCode}>
                                {isUpdatingCode ? "Updating..." : "Update"}
                            </Button>
                        </div>
                    </div>

                    {#if shouldShowSuccessMessage || accessCodeError}
                        <div class="mb-2">
                            {#if shouldShowSuccessMessage}
                                <p class="text-green-500 text-sm">Access code updated successfully!</p>
                            {/if}
                            {#if accessCodeError}
                                <p class="text-red-500 text-sm">{accessCodeError}</p>
                            {/if}
                        </div>
                    {/if}
                </Accordion>
            </div>

            <div class="w-full flex justify-between px-10">
                <Button
                    variant="filled"
                    class="bg-red-700 hover:bg-red-400 active:bg-red-200 font-bold text-white px-4 py-2"
                    onclick={async () => {
                        if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                            try {
                                const resp = await axios
                                    .get("/api/delete_account")
                                    .then((resp) => v.parse(OperationResultResponseSchema, resp.data));

                                if (resp.success) {
                                    goto("/");
                                } else {
                                    alert(`Error deleting account: ${resp.message}`);
                                }
                            } catch (error) {
                                console.error("Error deleting account:", error);
                                alert(
                                    "An unknown error occurred, the server might not be available right now. Please try again later."
                                );
                            }
                        }
                    }}>Delete Account</Button>
                <Button
                    onclick={async () => {
                        try {
                            await axios.get("/api/logout");
                        } catch (error) {
                            console.error("Error logging out via API:", error);
                            fckAllMeaningInLifeANdForceClearCookiesInnAWayThatIAmReallyNotContentWith();
                        }

                        goto("/");
                    }}
                    variant="outlined"
                    class="px-4 py-2">Log Out</Button>
            </div>
        </div>
    </div>
{/if}
