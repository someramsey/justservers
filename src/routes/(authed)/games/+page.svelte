<script>
    import Card from "./Card.svelte";
</script>

<main class="flex-auto flex flex-col items-center justify-center mt-5 mx-10">
    <h2 class="font-light text-center text-4xl text-neutral-400">Select a game you want to play</h2>

    <div class="my-15 flex flex-wrap justify-center max-w-[1100px] gap-8">
        <Card
            gameName="Blox Fruits"
            thumbnailUrl="./games/bloxfruits.png"
            gameLink="https://www.roblox.com/share?code=9eb93b455b73b14889524c74831ad93c&type=Server" />

        <Card
            gameName="Roghoul"
            thumbnailUrl="./games/roghoul.png"
            gameLink="https://www.roblox.com/share?code=171a79525f9244449d883a15f037052f&type=Server" />

        <!-- {#each data.games as game}
            <Card gameName={game.name} gameLink={game.link} thumbnailUrl={game.thumbnailUrl}  />
        {/each} -->
    </div>
</main>
