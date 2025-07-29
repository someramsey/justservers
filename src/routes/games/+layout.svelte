<script lang="ts">
    const { children } = $props();
</script>

<header class="m-7 flex justify-between">
    <h1 class="hammersmith-regular text-3xl">Just Servers</h1>

    <div class="flex items-center gap-3">
        <img src="/profile_placeholder.jpg" alt="Avatar" class="w-10 h-10 rounded-full" />
        <h2 class="font-light text-2xl">Username</h2>
    </div>
</header>

<main class="flex flex-col h-[100%]">
    {@render children()}
</main>
