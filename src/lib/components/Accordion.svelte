<script lang="ts">
    import { type Snippet } from "svelte";

    interface Props {
        title: string;
        isOpen?: boolean;
        class?: string;
        children: Snippet;
    }

    let { title, isOpen = false, class: className = "", children }: Props = $props();
    
    let isAccordionOpen = $state<boolean>(isOpen);
</script>

<div class="border border-neutral-800 rounded-lg overflow-hidden {className}">
    <button
        class="w-full flex items-center justify-between p-4 text-left hover:bg-neutral-900 transition-colors"
        onclick={() => (isAccordionOpen = !isAccordionOpen)}
    >
        <span class="text-lg">{title}</span>
        <svg
            class="w-5 h-5 transform transition-transform {isAccordionOpen ? 'rotate-180' : ''}"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
    </button>

    {#if isAccordionOpen}
        <div class="border-t border-neutral-800 p-4">
            {@render children()}
        </div>
    {/if}
</div>
