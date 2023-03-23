"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetStore = exports.renderWithStore = exports.replaceStore = exports.createMockStore = exports.createTestStore = void 0;
const react_1 = __importDefault(require("react"));
const zustand_1 = __importDefault(require("zustand"));
const react_2 = require("@testing-library/react");
const createTestStore = (initialState, customActions) => {
    const store = (0, zustand_1.default)((set) => (Object.assign(Object.assign({}, initialState), customActions(set))));
    return store;
};
exports.createTestStore = createTestStore;
function createMockStore(initialState, customActions, partials, overrides) {
    let state = initialState;
    let listeners = [];
    const getState = () => state;
    const setState = (partial, replace = false) => {
        const newState = typeof partial === "function" ? partial(state) : Object.assign(Object.assign({}, state), partial);
        state = replace ? newState : Object.assign(Object.assign({}, state), newState);
        listeners.forEach((listener) => listener());
    };
    const subscribe = (listener) => {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter((l) => l !== listener);
        };
    };
    const destroy = () => {
        listeners = [];
    };
    const customActionsObj = customActions(setState);
    const store = Object.assign({ getState,
        setState,
        subscribe,
        destroy }, customActionsObj);
    if (partials) {
        partials.forEach((partial) => store.setState(partial));
    }
    if (overrides) {
        Object.assign(store, overrides);
    }
    return store;
}
exports.createMockStore = createMockStore;
const replaceStore = (oldStore, newStore) => {
    return newStore;
};
exports.replaceStore = replaceStore;
function Provider({ store, context, children, }) {
    return react_1.default.createElement(context.Provider, { value: store }, children);
}
function renderWithStore(ui, store, storeContext, options) {
    const wrapper = (props) => (react_1.default.createElement(Provider, { store: store, context: storeContext }, props.children));
    return (0, react_2.render)(ui, Object.assign({ wrapper }, options));
}
exports.renderWithStore = renderWithStore;
const resetStore = (store, initialState) => {
    store.setState(initialState);
};
exports.resetStore = resetStore;
//# sourceMappingURL=index.js.map