import { writable } from "svelte/store";

export type SearchState = "idle" | "searching" | "waiting";

export const searchStateStore = writable<SearchState>("idle");
export const searchQueryStore = writable<string>("");
