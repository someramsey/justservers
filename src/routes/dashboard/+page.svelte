<script>
    import Card from "./Card.svelte";
</script>

<header class="m-7 flex items-center">
    <h1 class="hammersmith-regular text-3xl">Just Servers</h1>
    <div class="bg-neutral-700 w-0.5 h-10 ml-4 mr-4"></div>

    <nav class="flex gap-4 text-neutral-400">
        <a href="/" class="underline flex items-center justify-center gap-1.5">
            <span class="icon-[material-symbols--home-rounded] w-7 h-7"></span>
            Home
        </a>
        <a href="/about" class="underline flex items-center justify-center gap-1.5">
            <span class="icon-[material-symbols--info-rounded] w-7 h-7"></span>
            About
        </a>
    </nav>
</header>

<h2 class="font-light text-center text-3xl text-neutral-400">Select a game you want to play</h2>
<main class="m-8 flex justify-center">
    <div class="flex flex-wrap justify-center max-w-[1100px] gap-8">
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
    </div>
</main>
