<script lang="ts">
    interface Props {
        class?: string;
        onclick?: () => void;
        disabled?: boolean;
        variant: "filled" | "outlined";
        children?: import("svelte").Snippet;
    }

    let { class: className = "", onclick, disabled = false, variant, children }: Props = $props();

    const baseClasses = "rounded-lg transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed";

    const variantClasses = $derived(() => {
        switch (variant) {
            case "filled":
                return "text-black  bg-neutral-300 hover:bg-neutral-100";
            case "outlined":
                return "border-2 border-neutral-200 hover:bg-neutral-700 hover:border-neutral-300";
        }
    });

    const buttonClasses = $derived(`${baseClasses} ${variantClasses()} ${className}`);
</script>

<button class={buttonClasses} {disabled} {onclick} type="button">
    {@render children?.()}
</button>
