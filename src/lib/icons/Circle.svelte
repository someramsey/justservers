<script lang="ts">
    export let width = 2;
    export let height = 2;
    export let color: string = "currentColor";
</script>

<svg {width} {height} fill={color} class="mx-1.5 w-1.5 h-1.5" viewBox="0 0 4 4">
    <circle cx="2" cy="2" r="2" />
</svg>
