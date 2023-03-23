"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetStore = exports.renderWithStore = exports.replaceStore = exports.createMockStore = exports.createTestStore = void 0;
const React = __importStar(require("react"));
const zustand_1 = __importDefault(require("zustand"));
const react_1 = require("@testing-library/react");
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
    return React.createElement(context.Provider, { value: store }, children);
}
function renderWithStore(ui, store, storeContext, options) {
    const wrapper = (props) => (React.createElement(Provider, { store: store, context: storeContext }, props.children));
    return (0, react_1.render)(ui, Object.assign({ wrapper }, options));
}
exports.renderWithStore = renderWithStore;
const resetStore = (store, initialState) => {
    store.setState(initialState);
};
exports.resetStore = resetStore;
