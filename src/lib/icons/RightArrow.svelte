<script lang="ts">
    export let size: string = "w-5 h-5";
    export let color: string = "currentColor";
</script>

<svg 
    class={size} 
    fill="none" 
    stroke={color} 
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
>
    <path 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        stroke-width="2" 
        d="M9 5l7 7-7 7"
    />
</svg>
