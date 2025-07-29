import { writable } from "svelte/store";
import type { User } from "../types/user";

export type ResultsPanelData =
    | {
        state: "hidden" | "no-results" | "error";
    }
    | {
        state: "results";
        results: User[];
    };

function createResultsPanelStore() {
    const initialState: ResultsPanelData = { state: "hidden" };
    const { set, subscribe, update } = writable<ResultsPanelData>(initialState);

    return {
        subscribe,
        update,
        
        hide() {
            set({ state: "hidden" });
        },

        showError() {
            set({ state: "error" });
        },

        showResults(results: User[]) {
            if (results.length === 0) {
                set({ state: "no-results" });
            } else {
                set({ state: "results", results });
            }
        },
        
        reset() {
            set(initialState);
        },
    };
}

export const resultsPanelStore = createResultsPanelStore();
