import { writable } from "svelte/store";

export type MenuState = "search" | "confirm";

export const menuStateStore = writable<MenuState>("search");
