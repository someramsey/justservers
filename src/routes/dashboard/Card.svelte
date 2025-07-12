<script>
    import Button from "$lib/Button.svelte";

    let gameName = "BloxFruits";
    let gameImage = "/blox.png";
</script>

<div class="bg-neutral-800 rounded-lg shadow-md w-70 relative group cursor-pointer overflow-hidden transition-transform duration-300 hover:scale-105">
    <img src={gameImage} alt={gameName} class="rounded w-full h-full object-cover" />
    
    <div class="absolute flex flex-col p-4 inset-0 bg-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 class="text-white text-xl font-semibold">{gameName}</h3>
        <span class="font-light text-neutral-400">Online: 2/20</span>
        <span class="font-light text-neutral-400">Last played: 2 Days Ago</span>
        <Button variant="outlined" class="mt-auto p-2">Join</Button>
    </div>
</div>
