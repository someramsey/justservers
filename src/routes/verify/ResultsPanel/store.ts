import { writable } from 'svelte/store';
import type { User } from '../types/user';

type PanelState = "hidden" | "no-results" | "error" | "results";

interface ResultsState {
    state: PanelState;
    users: User[];
}

const initialState: ResultsState = {
    state: "hidden",
    users: []
};

function createResultsStore() {
    const { subscribe, set, update } = writable<ResultsState>(initialState);

    return {
        subscribe,
        showResults: (users: User[]) => {
            update(state => ({
                ...state,
                users,
                state: users.length > 0 ? "results" : "no-results"
            }));
        },
        showError: () => {
            update(state => ({
                ...state,
                state: "error"
            }));
        },
        hide: () => {
            update(state => ({
                ...state,
                state: "hidden",
                users: []
            }));
        },
        isVisible: (state: ResultsState) => state.state !== "hidden",
        reset: () => set(initialState)
    };
}

export const resultsStore = createResultsStore();
