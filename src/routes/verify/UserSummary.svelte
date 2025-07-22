<script lang="ts">
    import type { User } from "./types/user";

    export let user: User | null = null;
</script>

<div class="flex flex-col items-center gap-2">
    <img src={user?.profilePicture ?? "/default-profile.png"} alt="User Profile" class="w-24 h-24 rounded-full object-cover" />
    <h1 class="text-xl font-semibold">{user?.username ?? "Unknown User"}</h1>
    <span class="text-sm text-gray-500">{user?.id ?? "No ID available"}</span>
</div>
