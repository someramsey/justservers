<script>
    import { goto } from "$app/navigation";
    import Button from "$lib/components/Button.svelte";
    import { OperationResultResponseSchema } from "$lib/schemas/api/common";
    import { toast } from "@zerodevx/svelte-toast";
    import axios from "axios";
    import { onMount } from "svelte";
    import * as v from "valibot";

    let demoUsed = false;

    onMount(() => {
        demoUsed = localStorage.getItem("demo-used") === "consumed";
    });
</script>

<main class="flex flex-col items-center justify-center mt-[10vh] m-10">
    <div class="max-w-[800px] flex flex-col items-center text-center">
        <h1 class="hammersmith-regular text-5xl">Just Servers</h1>
        <p class="hanken-regular text-neutral-300 max-w-100 text-2xl">
            We want paid private servers to be available to <b>everyone</b> for free
        </p>

        <Button variant="filled" class="px-4 py-2 mt-10 font-bold m-auto flex" onclick={() => goto("/register")}>
            <span class="text-lg m-auto">Continue with Roblox</span>
            <img src="roblox.png" width={24} height={24} alt="Roblox Logo" class="inline-block m-1 ml-2" />
        </Button>

        {#if !demoUsed}
            <p class="mt-8 max-w-110 text-neutral-500">
                Just want to test it? No worries you can try it out before you decide if you would like to verify your
                account
            </p>
            <Button
                variant="outlined"
                class="px-4 py-2 mt-4 font-normal m-auto flex"
                onclick={async () => {
                    try {
                        const resp = await axios
                            .get("/api/demo/activate")
                            .then((response) => v.parse(OperationResultResponseSchema, response.data));
                        
                        if (resp.success) {
                            localStorage.setItem("demo-used", "consumed");
                            goto("games/");
                        } else {
                            toast.push("Failed to activate demo session: " + resp.message);
                        }
                    } catch (err) {
                        console.error("Failed activating demo session:", err);
                        toast.push("Failed to activate demo session.");
                    }
                }}>
                Try a one-time demo</Button>
        {/if}
    </div>

    <h2 class="mt-20 text-3xl text-neutral-300 text-center">Currently available games</h2>
    <div class="mt-10 flex flex-wrap justify-center ml-10 mr-10 max-w-[1100px] gap-8">
        <img src={"./games/bloxfruits.png"} alt="blox fruits" class="min-w-70 h-50 rounded object-cover" />
        <img src={"./games/roghoul.png"} alt="blox fruits" class="min-w-70 h-50 rounded object-cover" />
    </div>
</main>

<footer class="flex flex-col mt-10 p-12">
    <p class="text-xl text-neutral-400 text-center">
        Not what you wanted? Join our discord server to recommend more games
    </p>
    <div class="flex flex-wrap items-center justify-evenly mt-8">
        <!-- TODO: Add links for socials -->
        <a href="https://discord.gg/9tUCHAPCZ4" class="p-5">
            <img src="./social/discord.png" width="150" alt="" />
        </a>
        <a href="https://www.youtube.com/@just.servers/" class="p-5">
            <img src="./social/youtube.png" width="130" alt="" />
        </a>
        <!-- <a href="tiktok" class="p-5">
            <img src="./social/tiktok.png" width="135" alt="" />
        </a> -->
    </div>
</footer>
