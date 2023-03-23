import * as React from "react";
import create from "zustand";
import { RenderOptions, RenderResult, render } from "@testing-library/react";

export const createTestStore = <T extends object>(
  initialState: T,
  customActions: (set: (state: StateCreator<T>) => void) => object
) => {
  const store = create((set) => ({
    ...initialState,
    ...customActions(set),
  }));

  return store;
};

type StateCreator<TState, TPartial = {}, TKeys = {}, T = TState> =
  | (Partial<TState> & TPartial)
  | ((state: TState, ...extra: TKeys[]) => TState & T);

interface Store<TState> {
  getState: () => TState;
  setState: (partial: StateCreator<TState>, replace?: boolean) => void;
  subscribe: (listener: () => void) => () => void;
  destroy: () => void;
}

export function createMockStore<TState, TCustomActions>(
  initialState: TState,
  customActions: (
    set: (partial: StateCreator<TState>) => void
  ) => TCustomActions,
  partials?: Partial<TState>[],
  overrides?: Partial<TCustomActions>
): Store<TState> & TCustomActions {
  let state: TState = initialState;
  let listeners: (() => void)[] = [];

  const getState = () => state;

  const setState = (partial: StateCreator<TState>, replace = false) => {
    const newState =
      typeof partial === "function" ? partial(state) : { ...state, ...partial };

    state = replace ? newState : { ...state, ...newState };
    listeners.forEach((listener) => listener());
  };

  const subscribe = (listener: () => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  };

  const destroy = () => {
    listeners = [];
  };

  const customActionsObj = customActions(setState);

  const store: Store<TState> & TCustomActions = {
    getState,
    setState,
    subscribe,
    destroy,
    ...customActionsObj,
  };

  if (partials) {
    partials.forEach((partial) => store.setState(partial));
  }

  if (overrides) {
    Object.assign(store, overrides);
  }

  return store;
}

export const replaceStore = <T extends object>(oldStore: T, newStore: T): T => {
  return newStore;
};

interface ProviderProps<T> {
  store: T;
  context: React.Context<T>;
}

function Provider<T>({
  store,
  context,
  children,
}: React.PropsWithChildren<ProviderProps<T>>): JSX.Element {
  return <context.Provider value={store}>{children}</context.Provider>;
}

export function renderWithStore<T>(
  ui: React.ReactElement,
  store: T,
  storeContext: React.Context<T>,
  options?: Omit<RenderOptions, "queries">
): RenderResult {
  const wrapper = (props: React.PropsWithChildren<{}>): JSX.Element => (
    <Provider store={store} context={storeContext}>
      {props.children}
    </Provider>
  );

  return render(ui, { wrapper, ...options });
}

export const resetStore = <T extends object>(
  store: any,
  initialState: T
): void => {
  store.setState(initialState);
};
