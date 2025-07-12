<script>
    import { goto } from "$app/navigation";
    import { Button } from "$lib";
</script>

<main class="flex flex-col items-center justify-center mt-[10vh] m-10">
    <div class="max-w-[800px] flex flex-col items-center text-center">
        <h1 class="hammersmith-regular text-5xl">Just Servers</h1>
        <p class="hanken-regular text-neutral-300 max-w-100 text-2xl">
            We want paid private servers to be available to <b>everyone</b> for free
        </p>

        <Button variant="filled" class="px-4 py-2 mt-10 font-bold m-auto flex" onclick={() => goto("/verify")}>
            <span class="text-lg m-auto">Continue with Roblox</span>
            <img src="roblox.png" width={24} height={24} alt="Roblox Logo" class="inline-block m-1 ml-2" />
        </Button>

        <p class="mt-8 max-w-100 text-neutral-500">Just want to test it? No worries you can try it out before you decide if you would like to verify your account</p>
        <Button variant="outlined" class="px-4 py-2 mt-4 font-normal m-auto flex" onclick={() => console.log("clicked")}>Try a one-time demo</Button>
    </div>

    <h2 class="mt-20 text-3xl text-neutral-300 text-center">Currently available games</h2>
    <div class="mt-10 flex flex-wrap justify-center ml-10 mr-10 max-w-[1100px] gap-8">
        <!-- TODO: Set actual game thnumbnails -->
        <img src={`blox.png`} alt="blox fruits" class="w-70 rounded h-full object-cover" />
        <img src={`blox.png`} alt="blox fruits" class="w-70 rounded h-full object-cover" />
        <img src={`blox.png`} alt="blox fruits" class="w-70 rounded h-full object-cover" />
    </div>
</main>

<footer class="flex flex-col mt-10 p-12">
    <p class="text-xl text-neutral-400 text-center">Not what you wanted? Join our discord server to recommend more games</p>
    <div class="flex flex-wrap items-center justify-evenly mt-8">
        <!-- TODO: Add links for socials -->
        <a href="discord" class="p-5">
            <img src="./social/discord.png" width="140" alt="" />
        </a>
        <a href="discord" class="p-5">
            <img src="./social/youtube.png" width="130" alt="" />
        </a>
        <a href="discord" class="p-5">
            <img src="./social/tiktok.png" width="140" alt="" />
        </a>
    </div>
</footer>
