import { createMockStore } from "../src";

describe("createMockStore", () => {
  it("should set the initial state to the passed-in value", () => {
    const initialState = { foo: "bar" };
    const mockStore = createMockStore(initialState, (set) => ({}));

    expect(mockStore.getState()).toEqual(initialState);
  });

  it("should update the state when setState is called", () => {
    const mockStore = createMockStore({ foo: "bar" }, (set) => ({}));
    const newState = { foo: "baz" };

    mockStore.setState(newState);

    expect(mockStore.getState()).toEqual(newState);
  });

  it("should call subscribed listeners when setState is called", () => {
    const mockStore = createMockStore({ foo: "bar" }, (set) => ({}));
    const listener1 = jest.fn();
    const listener2 = jest.fn();

    mockStore.subscribe(listener1);
    mockStore.subscribe(listener2);
    mockStore.setState({ foo: "baz" });

    expect(listener1).toHaveBeenCalled();
    expect(listener2).toHaveBeenCalled();
  });

  it("should unsubscribe listeners when the destroy method is called", () => {
    const mockStore = createMockStore({ foo: "bar" }, (set) => ({}));
    const listener1 = jest.fn();
    const listener2 = jest.fn();

    mockStore.subscribe(listener1);
    const unsubscribe = mockStore.subscribe(listener2);

    mockStore.setState({ foo: "baz" });
    expect(listener1).toHaveBeenCalled();
    expect(listener2).toHaveBeenCalled();

    unsubscribe();
    mockStore.setState({ foo: "qux" });

    expect(listener1).toHaveBeenCalledTimes(2);
    expect(listener2).toHaveBeenCalledTimes(1);
  });

  it("should apply overrides to the initial state", () => {
    const mockStore = createMockStore(
      { incrementCount: 0 },
      (set) => ({
        increment: () =>
          set((state) => ({
            ...state,
            incrementCount: state.incrementCount + 1,
          })),
      }),
      [{ incrementCount: 1 }]
    );

    expect(mockStore.getState()).toEqual({ incrementCount: 1 });
    mockStore.increment();
    expect(mockStore.getState()).toEqual({ incrementCount: 2 });
  });

  it("should apply overrides to the initial state", () => {
    const mockStore = createMockStore({ foo: "bar" }, (set) => ({}), [
      { foo: "baz" },
    ]);

    expect(mockStore.getState()).toEqual({ foo: "baz" });
  });

  it("should apply overrides to the custom actions", () => {
    const mockStore = createMockStore(
      { foo: "bar", count: 1 },
      (set) => ({
        increment: () => set((state) => ({ ...state, count: state.count + 1 })),
      }),
      undefined,
      { increment: () => console.log("overridden!") }
    );

    mockStore.increment();

    expect(mockStore.getState()).toEqual({ foo: "bar", count: 1 });
  });
});
