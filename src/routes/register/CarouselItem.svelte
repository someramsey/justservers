<script lang="ts">
    import type { Snippet } from "svelte";

    type CarouselState = {
        currentIndex: number;
        previousIndex: number;
        isAnimating: boolean;
        direction: "forward" | "backward";
    };

    interface Props {
        carouselState: CarouselState;
        menuIndex: number;
        children: Snippet;
    }

    let { carouselState, menuIndex, children }: Props = $props();

    let isCurrentMenu = $derived(carouselState.currentIndex === menuIndex);
    let isPreviousMenu = $derived(carouselState.previousIndex === menuIndex);

    let isEntering = $derived(carouselState.isAnimating && isCurrentMenu);
    let isExiting = $derived(carouselState.isAnimating && isPreviousMenu);
    
    let canShowMenu = $derived(isCurrentMenu || isExiting);
</script>

{#if canShowMenu}
    <div
        class="menu-content"
        class:forward={carouselState.direction === "forward"}
        class:backward={carouselState.direction === "backward"}
        class:entering={isEntering}
        class:exiting={isExiting}>
        {@render children()}
    </div>
{/if}

<style>
    .menu-content {
        position: absolute;
        width: 100%;
        height: 100%;
        padding: 2rem;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 8px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        transition: none;
        will-change: transform, opacity;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
    }

    .menu-content.forward.exiting {
        animation: slideOutToLeft 0.3s ease-in-out forwards;
    }

    .menu-content.forward.entering {
        animation: slideInFromRight 0.3s ease-in-out forwards;
    }

    .menu-content.backward.exiting {
        animation: slideOutToRight 0.3s ease-in-out forwards;
    }

    .menu-content.backward.entering {
        animation: slideInFromLeft 0.3s ease-in-out forwards;
    }

    @keyframes slideInFromRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideInFromLeft {
        from {
            opacity: 0;
            transform: translateX(-100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOutToLeft {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(-100%);
        }
    }

    @keyframes slideOutToRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
</style>
