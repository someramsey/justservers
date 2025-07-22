import type { User } from "./user";

export type ResultsPanelData = {
    state: "hidden" | "no-results" | "error"
} | {
    state: "results",
    results: User[],
};
