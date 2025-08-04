<script module lang="ts">
    import { writable } from "svelte/store";
    import CarouselItem from "./CarouselItem.svelte";
    import UserSearchMenu from "./_menus/UserSearchMenu.svelte";
    import UserSummary from "./_menus/ConfirmMenu.svelte";
    import AccessCodeMenu from "./_menus/AccessCodeMenu.svelte";

    type CarouselDirection = "forward" | "backward";

    let carouselState = $state({
        currentIndex: 0,
        previousIndex: 0,
        isAnimating: false,
        direction: "forward" as CarouselDirection,
    });

    const TOTAL_MENUS = 3;
    const ANIMATION_DURATION = 300;

    function navigateToMenu(targetIndex: number, direction: CarouselDirection) {
        if (
            carouselState.isAnimating ||
            targetIndex < 0 ||
            targetIndex >= TOTAL_MENUS ||
            targetIndex === carouselState.currentIndex
        ) {
            return;
        }

        carouselState.direction = direction;
        carouselState.previousIndex = carouselState.currentIndex;
        carouselState.isAnimating = true;

        carouselState.currentIndex = targetIndex;

        setTimeout(() => {
            carouselState.isAnimating = false;
        }, ANIMATION_DURATION);
    }

    export function nextMenu() {
        navigateToMenu(carouselState.currentIndex + 1, "forward");
    }

    export function previousMenu() {
        navigateToMenu(carouselState.currentIndex - 1, "backward");
    }

    export type SearchState = "idle" | "searching" | "waiting";

    type User = {
        robloxId: number;
        username: string;
        displayName: string;
        profileUrl?: string;
    };

    export const resultsPanelStore = writable<{ state: "hidden" | "error" } | { state: "results"; results: User[] }>({
        state: "hidden",
    });
    export const searchStateStore = writable<SearchState>("idle");
    export const searchQueryStore = writable<string>("");
    export const accessCodeStore = writable<string>("");
    export const selectedUserStore = writable<User | null>(null);
</script>

<main class="flex flex-col items-center justify-center h-screen">
    <div class="carousel-wrapper">
        <CarouselItem {carouselState} menuIndex={0}>
            <UserSearchMenu />
        </CarouselItem>

        <CarouselItem {carouselState} menuIndex={1}>
            <UserSummary />
        </CarouselItem>

        <CarouselItem {carouselState} menuIndex={2}>
            <AccessCodeMenu />
        </CarouselItem>
    </div>
</main>

<style>
    .carousel-wrapper {
        position: relative;
        overflow-x: hidden;
        width: 80vw;
        min-width: 200px;
        max-width: 500px;
        height: 100%;
        display: flex;
    }
</style>
