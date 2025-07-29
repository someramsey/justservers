<script lang="ts">
    interface Props {
        class?: string;
    }

    const { class: additionalClasses }: Props = $props();
</script>

<div class="w-0.5 {additionalClasses}"></div>
