<script>
    import Button from "$lib/Button.svelte";
    import Circle from "$lib/icons/Circle.svelte";

    let gameName = "BloxFruits";
    let gameImage = "/blox.png";
</script>

<div class="group" tabindex="0" role="button">
    <img draggable="false" src={gameImage} alt={gameName} class="rounded w-full h-full object-cover" />

    <div class="card-overlay">
        <span class="flex items-center">
            <h3 class="text-white text-xl font-semibold">{gameName}</h3>
            <Circle color="lightgray" />
            <span class="font-light text-neutral-300">2/20</span>
        </span>
        <Button variant="outlined" class="px-4 py-1">Join</Button>
    </div>
</div>

<style>
    .group {
        background-color: rgb(64 64 64);
        border-radius: 0.5rem;
        box-shadow:
            0 4px 6px -1px rgb(0 0 0 / 0.1),
            0 2px 4px -2px rgb(0 0 0 / 0.1);
        width: 17.5rem;
        position: relative;
        cursor: pointer;
        overflow: hidden;
        transition: transform 300ms;
    }

    .card-overlay {
        position: absolute;
        top: calc(2 / 3 * 100%);
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem;
        background-color: rgb(23 23 23 / 0.85);
        opacity: 0;
        backdrop-filter: blur(12px);
        transition: opacity 300ms;
    }
    
    .group:hover {
        transform: scale(1.05);
    }
    
    .group:hover .card-overlay {
        opacity: 1;
    }

    @media (hover: none) {
        .group:focus-within {
            transform: scale(1.05);
        }

        .group:focus-within .card-overlay {
            opacity: 1;
        }
    }

</style>
