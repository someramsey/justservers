<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        class?: string;
        onclick?: () => void;
        disabled?: boolean;
        variant: "filled" | "outlined" | "sunken";
        children?: Snippet;
    }

    let { class: className = "", onclick, disabled = false, variant, children }: Props = $props();

    const baseClasses = "rounded-lg transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed";

    const variantClasses = $derived(() => {
        switch (variant) {
            case "filled":
                return "text-black bg-neutral-300 hover:bg-neutral-100";
            case "sunken":
                return "bg-sunken text-neutral-200 active:bg-neutral-600 active:text-neutral-100";
            case "outlined":
                return "outline-2 outline-neutral-200 hover:bg-neutral-700 hover:outline-neutral-300 active:bg-neutral-300 active:text-neutral-900";
        }
    });

    const buttonClasses = $derived(`${baseClasses} ${variantClasses()} ${className}`);
</script>

<button class={buttonClasses} {disabled} {onclick} type="button">
    {@render children?.()}
</button>

<style>
    .bg-sunken {
        background-color: rgb(12, 12, 12);
    }

    .bg-sunken:hover {
        background-color: rgb(24, 24, 24);
    }
    
    .bg-sunken:active {
        background-color: rgb(34, 34, 34);
    }
</style>
