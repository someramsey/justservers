<script lang="ts">
    import { goto } from "$app/navigation";
    import { OperationResultResponseSchema } from "$lib/schemas/api/common";
    import { toast } from "@zerodevx/svelte-toast";
    import axios from "axios";
    import * as v from "valibot";
    import { onMount } from "svelte";

    const { children, data } = $props();

    let timeLeft = $state(0);
    let timerInterval: NodeJS.Timeout | null = null;

    onMount(() => {
        if (data.user.mode === "demo") {
            const expirationTime = data.user.expirationTime;

            const updateTimer = () => {
                const now = Date.now();
                timeLeft = Math.max(0, Math.floor((expirationTime - now) / 1000));

                if (timeLeft <= 0) {
                    if (timerInterval) clearInterval(timerInterval);
                    goto("/");
                }
            };

            updateTimer();
            timerInterval = setInterval(updateTimer, 1000);
        }

        return () => {
            if (timerInterval) clearInterval(timerInterval);
        };
    });

    function formatTime(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    }
</script>

<div class="flex flex-col h-[100%]">
    <header class="m-7 flex justify-between">
        <a href="/" class="hammersmith-regular text-3xl">Just Servers</a>

        {#if data.user.mode === "authenticated"}
            <a href="/profile" class="flex items-center gap-3">
                <img
                    src={data.user.thumbnailUrl ?? "/profile_placeholder.jpg"}
                    alt="Avatar"
                    class="border border-neutral-800 bg-neutral-900 w-10 h-10 rounded-full" />
                <h2 class="font-light text-2xl">{data.user.displayName}</h2>
            </a>
        {:else if data.user.mode === "demo"}
            <div class="flex gap-4 items-center">
                {#if timeLeft > 0}
                    <button
                        onclick={async () => {
                            try {
                                const resp = await axios
                                    .get("/api/demo/terminate")
                                    .then((response) => v.parse(OperationResultResponseSchema, response.data));

                                if (resp.success) {
                                    goto("/");
                                } else {
                                    toast.push("Failed to terminate demo session: " + resp.message);
                                }
                            } catch (err) {
                                console.error("Failed terminating demo session:", err);
                                toast.push("Failed to terminate demo session.");
                            }
                        }}
                        class="underline text-neutral-500 cursor-pointer">End Demo</button>
                {/if}
                <span
                    class="flex items-center text-sm font-semibold px-2 rounded-sm border border-neutral-900 bg-neutral-900 text-neutral-400 font-mono">
                    {formatTime(timeLeft)}
                </span>
            </div>
        {/if}
    </header>
    {@render children()}
</div>
