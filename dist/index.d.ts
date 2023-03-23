import React from "react";
import { RenderOptions, RenderResult } from "@testing-library/react";
export declare const createTestStore: <T extends object>(initialState: T, customActions: (set: (state: StateCreator<T, {}, {}, T>) => void) => object) => import("zustand").UseBoundStore<import("zustand").StoreApi<unknown>>;
type StateCreator<TState, TPartial = {}, TKeys = {}, T = TState> = (Partial<TState> & TPartial) | ((state: TState, ...extra: TKeys[]) => TState & T);
interface Store<TState> {
    getState: () => TState;
    setState: (partial: StateCreator<TState>, replace?: boolean) => void;
    subscribe: (listener: () => void) => () => void;
    destroy: () => void;
}
export declare function createMockStore<TState, TCustomActions>(initialState: TState, customActions: (set: (partial: StateCreator<TState>) => void) => TCustomActions, partials?: Partial<TState>[], overrides?: Partial<TCustomActions>): Store<TState> & TCustomActions;
export declare const replaceStore: <T extends object>(oldStore: T, newStore: T) => T;
export declare function renderWithStore<T>(ui: React.ReactElement, store: T, storeContext: React.Context<T>, options?: Omit<RenderOptions, "queries">): RenderResult;
export declare const resetStore: <T extends object>(store: any, initialState: T) => void;
export {};
