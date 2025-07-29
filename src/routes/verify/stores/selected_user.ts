import { writable } from "svelte/store";
import type { User } from "../types/user";

export const selectedUserStore = writable<User | null>(null);
