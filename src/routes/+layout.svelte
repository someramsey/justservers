<script lang="ts">
    import "../app.css";
    import { SvelteToast } from "@zerodevx/svelte-toast";
    let { children } = $props();
</script>

<SvelteToast options={{ duration: 7000 }} />
{@render children()}
