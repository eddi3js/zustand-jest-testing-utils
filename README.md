React Testing Store Utils is a set of utility functions designed to simplify testing custom stores in your React applications. The package is compatible with Zustand and provides functions for creating mock stores, replacing stores, rendering components with custom stores, and resetting stores.

Installation
Install the package using npm:

```
npm install react-testing-store-utils
```

## Usage

First, import the utility functions from the package:

```
import {
  createTestStore,
  createMockStore,
  replaceStore,
  renderWithStore,
  resetStore,
} from 'react-testing-store-utils';
```

## Creating a Test Store

Use the createTestStore function to create a custom store with an initial state and custom actions:

```
const initialState = { count: 0 };
const customActions = (set) => ({
  increment: () => set((state) => ({ count: state.count + 1 })),
});

const store = createTestStore(initialState, customActions);
```

## Creating a Mock Store

Use the createMockStore function to create a mock store with an initial state, custom actions, and optional action overrides:

```
const initialState = { count: 0 };
const customActions = (set) => ({
  increment: () => set((state) => ({ count: state.count + 1 })),
});

const overrides = { increment: () => {} };

const mockStore = createMockStore(initialState, customActions, overrides);
```

## Replacing a Store

Use the replaceStore function to replace an old store with a new store:

```
const newStore = replaceStore(oldStore, mockStore);
```

## Rendering a Component with a Custom Store

Use the renderWithStore function to render a component with a custom store. This function internally uses the React Testing Library's render method:

```
import { MyComponent } from './MyComponent';

const { getByText } = renderWithStore(<MyComponent />, store);
```

## Resetting a Store

Use the resetStore function to reset a store to its initial state:

`resetStore(store, initialState);`

### Example

Here's an example of how to use React Testing Store Utils in a test:

```
import {
  createMockStore,
  renderWithStore,
} from 'react-testing-store-utils';
import { fireEvent, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

test('MyComponent should update the count on button click', () => {
  const initialState = { count: 0 };
  const customActions = (set) => ({
    increment: () => set((state) => ({ count: state.count + 1 })),
  });

  const store = createMockStore(initialState, customActions);
  renderWithStore(<MyComponent />, store);

  fireEvent.click(screen.getByText('Increment'));

  expect(store.getState().count).toBe(1);
});
```

## License

React Testing Store Utils is released under the MIT License.

## Contributing

Feel free to open issues or submit pull requests to help improve this package. Your contributions are always welcome!
